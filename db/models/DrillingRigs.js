module.exports = function(sequelize, DataTypes) {
    var DrillingRig = sequelize.define('DrillingRig', {
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
        lda: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        start: {
          type: DataTypes.DATE,
          allowNull: true
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
                DrillingRig.belongsTo(models.Company, { as: 'contractor', allowNull: false } );
            }
        }
    });
    return DrillingRig;
};