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
      product: {
        type: Sequelize.STRING,
        allowNull: false
      },
      period_year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      period_month: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      gas_pipeline_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'gas_pipelines',
          key: 'id'
        }
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

    queryInterface.createTable('gas_movements', tableOpts);
  },

  down: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
    return queryInterface.dropTable('gas_movements');
  }
};
