module.exports = function(sequelize, DataTypes) {
  var Basin = sequelize.define('Basin', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        }
    }, 
    {
        underscored: true,
        tableName: 'basins'
    }
  );
  
  return Basin;
};