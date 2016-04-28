'use strict';
import Sequelize = require('sequelize');  

module.exports = function(sequelize:Sequelize.Sequelize, DataTypes:Sequelize.DataTypes) {
  var HydrocarbonEvidence = sequelize.define('HydrocarbonEvidence', {
        process: {
          type: DataTypes.STRING,
          allowNull: false
        }, 
        notification_date: {
          type: DataTypes.DATEONLY,
          allowNull: false
        }, 
        fluids: {
          type: DataTypes.STRING,
          allowNull: false
        },
        depth: {
          type: DataTypes.FLOAT,
          allowNull: false
        }
    }, 
    {  
        underscored: true,
        tableName: 'hydrocarbon_evidences',
        classMethods: {
            associate: function(models) {
                const opts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'well', 
                    foreignKey: {  allowNull: false }
                };
                HydrocarbonEvidence.belongsTo(models.Well, opts );
            }
        }
    }
  );
  return HydrocarbonEvidence;
};