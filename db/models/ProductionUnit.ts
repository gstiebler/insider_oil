'use strict';
import Sequelize = require('sequelize');  

module.exports = function(sequelize:Sequelize.Sequelize, DataTypes:Sequelize.DataTypes) {
  const ProductionUnit = sequelize.define('ProductionUnit', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        }, 
        type: {
            type: DataTypes.ENUM('FPSO', 'FIXED', 'SEMI'),
	        allowNull: false
        },
        owner: {
          type: DataTypes.STRING,
          allowNull: true
        },
        situation: {
          type: DataTypes.STRING,
          allowNull: true
        },
        oil_processing_capacity: {
            type: DataTypes.FLOAT,
	        allowNull: true
        },
        gas_processing_capacity: {
            type: DataTypes.FLOAT,
	        allowNull: true
        },
        oil_storage_capacity: {
            type: DataTypes.FLOAT,
	        allowNull: true
        },  
        depth: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        start: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        end: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
    }, 
    {  
        underscored: true,
        tableName: 'production_units',
        classMethods: {
            associate: function(models) {
                const opts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'oil_field', 
                    foreignKey: {  allowNull: false }
                };
                ProductionUnit.belongsTo(models.OilField, opts );
            }
        }
    }
  );
  return ProductionUnit;
};