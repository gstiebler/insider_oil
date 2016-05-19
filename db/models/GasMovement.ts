'use strict';
import Sequelize = require('sequelize');
var await = require('../../lib/await');

module.exports = function (sequelize, DataTypes: Sequelize.DataTypes) {
    const GasMovements = sequelize.define('GasMovements', {
      product: {
        type: Sequelize.STRING,
        allowNull: false
      },
      period_year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      period_month: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    },
        {
            underscored: true,
            tableName: 'gas_movements',
            classMethods: {
                associate: function (models) {
                    const gpOpts: Sequelize.AssociationOptionsBelongsTo = {
                        as: 'gas_pipeline',
                        foreignKey: { allowNull: false }
                    };
                    GasMovements.belongsTo(models.GasPipeline, gpOpts);
                },
            }
        }
    );
    return GasMovements;
};