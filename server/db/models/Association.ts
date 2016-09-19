'use strict';
import * as Sequelize from 'sequelize';

module.exports = function (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
    const Association = sequelize.define('Association', {
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        src_model: {
            type: Sequelize.STRING,
            allowNull: false
        },
        dest_model: {
            type: Sequelize.STRING,
            allowNull: false
        },
        src_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        dest_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    },
    {
        underscored: true,
        tableName: 'associations',
    });

    return Association;
};