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
            user: {
                type: Sequelize.STRING,
                allowNull: false
            },
            path: {
                type: Sequelize.STRING,
                allowNull: false
            },
            method: {
                type: Sequelize.STRING,
                allowNull: true
            },
            query: {
                type: Sequelize.STRING,
                allowNull: false
            },
            agent: {
                type: Sequelize.STRING,
                allowNull: false
            },
            request: {
                type: Sequelize.TEXT,
                allowNull: true
            }
      };
	return queryInterface.createTable("request_log", fields);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable("request_log");
  }
};
