module.exports = function(sequelize, DataTypes) {
  var Seismic = sequelize.define('Seismic', {
        process: {
          type: DataTypes.STRING,
          allowNull: false
        },
        authorized_company: {
          type: DataTypes.STRING,
          allowNull: true
        },
        dou_publi_date: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        end_date: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        authorized_technologies: {
          type: DataTypes.STRING,
          allowNull: true
        },
        basin: {
          type: DataTypes.STRING,
          allowNull: true
        }
    }, 
    {
        underscored: true,
        tableName: 'seismics'
    }
  );
  return Seismic;
};