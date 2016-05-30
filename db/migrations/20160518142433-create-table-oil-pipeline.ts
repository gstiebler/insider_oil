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
      diameter: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      extension: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      src_state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      src_location_text: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dst_state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dst_location_text: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      products: {
        type: Sequelize.STRING,
        allowNull: true
      },
      owner_preference: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      start_date: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      max_capacity: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      op_capacity: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      contract_capacity: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      contract_released_capacity: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      contract_start_date: {
        allowNull: true,
        type: Sequelize.DATEONLY
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

    return queryInterface.createTable('oil_pipelines', tableOpts);
  },

  down: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
    return queryInterface.dropTable('oil_pipelines');
  }
};
