'use strict';
import * as Sequelize from 'sequelize'; 
import { coordToString, stringToCoord } from '../../lib/Geo';

function updateCoordinates(productionUnit) {
    const coords = stringToCoord(productionUnit.dataValues.coords_admin);
    productionUnit.coordinates = JSON.stringify(coords);
}

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
        status: {
            type: DataTypes.ENUM('Em operação', 
                                 'Em comissionamento', 
                                 'Revamp',
                                 'Parada',
                                 'Parada programada',
                                 'Em projeto',
                                 'Em construção',
                                 'Em licitação',
                                 'Em desativação'),
	        allowNull: true
        },
        coordinates: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        coords_admin: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(!this.coordinates || this.coordinates.length == 0) {
                    return null;
                }
                return coordToString(JSON.parse(this.coordinates));
            }
        },
        general_info: {
            type: DataTypes.TEXT,
            allowNull: true
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
            },
			defineHooks: function(db) {
                db.ProductionUnit.hook('beforeCreate', updateCoordinates);
                db.ProductionUnit.hook('beforeUpdate', updateCoordinates);
            }
        }
    }
  );
  return ProductionUnit;
};