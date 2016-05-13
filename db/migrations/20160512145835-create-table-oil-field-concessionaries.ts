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
          oil_field_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'oil_fields',
                  key: 'id',
              },
              onDelete: 'CASCADE'
          },
          company_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'companies',
                  key: 'id'
              },
              onDelete: 'CASCADE'
          },
          prop: {
              type: Sequelize.FLOAT,
              allowNull: false
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

    queryInterface.createTable('oil_field_concessionaries', tableOpts);
  },

  down: function(queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
      return queryInterface.dropTable('oil_field_concessionaries');
  }
};
