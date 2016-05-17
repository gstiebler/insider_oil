'use strict';
import Sequelize = require('sequelize');
var await = require('../../lib/await');

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
            type: Sequelize.FLOAT,
            allowNull: true
        },
        situation: {
            type: Sequelize.STRING,
            allowNull: true
        },
        additives_ids: {
            type: Sequelize.STRING,
            allowNull: true
        },
        obj_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        object: {
            type: DataTypes.VIRTUAL,
            get: function () {
                const modelRecord = await(sequelize.models.ModelsList.findById(this.model_id));
                const referencedModel = sequelize.models[modelRecord.name];
                const referencedObj = await(referencedModel.findById(this.obj_id));
                return [{
                    id: this.obj_id,
                    model_id: this.model_id,
                    model: modelRecord.name,
                    name: referencedObj.name
                }];
            }
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
                        as: 'model',
                        foreignKey: { allowNull: true }
                    };
                    Contract.belongsTo(models.Bid, bidOpts);
                },
                defineHooks: defineHooks
            }
        }
    );
    return Contract;
};