'use strict';
import Sequelize = require('sequelize');
import { saveOriginalImage, getCoordFieldObj } from '../../lib/ModelUtils';

function savePhoto(drillingRig) {
    saveOriginalImage(drillingRig.dataValues.photo, 'DrillingRigOffshore', drillingRig.id);  
}

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
            type: Sequelize.VIRTUAL,
            get: function() {
                return 'image';
            },
		},
        info: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        coordinates: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        coords_admin: getCoordFieldObj('coordinates'),
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
        },
        hooks: {
            afterCreate: savePhoto,
            beforeUpdate: savePhoto
        }
    });
    return DrillingRigOffshore;
};

export = defineModel;