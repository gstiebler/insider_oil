'use strict';
var fs = require('fs');

const files = fs.readdirSync(__dirname);
for(var fileName of files) {
	const parts = fileName.split('.');
	if(parts[1] != 'jpg')
		continue;
	
	const newName = fileName.replace('-sm', '');
	fs.rename(__dirname + '/' + fileName, __dirname + '/' + newName, function(err) {
		if ( err ) console.log('ERROR: ' + err) 
		else {
			console.log(__dirname + '/' + fileName);
		}
	});
};
	
