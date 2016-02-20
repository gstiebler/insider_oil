module.exports = function(sequelize, DataTypes) {
  var Telephone = sequelize.define('Telephone', {
        number: {
          type: DataTypes.STRING,
          allowNull: false
        }
    }, 
    {
        underscored: true,
        tableName: 'telephones',
        classMethods: {
            associate: function(models) {
                Telephone.belongsTo(models.Person, { as: 'person', allowNull: false } );
            }
        }
    }
  );
  
  return Telephone;
};