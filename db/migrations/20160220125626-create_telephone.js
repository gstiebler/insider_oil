'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      const fields = {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
				number: {
					type: Sequelize.STRING,
					allowNull: false
				},
				person_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'persons',
						key: 'id'
					}
				}	
    };
    return queryInterface.createTable('telephones', fields);
  },

  down: function (queryInterface, Sequelize) {
     return queryInterface.dropTable('telephone');
  }
};
