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
		model_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, 
	{
		underscored : true,
		tableName : 'news_models',
		classMethods : {
			associate : function(models) {
				NewsModels.belongsTo(models.News, { as : 'news' });
			}
		}
	});

	return NewsModels;
};