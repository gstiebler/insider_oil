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
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            src_model: {
                type: Sequelize.STRING,
                allowNull: false
            },
            dest_model: {
                type: Sequelize.STRING,
                allowNull: false
            },
            src_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            dest_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        };

	      return queryInterface.createTable("associations", fields);
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable("associations");
    }
};
