'use strict';

function updateBlocks(db, ambientalLicense) {
    const blocks = ambientalLicense.dataValues.blocks;
    if(blocks == null)
        return;
    
    const options = { where: { ambiental_license_id: ambientalLicense.id } };
    // remove all blocks associated with this ambiental license
    db.AmbientalLicenseBlock.destroy(options).then(function() {
        const newBlocksRecords = [];
        for(var i = 0; i < blocks.length; i++) {
            const albRecord = { 
                ambiental_license_id: ambientalLicense.id,
                block_id: blocks[i].block_id
            };
            newBlocksRecords.push(albRecord);
        }
        return db.AmbientalLicenseBlock.bulkCreate(newBlocksRecords);
    });
}


function updateFieldsFunc(db) {
    return function (ambientalLicense) {
        updateBlocks(db, ambientalLicense);
    }
}


function defineHooks(db) {
	db.AmbientalLicense.hook('afterCreate', updateFieldsFunc(db));
	db.AmbientalLicense.hook('beforeUpdate', updateFieldsFunc(db));
}


module.exports = function(sequelize, DataTypes) {
  var AmbientalLicense = sequelize.define('AmbientalLicense', {
        license: {
          type: DataTypes.STRING,
          allowNull: false
        },
        start: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        end: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        enterprise: {
          type: DataTypes.STRING,
          allowNull: false
        },
        entrepreneur: {
          type: DataTypes.STRING,
          allowNull: false
        },
        process: {
          type: DataTypes.STRING,
          allowNull: false
        },
        tipology: {
          type: DataTypes.STRING,
          allowNull: false
        },
        pac: {
          type: DataTypes.STRING,
          allowNull: false
        },     
        blocks: {
            type: DataTypes.VIRTUAL,
            get: function() {
                var queryStr = 'select b.name, b.id ';
                queryStr += 'from ambiental_license_blocks alb, blocks b ';
                queryStr += 'where alb.block_id = b.id';
                const simpleQueryType = { type: sequelize.QueryTypes.SELECT};
                const result = await( sequelize.query(queryStr, simpleQueryType) );
                return result;
            }
        },
    }, 
    {
        underscored: true,
        tableName: 'ambiental_licenses',
		classMethods: {
			defineHooks: defineHooks
		}
    }
  );
  
  return AmbientalLicense;
};