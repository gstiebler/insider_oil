'use strict';
import Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes: Sequelize.DataTypes) {
    const ExcelImportLog = sequelize.define('ExcelImportLog',
        {
            user: {
                type: Sequelize.STRING,
                allowNull: true
            },
            model: {
                type: Sequelize.STRING,
                allowNull: true
            },
            file_name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            status: {
                type: Sequelize.STRING,
                allowNull: true
            },
            result: {
                type: Sequelize.TEXT('long'),
                allowNull: true
            },
        },
        {
            underscored: true,
            tableName: 'excel_import_logs'
        }
    );
    return ExcelImportLog;
};