var utils = require('../lib/utils');
var await = require('../../lib/await');

module.exports = function(db) {
	const newsHTML = '<p>um campo: <a href="/app/view_record?source=OilField&amp;id=3" style="background-color: rgb(255, 255, 255);">Abalone</a> ' +
		'esse aqui é o google <a href="http://google.com" target="" style="background-color: rgb(255, 255, 255);">' + 
		'Google</a> link de verdade e aqui um nome: </p><p><a href="/app/view_record?source=Person&amp;id=2" style="background-color: rgb(255, 255, 255);">' + 
		'Guilherme Stiebler</a></p>';
	

    const newNews = {
        title: 'Petrobrás compra Statoil',
        content: newsHTML,
        author_id: utils.idByName('User', 'Felipe Grandin')
    };
    
	await( db.News.create(newNews) );
	
    return db.News.bulkCreate([
        {
            title: 'Petrobrás demite presidente',
            content: 'Já estava na hora',
            author_id: utils.idByName('User', 'Felipe Maciel')
        },
        {
            title: 'Petrobrás é privatizada',
            content: 'Ações multiplicam por 4 no dia seguinte',
            author_id: utils.idByName('User', 'Guilherme Stiebler')
        }
    ]);
}