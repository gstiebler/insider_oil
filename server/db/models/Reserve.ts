module.exports = function(sequelize, DataTypes) {
  var Reserve = sequelize.define('Reserve', {
        state: {
          type: DataTypes.STRING,
          allowNull: false
        },
        reserve: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        shore: {
          type: DataTypes.ENUM('on', 'off'),
          allowNull: false
        },
        quantity_type: {
          type: DataTypes.ENUM('proven', 'total'),
          allowNull: false
        },
        type: {
          type: DataTypes.ENUM('oil', 'gas'),
          allowNull: false
        }
    }, 
    {
        underscored: true,
        tableName: 'reserves'
    }
  );
  
  return Reserve;
};