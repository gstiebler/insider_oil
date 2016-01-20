'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
	  return queryInterface.addColumn(
			 'persons', 
			 'position',
			 {
				  type: Sequelize.STRING,
				  allowNull: false 
			 }
  	).then(function() {
	  	  return queryInterface.addColumn(
	 			 'persons', 
	 			 'telephone1',
	 			 {
	 				  type: Sequelize.STRING,
	 				  allowNull: false 
	 			 }
  	)}).then(function() {
	  	  return queryInterface.addColumn(
		 			 'persons', 
		 			 'telephone2',
		 			 {
		 				  type: Sequelize.STRING,
		 				  allowNull: false 
		 			 }
	  	)});
  },

  down: function (queryInterface, Sequelize) {
	  return queryInterface.removeColumn('persons', 'position').then(function() {
		  return queryInterface.removeColumn('persons', 'telephone1');
	  }).then(function() {
		  return queryInterface.removeColumn('persons', 'telephone2');
	  });
  }
};
