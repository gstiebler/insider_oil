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
				period_year: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				period_month: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				oil_production: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				oil_condensed_production: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				gas_associated_production: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				gas_non_associated_production: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				gas_royaties_volume: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				water_production: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				production_well_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'production_wells',
						key: 'id'
					}
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
    };

    queryInterface.createTable('production', tableOpts);
  },

  down: function (queryInterface: Sequelize.QueryInterface, SequelizeVar: Sequelize.Sequelize) {
    return queryInterface.dropTable('production');
  }
};
