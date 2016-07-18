'use strict';
import Sequelize = require('sequelize');
import { coordToString, stringToCoord } from '../../lib/Geo';
import { IGeoPoint } from '../../../common/Interfaces';

function updatePolygons(block) {
    const polygons_admin:string = block.dataValues.polygons_admin;
    if(!polygons_admin || polygons_admin.length == 0) {
        return;
    }

    const polygons:IGeoPoint[][] = [];
    const polygonsStr = polygons_admin.split('*');
    for(var polygonStr of polygonsStr) {
       const polygon:IGeoPoint[] = [];
       const points = polygonStr.split('\n');
       for(var point of points) {
          const coords = point.split(',');
          if(coords.length != 2) {
              continue;
          }
          const lat = parseFloat(coords[0].trim());
          const lng = parseFloat(coords[1].trim());
          polygon.push({ lat, lng });
       }
       polygons.push(polygon);
    } 
    block.polygons = JSON.stringify(polygons);
}

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
                  return;
                }
                const polygonsStrs:string[] = [];
                const polygons = JSON.parse(this.polygons);
                for(var polygon of polygons) {
                  const pointStrs:string[] = [];
                  for(var point of polygon) {
                    pointStrs.push(coordToString(point));
                  }
                  polygonsStrs.push(pointStrs.join('\n'));
                }
                return polygonsStrs.join('\n*\n');
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
			      defineHooks: function(db) {
                db.Block.hook('beforeCreate', updatePolygons);
                db.Block.hook('beforeUpdate', updatePolygons);
            }
        }
    }
  );
  
  return Block;
};