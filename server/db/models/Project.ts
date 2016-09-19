'use strict';
import * as Sequelize from 'sequelize';

function beforeSave(project) {
    if(!project.json_field) {
        project.json_field = {};
    }
    const contractors = project.dataValues.contractors;
    const contractors_scope = project.dataValues.contractors_scope;
    const contractor1Persons = project.dataValues.contractor1Persons;
    const contractor2Persons = project.dataValues.contractor2Persons;
    if(contractors || contractors_scope) {
        if(contractors.length != contractors_scope.length) {
            throw 'Número de contratadas diferente do número de escopos de contratadas';
        }
        project.json_field.contractors = [];
        for(let i = 0; i < contractors_scope.length; i++) {
            project.json_field.contractors.push({
                contractor_id: contractors[i],
                scope: contractors_scope[i]
            });
        }

        if(contractor1Persons && project.json_field.contractors.length >= 1) {
            project.json_field.contractors[0].persons_id = contractor1Persons;
        }
        
        if(contractor2Persons && project.json_field.contractors.length >= 2) {
            project.json_field.contractors[1].persons_id = contractor2Persons;
        }
    }
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
		contractors: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(!this.dataValues.json_field) return null;
                const jsonField = JSON.parse(this.dataValues.json_field);
                return jsonField.contractors.map(c => {
                    return c.contractor_id;
                });
            },
		},
		contractors_scope: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(!this.dataValues.json_field) return null;
                const jsonField = JSON.parse(this.dataValues.json_field);
                return jsonField.contractors.map(c => {
                    return c.scope;
                });
            },
		},
		contractor1Persons: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(!this.dataValues.json_field) return null;
                const jsonField = JSON.parse(this.dataValues.json_field);
                if(jsonField.contractors.length >= 1) {
                    return jsonField.contractors[0].persons_id;
                }
            },
		},
		contractor2Persons: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(!this.dataValues.json_field) return null;
                const jsonField = JSON.parse(this.dataValues.json_field);
                if(jsonField.contractors.length >= 2) {
                    return jsonField.contractors[1].persons_id;
                }
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
            },    
            hooks: {
                beforeCreate: beforeSave,
                beforeUpdate: beforeSave
            }
        }
    );

    return Project;
};