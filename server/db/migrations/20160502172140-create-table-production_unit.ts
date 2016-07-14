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
      oil_field_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'oil_fields',
          key: 'id'
        }
      },
      block_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'blocks',
          key: 'id'
        }
      },
      type: {
        type: Sequelize.ENUM('FPSO', 'FIXED', 'SEMI'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Em operação', 
                             'Em comissionamento', 
                             'Revamp',
                             'Parada',
                             'Parada programada',
                             'Em projeto',
                             'Em construção',
                             'Em licitação',
                             'Em desativação'),
        allowNull: true
      },
      general_info: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      owner: {
        type: Sequelize.STRING,
        allowNull: true
      },
      situation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      oil_processing_capacity: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      gas_processing_capacity: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      oil_storage_capacity: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      depth: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      start: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      end: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      first_oil: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      day_rate: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      photo: {
        type: Sequelize.BLOB('long'),
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

    return queryInterface.createTable('production_units', tableOpts);
  },

  down: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
    return queryInterface.dropTable('production_units');
  }
};
