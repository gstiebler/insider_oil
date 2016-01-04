module.exports = function(sequelize, DataTypes) {
  var Production = sequelize.define('Production', {
        state: {
          type: DataTypes.STRING,
          allowNull: false
        },
        basin: {
          type: DataTypes.STRING,
          allowNull: false
        },
        well_anp: {
          type: DataTypes.STRING,
          allowNull: false
        },
        well_operator: {
          type: DataTypes.STRING,
          allowNull: false
        },
        oil_field: {
          type: DataTypes.STRING,
          allowNull: false
        },
        operator: {
          type: DataTypes.STRING,
          allowNull: false
        },
        contract: {
          type: DataTypes.STRING,
          allowNull: false
        },
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
        instalation: {
          type: DataTypes.STRING,
          allowNull: false
        },
        instalation_type: {
          type: DataTypes.STRING,
          allowNull: false
        },
        production_time: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        shore: {
          type: DataTypes.ENUM('on', 'off'),
          allowNull: false
        }
    }, 
    {
        underscored: true,
        tableName: 'production'
    }
  );
  
  return Production;
};