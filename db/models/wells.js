module.exports = function(sequelize, DataTypes) {
  var Well = sequelize.define('Well', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        state: {
          type: DataTypes.STRING,
          allowNull: false
        },
        lat: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false
        },
        lng: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false
        },
    }, 
    {
        underscored: true,
        tableName: 'wells',
        validate: {
            nameNotNull: function() {
                if( !this.name )
                    throw new Error('Nome não pode ser nulo');
            }
        },
        classMethods: {
            associate: function(models) {
                Well.belongsTo(models.Company, { as: 'operator' } );
                Well.belongsTo(models.Block, { as: 'block' } );
                Well.belongsTo(models.Basin, { as: 'basin' } );
            }
        }
    }
  );
  
  return Well;
};