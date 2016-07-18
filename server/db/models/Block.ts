'use strict';
import Sequelize = require('sequelize');
import { polygonsToStr, strToPolygons } from '../../lib/Geo';

module.exports = function(sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
  const Block = sequelize.define('Block', {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        name_contract: {
          type: DataTypes.STRING,
          allowNull: true
        },
        bid: {
          type: DataTypes.STRING,
          allowNull: true
        },
        end_1: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        end_2: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        end_3: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        end_last: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        status: {
          type: DataTypes.STRING,
          allowNull: true
        },
        concessionaries: {
          type: DataTypes.STRING,
          allowNull: true
        },
        updates: {
          type: DataTypes.TEXT,
          allowNull: true
        },
				polygons: {
					type: DataTypes.TEXT,
					allowNull: true
				},
        polygons_admin: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(!this.polygons || this.polygons.length == 0) {
                  return null;
                }
                return polygonsToStr(JSON.parse(this.polygons));
            },
            set: function(polygons_admin:string) {
                if(!polygons_admin || polygons_admin.length == 0) {
                    return;
                }

                this.polygons = JSON.stringify(strToPolygons(polygons_admin));
            }
        },
    }, 
    {
        underscored: true,
        tableName: 'blocks',
        classMethods: {
            associate: function(models) {
                Block.belongsTo(models.Company, { as: 'operator' } );
                Block.belongsTo(models.Basin, { as: 'basin' } );
            },
        }
    }
  );
  
  return Block;
};