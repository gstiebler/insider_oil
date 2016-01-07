module.exports = function(sequelize, DataTypes) {
  var Block = sequelize.define('Block', {
        name: {
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
          type: DataTypes.STRING,
          allowNull: true
        }
    }, 
    {
        underscored: true,
        tableName: 'blocks',
        classMethods: {
            associate: function(models) {
                Block.belongsTo(models.Company, { as: 'operator' } );
                Block.belongsTo(models.Basin, { as: 'basin' } );
            }
        }
    }
  );
  
  return Block;
};