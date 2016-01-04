module.exports = function(sequelize, DataTypes) {
  var FixedUEPProduction = sequelize.define('FixedUEPProduction', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false
        },
        basin: {
          type: DataTypes.STRING,
          allowNull: false
        },
        operator: {
          type: DataTypes.STRING,
          allowNull: false
        },
        lat: {
          type: DataTypes.DECIMAL,
          allowNull: false
        },
        lng: {
          type: DataTypes.DECIMAL,
          allowNull: false
        },
        depth: {
          type: DataTypes.FLOAT,
          allowNull: false
        }
    }, 
    {
        underscored: true,
        tableName: 'fixed_uep_production'
    }
  );
  
  return FixedUEPProduction;
};