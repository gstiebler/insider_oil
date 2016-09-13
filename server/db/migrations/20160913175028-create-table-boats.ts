'use strict';
import Sequelize = require('sequelize');

module.exports = {
    up: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
        const fields:Sequelize.DefineAttributes = {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            created_at: {
                type: Sequelize.DATE
            },
            updated_at: {
                type: Sequelize.DATE
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            owner_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'companies',
                    key: 'id',
                },
                onDelete: 'CASCADE'
            },
            operator_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'companies',
                    key: 'id',
                },
                onDelete: 'CASCADE'
            },
        };
	      return queryInterface.createTable("boats", fields);
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable("boats");
    }
};
