'use strict';
var Promise = require("bluebird");

module.exports = {
	up: function(queryInterface, Sequelize) {
		const
		params = [];

		params.push({
			table: 'persons',
			columnName: 'position',
			columnDesc: {
				type: Sequelize.STRING,
				allowNull: false
			}
		});

		params.push({
			table: 'persons',
			columnName: 'telephone1',
			columnDesc: {
				type: Sequelize.STRING,
				allowNull: false
			}
		});

		params.push({
			table: 'persons',
			columnName: 'telephone2',
			columnDesc: {
				type: Sequelize.STRING,
				allowNull: false
			}
		});

		return Promise.each(params, function(item) {
			return queryInterface.addColumn(item.table, item.columnName, item.columnDesc);
		});
	},

	down: function(queryInterface, Sequelize) {
		const
		params = [];

		params.push({
			table: 'persons',
			columnName: 'position'
		});

		params.push({
			table: 'persons',
			columnName: 'telephone1'
		});

		params.push({
			table: 'persons',
			columnName: 'telephone2'
		});

		return Promise.each(params, function(item) {
			return queryInterface.removeColumn(item.table, item.columnName);
		});
	}
};
