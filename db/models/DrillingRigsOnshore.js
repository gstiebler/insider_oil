module.exports = function(sequelize, DataTypes) {
    var DrillingRigOffshore = sequelize.define('DrillingRigOffshore', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false
        },
        end: {
          type: DataTypes.DATE,
          allowNull: true
        }/*, another option of validation
        contractor_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }*/
    }, {
        underscored: true,
        tableName: 'drilling_rigs',
        validate: {
            contractorNotNull: function() {
                if( !this.contractor_id )
                    throw new Error('Contratante não pode ser nulo');
            }
        },
        classMethods: {
            associate: function(models) {
                DrillingRigOffshore.belongsTo(models.Company, { as: 'contractor', allowNull: false } );
            }
        }
    });
    return DrillingRigOffshore;
};