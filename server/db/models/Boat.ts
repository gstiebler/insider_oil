'use strict';
import * as Sequelize from 'sequelize';
import { saveOriginalImage } from '../../lib/ModelUtils';

function savePhoto(boat) {
	  saveOriginalImage(boat.dataValues.photo, 'Boat', boat.id);
}

module.exports = function (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
    const Boat = sequelize.define('Boat', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        type: {
            type: Sequelize.STRING,
            allowNull: true
        },
        info_json: {
            type: Sequelize.JSON,
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
            tableName: 'boats',
            classMethods: {
                associate: function (models) {
                    const ownerOpts: Sequelize.AssociationOptionsBelongsTo = {
                        as: 'owner',
                        foreignKey: { allowNull: true }
                    };
                    Boat.belongsTo(models.Company, ownerOpts);

                    const operatorOpts: Sequelize.AssociationOptionsBelongsTo = {
                        as: 'operator',
                        foreignKey: { allowNull: true }
                    };
                    Boat.belongsTo(models.Company, operatorOpts);
                },
            },
            hooks: {
                afterCreate: savePhoto,
                beforeUpdate: savePhoto
            }
        }
    );

    return Boat;
};