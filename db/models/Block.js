module.exports = function(sequelize, DataTypes) {
  var Block = sequelize.define('Block', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        basin: {
          type: DataTypes.STRING,
          allowNull: false
        },
        name_contract: {
          type: DataTypes.STRING,
          allowNull: false
        },
        bid: {
          type: DataTypes.STRING,
          allowNull: false
        },
        operator: {
          type: DataTypes.STRING,
          allowNull: false
        },
        end_1: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        end_2: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        end_3: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        end_last: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        status: {
          type: DataTypes.STRING,
          allowNull: true
        },
        concessionaries: {
          type: DataTypes.INTEGER,
          allowNull: true
        }
    }, 
    {
        underscored: true,
        tableName: 'blocks'
    }
  );
  
  return Block;
};