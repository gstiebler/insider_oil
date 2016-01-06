module.exports = function(sequelize, DataTypes) {
  var AmbientalLicense = sequelize.define('AmbientalLicense', {
        license: {
          type: DataTypes.STRING,
          allowNull: false
        },
        start: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        end: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        enterprise: {
          type: DataTypes.STRING,
          allowNull: false
        },
        entrepreneur: {
          type: DataTypes.STRING,
          allowNull: false
        },
        process: {
          type: DataTypes.STRING,
          allowNull: false
        },
        tipology: {
          type: DataTypes.STRING,
          allowNull: false
        },
        pac: {
          type: DataTypes.STRING,
          allowNull: false
        }
    }, 
    {
        underscored: true,
        tableName: 'ambiental_licenses'
    }
  );
  
  return AmbientalLicense;
};