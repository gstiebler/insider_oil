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
        start: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        end: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        day_rate: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
		photo: {
			type: DataTypes.BLOB,
			allowNull: true
		},
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

                const optsOp:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'operator', 
                    foreignKey: {  allowNull: true }
                };
                DrillingRigOnshore.belongsTo(models.Company, optsOp);
            }
        }
    });
    return DrillingRigOnshore;
};

export = defineModel;