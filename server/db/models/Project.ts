'use strict';
import * as Sequelize from 'sequelize';
import * as libAwait from '../../lib/await';
import { syncify } from '../../lib/PromiseUtils';
import { saveOriginalImage } from '../../lib/ModelUtils';

export const PROJECT_OBJS_TYPE = 'ProjectObjects';

interface IJsonField {
    contractors: {
        contractor_id: number;
        persons_id: number[];
        scope: string;
    }[];
}

async function savePhoto(project) {
	await saveOriginalImage(project.dataValues.photo, 'Project', project.id);
}

function beforeSave(models, project) {
    project.json_field = {};
    const contractors:any[] = project.dataValues.contractors;
    const contractors_scope:string[] = project.dataValues.contractors_scope;
    const contractor1Persons:any[] = project.dataValues.contractor1Persons;
    const contractor2Persons:any[] = project.dataValues.contractor2Persons;
    if(contractors || contractors_scope) {
        if(contractors.length != contractors_scope.length) {
            throw 'Número de contratadas diferente do número de escopos de contratadas';
        }
        const jsonField:IJsonField = { contractors: [] };
        for(let i = 0; i < contractors_scope.length; i++) {
            jsonField.contractors.push({
                contractor_id: contractors[i].id,
                scope: contractors_scope[i],
                persons_id: []
            });
        }

        if(contractor1Persons && jsonField.contractors.length >= 1) {
            jsonField.contractors[0].persons_id = contractor1Persons.map(p => {
                return p.id;
            });
        }
        
        if(contractor2Persons && jsonField.contractors.length >= 2) {
            jsonField.contractors[1].persons_id = contractor2Persons.map(p => {
                return p.id;
            });
        }
        project.json_field = jsonField;
    }
}

async function updateObjects(models, project) {
    const Association:any = models['Association'];
    const delOpts = {
        where: {
            type: PROJECT_OBJS_TYPE,
            src_id: project.id 
        }
    };
    await Association.destroy(delOpts);
    const objects:any[] = project.dataValues.objects;
    if(!objects) return;
    for(let object of objects) {
        let association = {
            type: PROJECT_OBJS_TYPE,
            src_model: 'Project',
            src_id: project.id,
            dest_model: object.model,
            dest_id: object.id
        }
        await Association.create(association);
    }
}

async function saveAll(models, project) {
    beforeSave(models, project);
    await updateObjects(models, project);
}

function defineHooks(models) {
	models.Project.hook('beforeCreate', beforeSave.bind(this, models));
	models.Project.hook('afterCreate', updateObjects.bind(this, models));
	models.Project.hook('beforeUpdate', saveAll.bind(this, models));
}

module.exports = function (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
    const Project = sequelize.define('Project', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        scope: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        value: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        json_field: {
            type: Sequelize.JSON,
            allowNull: true
        },            
        updates: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        segment_type: {
            type: Sequelize.STRING,
            allowNull: true
        },
        stage: {
            type: Sequelize.ENUM('CAPEX', 'OPEX'),
            allowNull: false
        },
		contractors: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(!this.dataValues.json_field) return null;
                const jsonField:IJsonField = JSON.parse(this.dataValues.json_field);
                if(!jsonField.contractors) return [];
                const company = sequelize.models['Company'];
                return jsonField.contractors.map(c => {
                    return {
                        id: c.contractor_id,
                        name: libAwait.await( company.findById( c.contractor_id ) ).name
                    };
                });
            },
		},
		contractors_scope: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(!this.dataValues.json_field) return null;
                const jsonField:IJsonField = JSON.parse(this.dataValues.json_field);
                if(!jsonField.contractors) return [];
                return jsonField.contractors.map(c => {
                    return c.scope;
                });
            },
		},
		contractor1Persons: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(!this.dataValues.json_field) return null;
                const jsonField:IJsonField = JSON.parse(this.dataValues.json_field);
                if(!jsonField.contractors) return [];
                const Person = sequelize.models['Person'];
                if(jsonField.contractors.length >= 1) {
                    return jsonField.contractors[0].persons_id.map(person_id => {
                        let name = libAwait.await( Person.findById(person_id) ).name;
                        return {
                            id: person_id,
                            name
                        };
                    });
                }
            },
		},
		contractor2Persons: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(!this.dataValues.json_field) return null;
                const jsonField:IJsonField = JSON.parse(this.dataValues.json_field);
                if(!jsonField.contractors) return [];
                const Person = sequelize.models['Person'];
                if(jsonField.contractors.length >= 2) {
                    return jsonField.contractors[1].persons_id.map(person_id => {
                        let name = libAwait.await( Person.findById(person_id) ).name;
                        return {
                            id: person_id,
                            name
                        };
                    });
                }
            },
		},
		objects: {
            type: DataTypes.VIRTUAL,
            get: function() {
                const Association:any = sequelize.models['Association'];
                const queryOpts = {
                    where: {
                        type: PROJECT_OBJS_TYPE,
                        src_id: this.id
                    }
                };
                const associations:any[] = libAwait.await( Association.findAll(queryOpts) );
                return associations.map(association => {
                    const modOpt = {  where: { name: association.dest_model } };
                    const obj = libAwait.await( sequelize.models[association.dest_model].findById(association.dest_id) );
                    return {
                        id: association.dest_id,
                        model: association.dest_model,
                        name: obj.name
                    };
                });
            },
		},
		photo: {
            type: DataTypes.VIRTUAL,
            get: function() {
                return 'image';
            },
		},
    },
        {
            underscored: true,
            tableName: 'projects',
            classMethods: {
                associate: function (models) {
                    {
                        const ownerOpts: Sequelize.AssociationOptionsBelongsTo = {
                            as: 'owner',
                            foreignKey: { allowNull: true }
                        };
                        Project.belongsTo(models.Company, ownerOpts);
                    }

                    {
                        const puOpts: Sequelize.AssociationOptionsBelongsTo = {
                            as: 'production_unit',
                            foreignKey: { allowNull: true }
                        };
                        Project.belongsTo(models.ProductionUnit, puOpts);
                    }

                    {
                        const opts: Sequelize.AssociationOptionsBelongsTo = {
                            as: 'oil_field',
                            foreignKey: { allowNull: true }
                        };
                        Project.belongsTo(models.OilField, opts);
                    }
                },
			    defineHooks: defineHooks
            },    
            /*hooks: {
                beforeCreate: beforeSave.bind(this, sequelize),
                beforeUpdate: beforeSave.bind(this, sequelize)
            }*/
        }
    );

    return Project;
};