'use strict';
import * as Sequelize from 'sequelize'; 
import { saveOriginalImage, getCoordFieldObj } from '../../lib/ModelUtils';

function savePhoto(productionUnit) {
	  saveOriginalImage(productionUnit.dataValues.photo, 'ProductionUnit', productionUnit.id);
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
        coords_admin: getCoordFieldObj('coordinates'),
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
            type: DataTypes.VIRTUAL,
            get: function() {
                return 'image';
            },
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
        },
        hooks: {
            afterCreate: savePhoto,
            beforeUpdate: savePhoto
        }
    }
  );
  return ProductionUnit;
};