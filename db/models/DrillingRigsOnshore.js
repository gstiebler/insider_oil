module.exports = function(sequelize, DataTypes) {
    var DrillingRigOnshore = sequelize.define('DrillingRigOnshore', {
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
        tableName: 'drilling_rigs_onshore',
        validate: {
            contractorNotNull: function() {
                if( !this.contractor_id )
                    throw new Error('Contratante não pode ser nulo');
            }
        },
        classMethods: {
            associate: function(models) {
                DrillingRigOnshore.belongsTo(models.Company, { as: 'contractor', allowNull: false } );
            }
        }
    });
    return DrillingRigOnshore;
};