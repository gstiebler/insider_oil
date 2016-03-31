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
        drilling_rig: {
            type: DataTypes.VIRTUAL,
            get: function() {
                if(this.drilling_rig_onshore_id) {
                    return this.drilling_rig_onshore_id;
                } else {
                    return this.drilling_rig_offshore_id;
                }
            },
            set: function(newValue) {
                const parts = newValue.split(':');
                const type = parts[0];
                const id = parts[1];
                if(type == 'onshore') {
                    this.drilling_rig_onshore_id = id;
                } else {
                    this.drilling_rig_offshore_id = id;
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
                Well.belongsTo(models.DrillingRigOnshore, { as: 'drilling_rig_onshore' } );
                Well.belongsTo(models.DrillingRigOffshore, { as: 'drilling_rig_offshore' } );
            }
        }
    }
  );
  
  return Well;
};