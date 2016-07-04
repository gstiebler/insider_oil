module.exports = function(sequelize, DataTypes) {
  var Production = sequelize.define('Production', {
        period_year: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        period_month: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        oil_production: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        oil_condensed_production: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        gas_associated_production: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        gas_non_associated_production: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        gas_royaties_volume: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        water_production: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
    }, 
    {
        underscored: true,
        tableName: 'production',
        classMethods: {
            associate: function(models) {
                Production.belongsTo(models.Well, { as: 'well', allowNull: false } );
            }
        }
    }
  );
  
  return Production;
};