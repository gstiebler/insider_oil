'use strict';
import Sequelize = require('sequelize');  

function defineModel(sequelize:Sequelize.Sequelize, DataTypes:Sequelize.DataTypes):Sequelize.Model<any, any> {
    const DrillingRigOnshore = sequelize.define('DrillingRigOnshore', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false
        },
        end: {
          type: DataTypes.DATEONLY,
          allowNull: true
        }
    }, {
        underscored: true,
        tableName: 'drilling_rigs_onshore',
        classMethods: {
            associate: function(models) {
                const opts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'contractor', 
                    foreignKey: {  allowNull: false }
                };
                DrillingRigOnshore.belongsTo(models.Company, opts);
            }
        }
    });
    return DrillingRigOnshore;
};

export = defineModel;