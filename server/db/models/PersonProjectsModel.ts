"use strict";
import * as Sequelize from 'sequelize';
import { simpleQueryType } from '../../lib/ModelUtils';

function getProjectsFromPerson(sequelize: Sequelize.Sequelize, personId) {
    const PersonProjects:any = sequelize.models['PersonProjects'];
    const ppOpts = { where: { person_id: personId } };
    return PersonProjects.findAll(ppOpts).then( (modelRefs) => {
        const queryStrings = []
        for(let modelRefRecord of modelRefs) {
            const model = sequelize.models[modelRefRecord.model_name];
            const tableName = model.getTableName();
            // TODO get the correct label field
            const labelField = 'name';
            var modelValsQueryStr = 'select ';
            modelValsQueryStr += '"' + modelRefRecord.model_name + '" as model, ';
            if(modelRefRecord.description && modelRefRecord.description != 'null')
                modelValsQueryStr += '"' + modelRefRecord.description + '" as description, ';
            else
                modelValsQueryStr += 'null as description, ';
            modelValsQueryStr += 'id, ';
            modelValsQueryStr += labelField +' ';
            modelValsQueryStr += 'from ' + tableName;
            modelValsQueryStr += ' where id = ' + modelRefRecord.model_ref_id + '\n';
            queryStrings.push(modelValsQueryStr);
            queryStrings.push('\n union \n');
        }
        if(modelRefs.length) {
            queryStrings.pop();
            const queryStr = queryStrings.join('');
            return sequelize.query(queryStr, simpleQueryType);
        }
        return null;
    });
}

module.exports = function(sequelize: Sequelize.Sequelize, DataTypes) {
	var PersonProjects = sequelize.define('PersonProjects', {
		model_ref_id: {
			type : DataTypes.INTEGER,
			allowNull : false
		},
		person_id: {
			type : DataTypes.INTEGER,
			allowNull : false
		},
		model_name: {
			type : DataTypes.STRING,
			allowNull : false
		},
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
	}, 
	{
		underscored : true,
		tableName: 'person_projects',
		classMethods: {
			associate: function(models) {
				PersonProjects.belongsTo(models.Person, { as : 'person' });
			},
            getProjects: getProjectsFromPerson
		}
	});

	return PersonProjects;
};