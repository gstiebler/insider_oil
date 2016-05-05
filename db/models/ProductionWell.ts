'use strict';
import Sequelize = require('sequelize');  

module.exports = function(sequelize:Sequelize.Sequelize, DataTypes:Sequelize.DataTypes) {
  var ProductionWell = sequelize.define('ProductionWell', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        }, 
        operator_name: {
          type: DataTypes.STRING,
          allowNull: true
        },
    }, 
    {  
        underscored: true,
        tableName: 'production_wells',
        classMethods: {
            associate: function(models) {
                const oilFieldAssociationOpts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'oil_field', 
                    foreignKey: {  allowNull: true }
                };
                ProductionWell.belongsTo(models.OilField, oilFieldAssociationOpts );
                
                const productionUnitAssociationOpts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'production_unit', 
                    foreignKey: {  allowNull: true }
                };
                ProductionWell.belongsTo(models.ProductionUnit, productionUnitAssociationOpts );
            }
        }
    }
  );
  return ProductionWell;
};