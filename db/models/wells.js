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
        tableName: 'wells',
        classMethods: {
            associate: function(models) {
                Well.belongsTo(models.Company, { as: 'operator' } );
            },
            findAllCustom: function(options) {
                options = options ? options : {};
                options.include = [];
                for( att in Well.associations )
                    options.include.push( Well.associations[att] );
                return Well.findAll(options);
            },
            simplifyArray: function(array) {
                for(var i = 0; i < array.length; i++) {
                    array[i].simplifyItem()
                }
                return array;
            }
        },
        instanceMethods: {
            simplifyItem: function() {
                this.dataValues.operator_name = this.operator.name;
            }
        }
    }
  );
  
  return Well;
};