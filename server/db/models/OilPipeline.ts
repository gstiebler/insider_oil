'use strict';
import Sequelize = require('sequelize');
import { await } from '../../lib/await';

module.exports = function (sequelize, DataTypes: Sequelize.DataTypes) {
    const OilPipeline = sequelize.define('OilPipeline', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        diameter: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        extension: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        src_state: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        src_location_text: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        dst_state: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        dst_location_text: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        products: {
            type: Sequelize.STRING,
            allowNull: true
        },
        owner_preference: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        start_date: {
            allowNull: true,
            type: Sequelize.DATEONLY
        },
        max_capacity: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        op_capacity: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        contract_capacity: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        contract_released_capacity: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        contract_start_date: {
            allowNull: true,
            type: Sequelize.DATEONLY
        },
    },
        {
            underscored: true,
            tableName: 'oil_pipelines',
        }
    );
    return OilPipeline;
};