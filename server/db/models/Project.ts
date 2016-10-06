'use strict';
import * as Sequelize from 'sequelize';
import * as libAwait from '../../lib/await';
import { syncify } from '../../lib/PromiseUtils';
import { saveOriginalImage } from '../../lib/ModelUtils';
import { IProjectJsonField } from '../../../common/Interfaces';

export const PROJECT_OBJS_TYPE = 'ProjectObjects';

async function savePhoto(project) {
	await saveOriginalImage(project.dataValues.photo, 'Project', project.id);
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

async function beforeUpdate(models, project) {
    await updateObjects(models, project);
    await savePhoto(project);
}

async function afterCreate(models, project) {
    await updateObjects(models, project);
    await savePhoto(project);
}

function defineHooks(models) {
	models.Project.hook('afterCreate', afterCreate.bind(this, models));
	models.Project.hook('beforeUpdate', beforeUpdate.bind(this, models));
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