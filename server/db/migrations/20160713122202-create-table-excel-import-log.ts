'use strict';
import Sequelize = require('sequelize');

module.exports = {
  up: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
    const tableOpts: Sequelize.DefineAttributes = {
      id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				user: {
					type: Sequelize.STRING,
					allowNull: true
				},
				model: {
					type: Sequelize.STRING,
					allowNull: true
				},
				file_name: {
					type: Sequelize.STRING,
					allowNull: true
				},
				status: {
					type: Sequelize.STRING,
					allowNull: true
				},
				result: {
					type: Sequelize.TEXT('long'),
					allowNull: true 
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
    };

    return queryInterface.createTable('excel_import_logs', tableOpts);
  },

  down: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
    return queryInterface.dropTable('excel_import_logs');
  }
};

