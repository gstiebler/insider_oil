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
      process_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      modality: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contract_object: {
        type: Sequelize.STRING,
        allowNull: true
      },
      qty_items: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      opening_moment: {
        type: Sequelize.DATE,
        allowNull: true
      },
      opening_local: {
        type: Sequelize.STRING,
        allowNull: true
      },
      opening_city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      opening_state: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contractor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'companies',
          key: 'id'
        }
      },
      situation: {
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    };

    return queryInterface.createTable('bids', tableOpts);
  },

  down: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
    return queryInterface.dropTable('bids');
  }
};
