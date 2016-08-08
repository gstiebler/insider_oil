'use strict';
import Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes: Sequelize.DataTypes) {
    const InsightsPublisher = sequelize.define('InsightsPublisher', {
        order: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        section: {
            type: Sequelize.STRING,
            allowNull: false
        },
    },
        {
            underscored: true,
            tableName: 'insights_publisher',
            classMethods: {
                associate: function (models) {
                    const insightOpts: Sequelize.AssociationOptionsBelongsTo = {
                        as: 'insight',
                        foreignKey: { allowNull: false }
                    };
                    InsightsPublisher.belongsTo(models.News, insightOpts);
                },
            }
        }
    );
    return InsightsPublisher;
};