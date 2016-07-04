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
      period: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      production_unit_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'production_units',
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

    return queryInterface.createTable('maintenance_dates', tableOpts);
  },

  down: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
    return queryInterface.dropTable('maintenance_dates');
  }
};
