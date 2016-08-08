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
          insight_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'news',
                  key: 'id',
              },
              onDelete: 'CASCADE'
          },
          order: {
              type: Sequelize.INTEGER,
              allowNull: false,
          },
          section: {
              type: Sequelize.STRING,
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

    return queryInterface.createTable('insights_publisher', tableOpts);
  },

  down: function(queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
      return queryInterface.dropTable('insights_publisher');
  }
};
