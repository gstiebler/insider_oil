'use strict';
import Sequelize = require('sequelize');


module.exports = function (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
    const IndustrySegment = sequelize.define('IndustrySegment', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
    },
        {
            underscored: true,
            tableName: 'industry_segments',
        }
    );
    return IndustrySegment;
};