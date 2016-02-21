var await = require('../../lib/await');

function defineHooks(db) {
	db.Person.hook('afterCreate', function(person) {
        const telephones = person.dataValues.telephones;
        if(telephones == null)
            return;
        
        const Telephone = db.Telephone;
        const options = { where: { person_id: person.id } };
        // remove all telephones associated with this person
        Telephone.destroy(options).then(function() {
            const newTelephoneRecords = [];
            for(var i = 0; i < telephones.length; i++) {
                var telephoneRecord = { 
                    person_id: person.id,
                    number: telephones[i]
                };
                newTelephoneRecords.push(telephoneRecord);
            }
            return db.Telephone.bulkCreate(newTelephoneRecords);
        });
    });
}


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
                if(telephoneRecords == null)
                    return [];
                const telephones = [];
                for(var i = 0; i < telephoneRecords.length; i++) {
                    telephones.push( telephoneRecords[i]['number'] );    
                }
                return telephones;
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
			},
			defineHooks: defineHooks
		}
	});

	return Person;
};