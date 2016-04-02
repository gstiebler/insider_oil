'use strict';

var await = require('../../lib/await');

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
                model_ref_id: projects[i].id,
                description: projects[i].description
            };
            newProjectRecords.push(projectRecord);
        }
        return db.PersonProjects.bulkCreate(newProjectRecords);
    });
}


function updateFieldsFunc(db) {
    return function (person) {
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
		email_text: {
			type: DataTypes.TEXT,
			allowNull: true,
            invisible: true 
		},
        emails: {
            type: DataTypes.VIRTUAL,
            get: function() {
                return JSON.parse(this.email_text);
            },
            set: function(newValue) {
                this.email_text = JSON.stringify(newValue);
            }
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
        // internal field to store values from the telephones field
		telephones_text: {
			type: DataTypes.TEXT,
			allowNull: true,
            invisible: true 
		},
        telephones: {
            type: DataTypes.VIRTUAL,
            get: function() {
                return JSON.parse(this.telephones_text);
            },
            set: function(newValue) {
                this.telephones_text = JSON.stringify(newValue);
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