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
      supplier: {
        type: Sequelize.STRING,
        allowNull: true
      },
      supplier_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contract_object: {
        type: Sequelize.STRING,
        allowNull: true
      },
      start: {
        type: Sequelize.DATE,
        allowNull: true
      },
      end: {
        type: Sequelize.DATE,
        allowNull: true
      },
      value: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      situation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      additives_ids: {
        type: Sequelize.STRING,
        allowNull: true
      },
      model_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'models_list',
          key: 'id'
        }
      },
      obj_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      bid_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'bids',
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

    queryInterface.createTable('contracts', tableOpts);
  },

  down: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
    return queryInterface.dropTable('contracts');
  }
};
