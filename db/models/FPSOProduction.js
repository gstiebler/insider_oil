module.exports = function(sequelize, DataTypes) {
  var FPSOProduction = sequelize.define('FPSOProduction', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        owner: {
          type: DataTypes.STRING,
          allowNull: false
        },
        status: {
          type: DataTypes.ENUM('operation', 'construction'),
          allowNull: false
        },
        oil_processing_capacity: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        gas_processing_capacity: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        oil_storage_capacity: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        depth: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        start: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        end: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        operating_wells: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        injecting_wells: {
          type: DataTypes.INTEGER,
          allowNull: true
        }
    }, 
    {
        underscored: true,
        tableName: 'fpso_production',
        classMethods: {
            associate: function(models) {
                FPSOProduction.belongsTo(models.OilField, { as: 'field', allowNull: false } );
            }
        }
    }
  );
  
  return FPSOProduction;
};