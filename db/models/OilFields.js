module.exports = function(sequelize, DataTypes) {
  var OilField = sequelize.define('OilField', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        bacia: {
          type: DataTypes.STRING,
          allowNull: true
        },
        state: {
          type: DataTypes.STRING,
          allowNull: true
        },
        concessionaries: {
          type: DataTypes.STRING,
          allowNull: true
        },
        shore: {
          type: DataTypes.STRING,
          allowNull: true
        },
        stage: {
          type: DataTypes.STRING,
          allowNull: true
        }
    }, 
    {
        underscored: true,
        tableName: 'oil_fields'
    }
  );
  
  return OilField;
};