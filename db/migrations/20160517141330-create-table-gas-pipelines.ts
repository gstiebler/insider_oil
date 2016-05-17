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
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      diameter: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      extension: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      classification: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      // text fields
      src_instalation_text: {
        type: Sequelize.STRING,
        allowNull: true
      },
      src_concession_text: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dst_instalation_text: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dst_concession_text: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      // source reference fields
      src_instalation_model_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'models_list',
          key: 'id'
        }
      },
      src_instalation_obj_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      src_concession_model_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'models_list',
          key: 'id'
        }
      },
      src_concession_obj_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      
      // destiny reference fields
      dst_instalation_model_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'models_list',
          key: 'id'
        }
      },
      dst_instalation_obj_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      dst_concession_model_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'models_list',
          key: 'id'
        }
      },
      dst_concession_obj_id: {
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

    queryInterface.createTable('gas_pipelines', tableOpts);
  },

  down: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
    return queryInterface.dropTable('gas_pipelines');
  }
};
