'use strict';
import Sequelize = require('sequelize');  

module.exports = function(sequelize:Sequelize.Sequelize, DataTypes:Sequelize.DataTypes) {
  var BlockConcessionary = sequelize.define('BlockConcessionary', {
        prop: {
          type: DataTypes.FLOAT,
          allowNull: false
        }
    }, 
    {  
        underscored: true,
        tableName: 'block_concessionaries',
        classMethods: {
            associate: function(models) {
                const ofOpts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'block', 
                    foreignKey: {  allowNull: false }
                };
                BlockConcessionary.belongsTo(models.OilField, ofOpts );
                
                const cOpts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'company', 
                    foreignKey: {  allowNull: false }
                };
                BlockConcessionary.belongsTo(models.Company, cOpts );
            }
        }
    }
  );
  return BlockConcessionary;
};