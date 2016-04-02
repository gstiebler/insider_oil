var await = require('../../lib/await');

module.exports = function(sequelize, DataTypes) {
  var Well = sequelize.define('Well', {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        state: {
          type: DataTypes.STRING,
          allowNull: false
        },
        lat: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false
        },
        lng: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false
        },
        drilling_rig_onshore_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        drilling_rig_offshore_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        drilling_rig: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(this.drilling_rig_onshore_id) {
                    return this.drilling_rig_onshore_id + `:onshore`;
                } else {
                    return this.drilling_rig_offshore_id + ':offshore';
                }
            },
            set: function(newValue) {
                const parts = newValue.split(':');
                const id = parts[0];
                const type = parts[1];
                if(type == 'onshore') {
                    this.drilling_rig_onshore_id = id;
                    this.drilling_rig_offshore_id = null;
                } else {
                    this.drilling_rig_onshore_id = null;
                    this.drilling_rig_offshore_id = id;
                }
            }
        },
        drilling_rig_obj: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(this.drilling_rig_onshore_id) {
                     return await( sequelize.models.DrillingRigOnshore.findById(this.drilling_rig_onshore_id) );
                } else {
                     return await( sequelize.models.DrillingRigOffshore.findById(this.drilling_rig_offshore_id) );
                }
            }
        }
    }, 
    {
        underscored: true,
        tableName: 'wells',
        validate: {
            nameNotNull: function() {
                if( !this.name )
                    throw new Error('Nome não pode ser nulo');
            }
        },
        classMethods: {
            associate: function(models) {
                Well.belongsTo(models.Company, { as: 'operator' } );
                Well.belongsTo(models.Block, { as: 'block' } );
                Well.belongsTo(models.Basin, { as: 'basin' } );
            }
        }
    }
  );
  
  return Well;
};