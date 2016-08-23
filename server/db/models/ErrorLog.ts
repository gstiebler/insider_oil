'use strict';
import Sequelize = require('sequelize'); 

module.exports = function(sequelize, DataTypes:Sequelize.DataTypes) {
    var ErrorLog = sequelize.define('ErrorLog', 
        {
            error: {
                type: DataTypes.TEXT('medium'),
                allowNull: true
            }
        }, 
        {
            underscored: true,
            tableName: 'ErrorLog'
        }
    );
    
    return ErrorLog;
};