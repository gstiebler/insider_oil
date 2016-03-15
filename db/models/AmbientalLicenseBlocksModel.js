'use strict';
module.exports = function(sequelize, DataTypes) {
    var AmbientalLicenseBlock = sequelize.define('AmbientalLicenseBlock', {
    }, 
    {
        underscored: true,
        tableName: 'ambiental_license_blocks',
        classMethods: {
            associate: function(models) {
                AmbientalLicenseBlock.belongsTo(models.Block, { as: 'block', allowNull: false });
                AmbientalLicenseBlock.belongsTo(models.AmbientalLicense, { as: 'ambiental_license', allowNull: false });
            }
        }
    });
    return AmbientalLicenseBlock;
};