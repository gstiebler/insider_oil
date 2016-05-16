'use strict';
import Sequelize = require('sequelize');

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
                }
            }
        }
    );
    return Bid;
};