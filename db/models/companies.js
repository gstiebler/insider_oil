module.exports = function(sequelize, DataTypes) {
  var Company = sequelize.define('Company', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        address: {
          type: DataTypes.STRING,
          allowNull: true
        }
    }, 
    {
        underscored: true,
        tableName: 'companies'
    }
  );
  return Company;
};