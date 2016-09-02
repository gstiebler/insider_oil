'use strict';
import Sequelize = require('sequelize');
import ModelUtils = require('../../lib/ModelUtils');
import { IFrontEndProject } from '../../../common/Interfaces';
import { await } from '../../lib/await';

const milisecondsInADay = 1000 * 60 * 60 * 24;

function updateContractProjects(db, contract) {
    const projects:IFrontEndProject[] = contract.dataValues.projects;
    if(projects == null)
        return;
    const options = { where: { contract_id: contract.id } };
    return db.ContractProjects.destroy(options).then(() => {
        const newProjectRecords = [];
        for(var project of projects) {
            const projectRecord = { 
                contract_id: contract.id,
                model_id: project.model_id,
                obj_id: project.id,
                description: project.description
            };
            newProjectRecords.push(projectRecord);
        }
        return db.ContractProjects.bulkCreate(newProjectRecords);
    });
}

function defineHooks(db) {
	db.Contract.hook('afterCreate', updateContractProjects.bind(this, db));
	db.Contract.hook('beforeUpdate', updateContractProjects.bind(this, db));
}

module.exports = function (sequelize, DataTypes: Sequelize.DataTypes) {
    const Contract = sequelize.define('Contract', {
      user_uid: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
        supplier: {
            type: Sequelize.STRING,
            allowNull: true
        },
        supplier_identifier: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        contract_object: {
            type: Sequelize.STRING,
            allowNull: true
        },
        start: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        end: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        value: {
            type: Sequelize.DOUBLE,
            allowNull: true
        },
        currency: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        show_day_rate: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        situation: {
            type: Sequelize.STRING,
            allowNull: true
        },
        additives_ids: {
            type: Sequelize.STRING,
            allowNull: true,
            invisible: true
        },
        duration: {
            type: Sequelize.VIRTUAL,
            get: function() {
                const milisecondsDiff = this.end - this.start 
                return (milisecondsDiff / milisecondsInADay) + 1;
            }
        },
        day_rate: {
            type: Sequelize.VIRTUAL,
            get: function() {
                if(!this.show_day_rate)
                    return null;
                const duration = this.duration; 
                if(duration) {
                    return this.value / duration;
                } else {
                    return null;
                }
            }
        },
        projects: {
            type: DataTypes.VIRTUAL,
            get: function() {
                const projectsPromise = sequelize.models.ContractProjects.getProjects(sequelize, this.id);
                const projects = await( projectsPromise );
                return projects;
            }
        }
    },
        {
            underscored: true,
            tableName: 'contracts',
            classMethods: {
                associate: function (models) {
                    const bidOpts: Sequelize.AssociationOptionsBelongsTo = {
                        as: 'bid',
                        foreignKey: { allowNull: true }
                    };
                    Contract.belongsTo(models.Bid, bidOpts);
                    
                    Contract.belongsTo(models.Company, { as: 'contractor', foreignKey: { allowNull: true } } );
                    Contract.belongsTo(models.IndustrySegment, { as: 'segment', foreignKey: { allowNull: true } } );
                },
                defineHooks: defineHooks
            }
        }
    );
    return Contract;
};