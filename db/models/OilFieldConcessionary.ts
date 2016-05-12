'use strict';
//import Sequelize = require('sequelize');  

module.exports = function(sequelize:Sequelize.Sequelize, DataTypes:Sequelize.DataTypes) {
  var OilFieldConcessionary = sequelize.define('OilFieldConcessionary', {
        prop: {
          type: DataTypes.FLOAT,
          allowNull: false
        }
    }, 
    {  
        underscored: true,
        tableName: 'oil_field_concessionaries',
        classMethods: {
            associate: function(models) {
                const ofOpts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'oil_fields', 
                    foreignKey: {  allowNull: false }
                };
                OilFieldConcessionary.belongsTo(models.Well, ofOpts );
                
                const cOpts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'companies', 
                    foreignKey: {  allowNull: false }
                };
                OilFieldConcessionary.belongsTo(models.Well, cOpts );
            }
        }
    }
  );
  return OilFieldConcessionary;
};