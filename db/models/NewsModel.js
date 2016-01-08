module.exports = function(sequelize, DataTypes) {
	var News = sequelize.define('News', {
		title : {
			type : DataTypes.STRING,
			allowNull : false
		},
		content : {
			type : DataTypes.TEXT,
			allowNull : false
		}
	}, 
	{
		underscored : true,
		tableName : 'news',
		classMethods : {
			associate : function(models) {
				News.belongsTo(models.User, {
					as : 'author',
					allowNull : false
				});
			}
		}
	});

	return News;
};