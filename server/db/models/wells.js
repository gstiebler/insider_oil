module.exports = function(sequelize, DataTypes) {
  var Well = sequelize.define('Well', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        operator: {
          type: DataTypes.STRING,
          allowNull: false
        },
        state: {
          type: DataTypes.STRING,
          allowNull: false
        },
        bacia: {
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
    }, 
    {
        underscored: true,
        tableName: 'wells'
    }
  );
  return Well;
};