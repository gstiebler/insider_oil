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
          well_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'wells',
                  key: 'id'
              }
          },
            notification_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            fluids: {
                type: Sequelize.STRING,
                allowNull: false
            },
            depth: {
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

    queryInterface.createTable('hydrocarbon_evidences', tableOpts);
  },

  down: function(queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
      return queryInterface.dropTable('hydrocarbon_evidences');
  }
};
