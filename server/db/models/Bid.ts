'use strict';
import Sequelize = require('sequelize');
import { await } from '../../lib/await';
import ModelUtils = require('../../lib/ModelUtils');

function updateBid(bid) {
    const object:any[] = bid.dataValues.object;
    if(object == null || object.length != 1) {
        bid.model_id = null;
        bid.obj_id = null;
        return;   
    }
    
    bid.model_id = object[0].model_id;
    bid.obj_id = object[0].id;
}

function defineHooks(db) {
	db.Bid.hook('beforeCreate', updateBid);
	db.Bid.hook('beforeUpdate', updateBid);
}

module.exports = function (sequelize, DataTypes: Sequelize.DataTypes) {
    const Bid = sequelize.define('Bid', {
        process_number: {
            type: Sequelize.STRING,
            allowNull: false
        },
        modality: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        contract_object: {
            type: Sequelize.STRING,
            allowNull: true
        },
        qty_items: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        opening_moment: {
            type: Sequelize.DATE,
            allowNull: true
        },
        opening_local: {
            type: Sequelize.STRING,
            allowNull: true
        },
        opening_city: {
            type: Sequelize.STRING,
            allowNull: true
        },
        opening_state: {
            type: Sequelize.STRING,
            allowNull: true
        },
        situation: {
            type: Sequelize.STRING,
            allowNull: true
        },
        obj_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        object: {
            type: DataTypes.VIRTUAL,
            get: ModelUtils.getObjRefField
        },
    },
        {
            underscored: true,
            tableName: 'bids',
            classMethods: {
                associate: function (models) {
                    const opts: Sequelize.AssociationOptionsBelongsTo = {
                        as: 'model',
                        foreignKey: { allowNull: true }
                    };
                    Bid.belongsTo(models.ModelsList, opts);
                    Bid.belongsTo(models.Company, { as: 'contractor', foreignKey: { allowNull: true } } );
                    Bid.belongsTo(models.IndustrySegment, { as: 'segment', foreignKey: { allowNull: true } } );
                },
			    defineHooks: defineHooks
            }
        }
    );
    return Bid;
};