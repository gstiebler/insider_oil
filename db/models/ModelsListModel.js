module.exports = function(sequelize, DataTypes) {
  var ModelsList = sequelize.define('ModelsList', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        }
    }, 
    {
        underscored: true,
        tableName: 'models_list'
    }
  );
  
  return ModelsList;
};