'use strict';

import { getListFieldObj, saveImage } from '../../lib/ModelUtils';
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

function updateFieldsFunc(db, person) {
	updatePersonProjects(db, person);
	saveImage(person.dataValues.photo, 'Person', person.id);
}

function defineHooks(db) {
	db.Person.hook('afterCreate', updateFieldsFunc.bind(this, db));
	db.Person.hook('beforeUpdate', updateFieldsFunc.bind(this, db));
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
		directorship: {
			type: DataTypes.STRING,
			allowNull: true
		},
		management_sector: {
			type: DataTypes.STRING,
			allowNull: true
		},
		info: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		email_text: {
			type: DataTypes.TEXT,
			allowNull: true,
            invisible: true 
		},
        emails: getListFieldObj('email_text'),
		linkedin: {
			type: DataTypes.STRING,
			allowNull: true
		},
		address: {
			type: DataTypes.STRING,
			allowNull: true
		},		
		photo: {
            type: DataTypes.VIRTUAL,
            get: function() {
                return 'image';
            },
		},
        // internal field to store values from the telephones field
		telephones_text: {
			type: DataTypes.TEXT,
			allowNull: true,
            invisible: true 
		},
        telephones: getListFieldObj('telephones_text'),
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