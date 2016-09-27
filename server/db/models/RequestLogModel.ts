module.exports = function(sequelize, DataTypes) {
  var RequestLog = sequelize.define('RequestLog', {
        agent: {
            type: DataTypes.STRING,
            allowNull: false
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user: {
            type: DataTypes.STRING,
            allowNull: false
        },
        query: {
            type: DataTypes.JSON,
            allowNull: false
        },
        method: {
            type: DataTypes.STRING,
            allowNull: true
        },
        request: {
          type: DataTypes.TEXT('medium'),
          allowNull: true
        }
    }, 
    {
        underscored: true,
        tableName: 'request_log'
    }
  );
  
  return RequestLog;
};