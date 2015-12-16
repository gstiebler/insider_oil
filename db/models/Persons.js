module.exports = function(sequelize, DataTypes) {
  var Person = sequelize.define('Person', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true
        },
    }, 
    {
        underscored: true,
        tableName: 'persons',
        validate: {
            nameNotNull: function() {
                if( !this.name )
                    throw new Error('Nome não pode ser nulo');
            }
        },
        classMethods: {
            associate: function(models) {
                Person.belongsTo(models.Company, { as: 'company' } );
            }
        }
    }
  );
  
  return Person;
};