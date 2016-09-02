'use strict';

import { await } from '../../lib/await';
import Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes: Sequelize.DataTypes) {
  var Well = sequelize.define('Well', {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        name_operator: {
          type: DataTypes.STRING,
          allowNull: true
        },
        lat: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true
        },
        lng: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true
        },
        drilling_rig: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(this.drilling_rig_onshore_id) {
                    return this.drilling_rig_onshore_id + `:onshore`;
                } else {
                    return this.drilling_rig_offshore_id + ':offshore';
                }
            },
            set: function(newValue) {
                const parts = newValue.split(':');
                const id = parts[0];
                const type = parts[1];
                if(type == 'onshore') {
                    this.drilling_rig_onshore_id = id;
                    this.drilling_rig_offshore_id = null;
                } else {
                    this.drilling_rig_onshore_id = null;
                    this.drilling_rig_offshore_id = id;
                }
            }
        },
        drilling_rig_obj: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(this.drilling_rig_onshore_id) {
                     return await( sequelize.models.DrillingRigOnshore.findById(this.drilling_rig_onshore_id) );
                } else {
                     return await( sequelize.models.DrillingRigOffshore.findById(this.drilling_rig_offshore_id) );
                }
            }
        },
        drilling_rig_uniname: {
            type: DataTypes.VIRTUAL,
            get: function() {
                const obj = this.drilling_rig_obj; 
                if(obj) {
                    return obj.name; 
                } else {
                    return '';
                }
            },
            set: function(name) {
                const onshore = await( sequelize.models.DrillingRigOnshore.findOne({ where: { name: name } }) );
                if(onshore) {
                    this.drilling_rig_onshore_id = onshore.id;
                    this.drilling_rig_offshore_id = null;
                    return;
                }

                const offshore = await( sequelize.models.DrillingRigOffshore.findOne({ where: { name: name } }) );
                if(offshore) {
                    this.drilling_rig_onshore_id = null;
                    this.drilling_rig_offshore_id = offshore.id;
                    return;
                }
                this.drilling_rig_onshore_id = null;
                this.drilling_rig_offshore_id = null;
            }
        },
        type: {
          type: DataTypes.STRING,
          allowNull: true
        },
        category: {
          type: DataTypes.STRING,
          allowNull: true
        },
        reclassification: {
          type: DataTypes.STRING,
          allowNull: true
        },
        situation: {
          type: DataTypes.STRING,
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
        conclusion: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        measured_depth: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        depth: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
    }, 
    {
        underscored: true,
        tableName: 'wells',
        validate: {
            nameNotNull: function() {
                if( !this.name )
                    throw new Error('Nome não pode ser nulo');
            }
        },
        classMethods: {
            associate: function(models) {
                const companyOpts: Sequelize.AssociationOptionsBelongsTo = {
                    as: 'operator',
                    foreignKey: { allowNull: true }
                };
                Well.belongsTo(models.Company, companyOpts);

                const blockOpts: Sequelize.AssociationOptionsBelongsTo = {
                    as: 'block',
                    foreignKey: { allowNull: true }
                };
                Well.belongsTo(models.Block, blockOpts);
                
                const oilFieldAssociationOpts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'oil_field', 
                    foreignKey: {  allowNull: true }
                };
                Well.belongsTo(models.OilField, oilFieldAssociationOpts );
                
                const productionUnitAssociationOpts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'production_unit', 
                    foreignKey: {  allowNull: true }
                };
                Well.belongsTo(models.ProductionUnit, productionUnitAssociationOpts );
                
                const droffshoreOpts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'drilling_rig_offshore', 
                    foreignKey: {  allowNull: true }
                };
                Well.belongsTo(models.DrillingRigOffshore, droffshoreOpts );
                
                const dronshoreOpts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'drilling_rig_onshore', 
                    foreignKey: {  allowNull: true }
                };
                Well.belongsTo(models.DrillingRigOnshore, dronshoreOpts );
            }
        }
    }
  );
  
  return Well;
};