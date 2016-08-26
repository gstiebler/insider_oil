'use strict';
import Sequelize = require('sequelize'); 

module.exports = function(sequelize, DataTypes:Sequelize.DataTypes) {
    var UpdateLog = sequelize.define('UpdateLog', 
        {
            model: {
                type: Sequelize.STRING,
                allowNull: false
            },
            obj_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            type: {
                type: Sequelize.STRING,
                comment: 'type of the update. New, edit, etc.',
                allowNull: false
            },
            updates: {
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