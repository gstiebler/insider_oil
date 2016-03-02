module.exports = function(sequelize, DataTypes) {
	var PersonProjects = sequelize.define('PersonProjects', {
		model_ref_id : {
			type : DataTypes.INTEGER,
			allowNull : false
		},
		person_id : {
			type : DataTypes.INTEGER,
			allowNull : false
		},
		model_id : {
			type : DataTypes.INTEGER,
			allowNull : false
		}
	}, 
	{
		underscored : true,
		tableName : 'person_projects',
		classMethods : {
			associate : function(models) {
				PersonProjects.belongsTo(models.Person, { as : 'person' });
				PersonProjects.belongsTo(models.ModelsList, { as : 'model' });
			}
		}
	});

	return PersonProjects;
};