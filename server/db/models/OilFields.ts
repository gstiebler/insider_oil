'use strict';

import Sequelize = require('sequelize');  
var await = require('../../lib/await');
import { polygonsToStr, strToPolygons } from '../../lib/Geo';
import * as consLib from '../../lib/ConcessionariesUtils';

function defineHooks(db) {
	db.OilField.hook('afterCreate', consLib.updateConcessionaries.bind(this, db, 'OilFieldConcessionary', 'oil_field_id'));
	db.OilField.hook('beforeUpdate', consLib.updateConcessionaries.bind(this, db, 'OilFieldConcessionary', 'oil_field_id'));
}

module.exports = function(sequelize:Sequelize.Sequelize, DataTypes:Sequelize.DataTypes) {
  var OilField = sequelize.define('OilField', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        state: {
          type: DataTypes.STRING,
          allowNull: false
        },
        shore: {
          type: DataTypes.ENUM('on', 'off'),
          allowNull: false
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
        formatted_shore: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(this.shore == 'on') {
                    return 'Terra';
                } else if(this.shore == 'off') {
                    return 'Mar';
                } else {
                    return 'Erro';
                }
            }
        },
        stage: {
          type: DataTypes.ENUM('production', 'development'),
          allowNull: false
        },
        concessionaries: {
            type: DataTypes.VIRTUAL,
            get: function() { 
                return consLib.getConcessionaries(sequelize, this.id, 
                                'oil_field_concessionaries', 'oil_field_id'); 
            }
        },
        concessionaries_props: {
            type: DataTypes.VIRTUAL,
            get: function() { 
                return consLib.getConcessionariesProps(sequelize, this.id, 
                                'oil_field_concessionaries', 'oil_field_id');
            }
        },
        formatted_concessionaries: {
            type: DataTypes.VIRTUAL,
            get: function() { 
                return consLib.getFormattedConcessionaries(sequelize, this.id, 
                                'oil_field_concessionaries', 'oil_field_id'); 
            }
        }
    }, 
    {
        underscored: true,
        tableName: 'oil_fields',
        classMethods: {
            associate: function(models) {
                const opts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'basin', 
                    foreignKey: {  allowNull: false }
                };
                OilField.belongsTo(models.Basin, opts);
                OilField.belongsTo(models.Block, { as: 'block', foreignKey: { allowNull: true } } );
            },
			defineHooks: defineHooks
        },
        charset: 'utf8',
        collate: 'utf8_general_ci',
    }    
  );
  
  return OilField;
};