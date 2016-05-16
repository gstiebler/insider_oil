'use strict';
import Sequelize = require('sequelize');

function updateBid(db, bid) {
    const object:any[] = bid.dataValues.object;
    if(object == null || object.length != 1)
        return;
    
    bid.model_id = object[0].model_id;
    bid.obj_id = object[0].id;
}

function updateFieldsFunc(db) {
    return function(bid) {
        updateBid(db, bid);
    }
}

function defineHooks(db) {
	db.Bid.hook('beforeCreate', updateFieldsFunc(db));
	db.Bid.hook('beforeUpdate', updateFieldsFunc(db));
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
            get: function() {
                return '';
            }
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
                },
			    defineHooks: defineHooks
            }
        }
    );
    return Bid;
};