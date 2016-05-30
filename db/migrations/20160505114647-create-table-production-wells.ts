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
      name_operator: {
        type: Sequelize.STRING,
        allowNull: true
      },
      oil_field_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'oil_fields',
          key: 'id'
        }
      },
      production_unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
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

    return queryInterface.createTable('production_wells', tableOpts);
  },

  down: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
    return queryInterface.dropTable('production_wells');
  }
};
