"use strict";

function getProjectsFromContract(sequelize, contractId) {
    var modelRefsQueryStr = 'select m.id as model_id, cp.obj_id as id, m.name as model, cp.description ';
    modelRefsQueryStr += 'from contract_projects cp, models_list m ';
    modelRefsQueryStr += 'where cp.model_id = m.id ';
    modelRefsQueryStr += 'and contract_id = ' + contractId;
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
            var queryStr = queryStrings.join('');
            queryStr += ' order by model_id, id';
            return sequelize.query(queryStr, simpleQueryType);
        }
        return null;
    });
}

module.exports = function(sequelize, DataTypes) {
	var ContractProjects = sequelize.define('ContractProjects', {
		obj_id : {
			type : DataTypes.INTEGER,
			allowNull : false
		},
		contract_id : {
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
		tableName: 'contract_projects',
		classMethods: {
			associate: function(models) {
				ContractProjects.belongsTo(models.Contract, { as : 'contract' });
				ContractProjects.belongsTo(models.ModelsList, { as : 'model' });
			},
            getProjects: getProjectsFromContract
		}
	});

	return ContractProjects;
};