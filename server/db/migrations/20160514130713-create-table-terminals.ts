'use strict';
import Sequelize = require('sequelize');

module.exports = {
  up: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
    const tableOpts: Sequelize.DefineAttributes = {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
        type: {
          type: Sequelize.ENUM('ONSHORE', 'OFFSHORE'),
	        allowNull: false,
        },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      info: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    };

    return queryInterface.createTable('terminals', tableOpts);
  },

  down: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
    return queryInterface.dropTable('terminals');
  }
};
