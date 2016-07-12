"use strict";

function getProjectsFromPerson(sequelize, personId) {
    var modelRefsQueryStr = 'select m.id as model_id, p.model_ref_id as id, m.name as model, p.description ';
    modelRefsQueryStr += 'from person_projects p, models_list m ';
    modelRefsQueryStr += 'where p.model_id = m.id ';
    modelRefsQueryStr += 'and person_id = ' + personId;
    const simpleQueryType = { type: sequelize.QueryTypes.SELECT};
    return sequelize.query(modelRefsQueryStr, simpleQueryType).then( (modelRefs) => {
        const queryStrings = []
        for(var i = 0; i < modelRefs.length; i++) {
            const modelRefRecord = modelRefs[i];
            const modelName = modelRefRecord.model;
            const model = sequelize.models[modelName];
            const tableName = model.tableName;
            // TODO get the correct label field
            const labelField = 'name';
            var modelValsQueryStr = 'select ' + modelRefRecord.model_id + ' as model_id, ';
            modelValsQueryStr += '"' + modelRefRecord.model + '" as model, ';
            if(modelRefRecord.description && modelRefRecord.description != 'null')
                modelValsQueryStr += '"' + modelRefRecord.description + '" as description, ';
            else
                modelValsQueryStr += 'null as description, ';
            modelValsQueryStr += 'id, ';
            modelValsQueryStr += labelField +' ';
            modelValsQueryStr += 'from ' + tableName;
            modelValsQueryStr += ' where id = ' + modelRefRecord.id + '\n';
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

module.exports = function(sequelize, DataTypes) {
	var PersonProjects = sequelize.define('PersonProjects', {
		model_ref_id : {
			type : DataTypes.INTEGER,
			allowNull : false
		},
		person_id : {
			type : DataTypes.INTEGER,
			allowNull : false
		},
		model_id : {
			type : DataTypes.INTEGER,
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
				PersonProjects.belongsTo(models.ModelsList, { as : 'model' });
			},
            getProjects: getProjectsFromPerson
		}
	});

	return PersonProjects;
};