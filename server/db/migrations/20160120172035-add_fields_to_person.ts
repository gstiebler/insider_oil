var promise_bb = require("bluebird");

module.exports = {
	up: function(queryInterface, Sequelize) {
		const
		params = [];

		params.push({
			table: 'persons',
			columnName: 'position',
			columnDesc: {
				type: Sequelize.STRING,
				allowNull: true
			}
		});

		params.push({
			table: 'persons',
			columnName: 'telephones_text',
			columnDesc: {
				type: Sequelize.TEXT('tiny'),
				allowNull: true
			}
		});

		params.push({
			table: 'persons',
			columnName: 'email_text',
			columnDesc: {
				type: Sequelize.TEXT('tiny'),
				allowNull: true
			}
		});

		params.push({
			table: 'persons',
			columnName: 'linkedin',
			columnDesc: {
				type: Sequelize.STRING,
				allowNull: true
			}
		});

		params.push({
			table: 'persons',
			columnName: 'address',
			columnDesc: {
				type: Sequelize.STRING,
				allowNull: true
			}
		});

		params.push({
			table: 'persons',
			columnName: 'directorship',
			columnDesc: {
				type: Sequelize.STRING,
				allowNull: true
			}
		});

		params.push({
			table: 'persons',
			columnName: 'management_sector',
			columnDesc: {
				type: Sequelize.STRING,
				allowNull: true
			}
		});

		params.push({
			table: 'persons',
			columnName: 'photo',
			columnDesc: {
				type: Sequelize.BLOB('long'),
				allowNull: true
			}
		});

		return promise_bb.each(params, function(item) {
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

		params.push({
			table: 'persons',
			columnName: 'email'
		});

		params.push({
			table: 'persons',
			columnName: 'linkedin'
		});

		params.push({
			table: 'persons',
			columnName: 'address'
		});

		params.push({
			table: 'persons',
			columnName: 'directorship'
		});

		params.push({
			table: 'persons',
			columnName: 'management_sector'
		});

		params.push({
			table: 'persons',
			columnName: 'project1_model_id'
		});

		params.push({
			table: 'persons',
			columnName: 'project1_ref_id'
		});

		params.push({
			table: 'persons',
			columnName: 'photo'
		});

		return promise_bb.each(params, function(item) {
			return queryInterface.removeColumn(item.table, item.columnName);
		});
	}
};
