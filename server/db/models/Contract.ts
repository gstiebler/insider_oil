'use strict';
import Sequelize = require('sequelize');
var await = require('../../lib/await');
import ModelUtils = require('../../lib/ModelUtils');

const milisecondsInADay = 1000 * 60 * 60 * 24;

function updateContract(contract) {
    const object: any[] = contract.dataValues.object;
    if (object == null || object.length != 1) {
        contract.model_id = null;
        contract.obj_id = null;
        return;
    }

    contract.model_id = object[0].model_id;
    contract.obj_id = object[0].id;
}

function defineHooks(db) {
    db.Contract.hook('beforeCreate', updateContract);
    db.Contract.hook('beforeUpdate', updateContract);
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
        obj_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            invisible: true
        },
        object: {
            type: DataTypes.VIRTUAL,
            get: ModelUtils.getObjRefField
        },
    },
        {
            underscored: true,
            tableName: 'contracts',
            classMethods: {
                associate: function (models) {
                    const modelOpts: Sequelize.AssociationOptionsBelongsTo = {
                        as: 'model',
                        foreignKey: { allowNull: true }
                    };
                    Contract.belongsTo(models.ModelsList, modelOpts);

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