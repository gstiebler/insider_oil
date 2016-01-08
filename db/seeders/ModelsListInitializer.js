module.exports = function(db) {
	models = [];
	const excludedItems = {
	    ModelsList: true,
	    sequelize: true,
	    Sequelize: true,
	    User: true,
	    News: true
	};
	for(var itemName in db) {
		if(excludedItems[itemName])
			continue;
		models.push( { name: itemName } );
		console.log(itemName);
	}
    return db.ModelsList.bulkCreate(models);
}