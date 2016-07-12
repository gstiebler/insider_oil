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
				obj_id: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				contract_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'contracts',
						key: 'id'
					},
					onDelete: 'CASCADE'
				},
				model_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'models_list',
						key: 'id'
					}
				},
				description: {
					type: Sequelize.STRING,
					allowNull: true
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
    };

    return queryInterface.createTable('contract_projects', tableOpts);
  },

  down: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
    return queryInterface.dropTable('contract_projects');
  }
};
