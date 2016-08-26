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
            model: {
                type: Sequelize.STRING,
                allowNull: false
            },
            type: {
                type: Sequelize.STRING,
                comment: 'type of the update. New, edit, etc.',
                allowNull: false
            },
            updates: {
                type: Sequelize.TEXT('medium'),
                comment: 'the content of the update',
                allowNull: true
            },
        };
	      return queryInterface.createTable("updates_log", fields);
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable("updates_log");
    }
};
