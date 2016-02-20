var await = require('../../lib/await');

module.exports = function(sequelize, DataTypes) {
	var Person = sequelize.define('Person', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		position: {
			type: DataTypes.STRING,
			allowNull: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true
		},
		linkedin: {
			type: DataTypes.STRING,
			allowNull: true
		},
		address: {
			type: DataTypes.STRING,
			allowNull: true
		},
		directorship: {
			type: DataTypes.STRING,
			allowNull: true
		},
		management_sector: {
			type: DataTypes.STRING,
			allowNull: true
		},
		photo: {
			type: DataTypes.BLOB,
			allowNull: true
		},
       telephones: {
            type: DataTypes.VIRTUAL,
            get: function() {
                const options = { where: { person_id: this.id } };
                const telephoneRecords = await( sequelize.models.Telephone.findAll(options) );
                const telephones = [];
                for(var i = 0; i < telephoneRecords.length; i++) {
                    telephones.push( telephoneRecords[i]['number'] );    
                }
                return telephones;
            },
            set: function(val) {
            }
        }
	}, {
		underscored: true,
		tableName: 'persons',
		validate: {
			nameNotNull: function() {
				if (!this.name)
					throw new Error('Nome não pode ser nulo');
			}
		},
		classMethods: {
			associate: function(models) {
				Person.belongsTo(models.Company, {
					as: 'company'
				});
			}
		}
	});

	return Person;
};