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
            owner_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'companies',
                    key: 'id',
                },
                onDelete: 'CASCADE'
            },
            production_unit_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'production_units',
                    key: 'id',
                },
                onDelete: 'CASCADE'
            },
            oil_field_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'oil_fields',
                    key: 'id',
                },
                onDelete: 'CASCADE'
            },
        };
	      return queryInterface.createTable("projects", fields);
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable("projects");
    }
};
