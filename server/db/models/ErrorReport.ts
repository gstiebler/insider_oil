'use strict';
import * as Sequelize from 'sequelize'; 

module.exports = function(sequelize:Sequelize.Sequelize, DataTypes:Sequelize.DataTypes) {
    const ErrorReport = sequelize.define('ErrorReport', {
        url: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
    }, 
    {  
        underscored: true,
        tableName: 'error_reports',
        classMethods: {
            associate: function(models) {
                const reporterOpts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'reporter', 
                    foreignKey: {  allowNull: false }
                };
                ErrorReport.belongsTo(models.User, reporterOpts );

                const responsibleOpts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'responsible', 
                    foreignKey: {  allowNull: true }
                };
                ErrorReport.belongsTo(models.User, responsibleOpts );
            },
        }
    }
  );
  return ErrorReport;
};