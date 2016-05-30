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
              allowNull: false,
              references: {
                  model: 'oil_fields',
                  key: 'id'
              }
          },
        type: {
            type: Sequelize.ENUM('FPSO', 'FIXED', 'SEMI'),
	        allowNull: false
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

  down: function(queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
      return queryInterface.dropTable('production_units');
  }
};
