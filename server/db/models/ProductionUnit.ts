'use strict';
import * as Sequelize from 'sequelize';  
import { IGeoPoint } from '../../../common/Interfaces';

/**
 * Receives the coords in the form: '{"lat":-21.23799528,"lng":-39.96288806}'
 * and returns: '-21.23799528, -39.96288806'
 */
function coordStrToString(coordStr: string):string {
    const coords:IGeoPoint = JSON.parse(coordStr);
    return coords.lat + ', ' + coords.lng;
}

/**
 * Receives the coords in the form: '-21.23799528, -39.96288806'
 * and returns: '{"lat":-21.23799528,"lng":-39.96288806}'
 */
function stringToCoordStr(strWithCoords: string):string {
    if(!strWithCoords || strWithCoords.length == 0) {
        return null;
    }

    const parts:string[] = strWithCoords.split(',');
    const lat = parseFloat(parts[0].trim());
    const lng = parseFloat(parts[1].trim());
    return JSON.stringify({ lat, lng });
}

function updateCoordinates(productionUnit) {
    productionUnit.coordinates = stringToCoordStr(productionUnit.dataValues.coords_admin);
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
                return coordStrToString(this.coordinates);
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