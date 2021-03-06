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
      user_uid: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      supplier: {
        type: Sequelize.STRING,
        allowNull: true
      },
      supplier_identifier: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // it's named _obj because there was already a field named supplier
      supplier_obj_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'companies',
          key: 'id'
        }
      },
      contract_object: {
        type: Sequelize.STRING,
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
      value: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: true
      },
      show_day_rate: {
        type: Sequelize.BOOLEAN,
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
      segment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'industry_segments',
          key: 'id'
        }
      },
      situation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      additives_ids: {
        type: Sequelize.STRING,
        allowNull: true
      },
      type: {
        type: Sequelize.STRING,
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

    return queryInterface.createTable('contracts', tableOpts);
  },

  down: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
    return queryInterface.dropTable('contracts');
  }
};
