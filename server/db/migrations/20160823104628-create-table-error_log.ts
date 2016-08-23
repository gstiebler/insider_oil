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
            error: {
                type: Sequelize.TEXT,
                allowNull: true
            }
      };
	return queryInterface.createTable("error_log", fields);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable("error_log");
  }
};
