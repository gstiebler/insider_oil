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
            model_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            obj_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            desc: {
                type: Sequelize.STRING,
                allowNull: false
            },
            value: {
                type: Sequelize.JSON,
                allowNull: true
            },
        };
	      return queryInterface.createTable("model_value_associations", fields);
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable("model_value_associations");
    }
};
