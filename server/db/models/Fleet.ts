'use strict';
import Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes: Sequelize.DataTypes) {
    const Fleet = sequelize.define('Fleet', 
        {
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            year: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            country: {
                type: Sequelize.STRING,
                allowNull: true
            },
            type: {
                type: Sequelize.STRING,
                allowNull: true
            },
            weight: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
        },
        {
            underscored: true,
            tableName: 'fleet'
        }
    );
    return Fleet;
};