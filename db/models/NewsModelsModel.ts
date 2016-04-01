module.exports = function(sequelize, DataTypes) {
	var NewsModels = sequelize.define('NewsModels', {
		model_ref_id : {
			type : DataTypes.INTEGER,
			allowNull : false
		},
		news_id : {
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
		tableName : 'news_models',
		classMethods : {
			associate : function(models) {
				NewsModels.belongsTo(models.News, { as : 'news' });
				NewsModels.belongsTo(models.ModelsList, { as : 'model' });
			}
		}
	});

	return NewsModels;
};