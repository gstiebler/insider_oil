"use strict";
var await = require('../../lib/await');

function updateTelephones(db, person) {
    const telephones = person.dataValues.telephones;
    if(telephones == null)
        return;
    
    const options = { where: { person_id: person.id } };
    // remove all telephones associated with this person
    db.Telephone.destroy(options).then(function() {
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
}


function updatePersonProjects(db, person) {
    const projects = person.dataValues.projects;
    if(projects == null)
        return;
    const options = { where: { person_id: person.id } };
    db.PersonProjects.destroy(options).then(() => {
        const newProjectRecords = [];
        for(var i = 0; i < projects.length; i++) {
            var projectRecord = { 
                person_id: person.id,
                model_id: projects[i].model_id,
                model_ref_id: projects[i].id
            };
            newProjectRecords.push(projectRecord);
        }
        return db.PersonProjects.bulkCreate(newProjectRecords);
    });
}


function updateFieldsFunc(db) {
    return function (person) {
        // TODO unify both functions in one
        updateTelephones(db, person);
        updatePersonProjects(db, person);
    }
}


function defineHooks(db) {
	db.Person.hook('afterCreate', updateFieldsFunc(db));
	db.Person.hook('beforeUpdate', updateFieldsFunc(db));
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
        },
        projects: {
            type: DataTypes.VIRTUAL,
            get: function() {
                const projectsPromise = sequelize.models.PersonProjects.getProjects(sequelize, this.id);
                const projects = await( projectsPromise );
                return projects;
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