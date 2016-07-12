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
        first_oil: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        day_rate: {
            type: Sequelize.DOUBLE,
	          allowNull: true
        },  
		photo: {
			type: DataTypes.BLOB,
			allowNull: true
		},
    }, 
    {  
        underscored: true,
        tableName: 'production_units',
        classMethods: {
            associate: function(models) {
                const oilFieldOpts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'oil_field', 
                    foreignKey: {  allowNull: true }
                };
                ProductionUnit.belongsTo(models.OilField, oilFieldOpts );

                const blockOpts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'block', 
                    foreignKey: {  allowNull: true }
                };
                ProductionUnit.belongsTo(models.Block, blockOpts );
            }
        }
    }
  );
  return ProductionUnit;
};