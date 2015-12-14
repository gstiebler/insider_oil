module.exports = function(sequelize, DataTypes) {
    var DrillingRig = sequelize.define('DrillingRig', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false
        },
        lda: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        start: {
          type: DataTypes.DATE,
          allowNull: true
        },
        end: {
          type: DataTypes.DATE,
          allowNull: true
        }                  
    }, {
        underscored: true,
        tableName: 'drilling_rigs',
        classMethods: {
            associate: function(models) {
                DrillingRig.belongsTo(models.Company, { as: 'contractor' } );
            }
        }
    });
    return DrillingRig;
};