'use strict';
import Sequelize = require('sequelize'); 

module.exports = function(sequelize, DataTypes:Sequelize.DataTypes) {
    var UpdateLog = sequelize.define('UpdateLog', 
        {
            type: {
                type: Sequelize.STRING,
                comment: 'type of the update. New, edit, etc.',
                allowNull: false
            },
            update: {
                type: DataTypes.TEXT('medium'),
                allowNull: true
            }
        }, 
        {
            underscored: true,
            tableName: 'updates_log'
        }
    );
    
    return UpdateLog;
};