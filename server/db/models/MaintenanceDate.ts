'use strict';
import Sequelize = require('sequelize');
import { await } from '../../lib/await';

module.exports = function (sequelize, DataTypes: Sequelize.DataTypes) {
    const MaintenanceDate = sequelize.define('MaintenanceDate', {
        period: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
    },
        {
            underscored: true,
            tableName: 'maintenance_dates',
            classMethods: {
                associate: function (models) {
                    const gpOpts: Sequelize.AssociationOptionsBelongsTo = {
                        as: 'production_unit',
                        foreignKey: { allowNull: false }
                    };
                    MaintenanceDate.belongsTo(models.ProductionUnit, gpOpts);
                },
            }
        }
    );
    return MaintenanceDate;
};