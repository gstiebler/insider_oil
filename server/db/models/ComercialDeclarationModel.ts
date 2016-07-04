'use strict';
module.exports = function(sequelize, DataTypes) {
    var ComercialDeclaration = sequelize.define('ComercialDeclaration', {
        attached: {
          type: DataTypes.STRING,
          allowNull: false
        },
        date: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
    }, 
    {
        underscored: true,
        tableName: 'comercial_declarations',
        classMethods: {
            associate: function(models) {
                ComercialDeclaration.belongsTo(models.Block, { as: 'block', allowNull: false });
            }
        }
    });
    return ComercialDeclaration;
};