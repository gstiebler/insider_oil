'use strict';
import Sequelize = require('sequelize');  

function defineModel(sequelize:Sequelize.Sequelize, DataTypes:Sequelize.DataTypes):Sequelize.Model<any, any> {
    var DrillingRigOffshore = sequelize.define('DrillingRigOffshore', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        type: {
          type: DataTypes.STRING,
          allowNull: true
        },
        status: {
          type: DataTypes.STRING,
          allowNull: true
        },
        lda: {
          type: DataTypes.INTEGER,
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
        day_rate: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
		photo: {
			type: DataTypes.BLOB,
			allowNull: true
		},
        info: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    }, {
        underscored: true,
        tableName: 'drilling_rigs_offshore',
        classMethods: {
            associate: function(models) {
                const opts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'contractor', 
                    foreignKey: {  allowNull: false }
                };
                DrillingRigOffshore.belongsTo(models.Company, opts);

                const optsOp:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'operator', 
                    foreignKey: {  allowNull: true }
                };
                DrillingRigOffshore.belongsTo(models.Company, optsOp);
            }
        }
    });
    return DrillingRigOffshore;
};

export = defineModel;