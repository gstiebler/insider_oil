var utils = require('../lib/utils');
var await = require('../../lib/await');

module.exports = function(db) {
    const abaloneId = utils.idByName('OilField', 'Abalone');
    const guilhermeId = utils.idByName('Person', 'Guilherme Stiebler');
	const newsHTML = '<p>um campo: <a href="/app/view_record?source=OilField&amp;id=' + abaloneId +
        '" style="background-color: rgb(255, 255, 255);">Abalone</a> ' +
		'esse aqui é o google <a href="http://google.com" target="" style="background-color: rgb(255, 255, 255);">' + 
		'Google</a> link de verdade e aqui um nome: </p><p><a href="/app/view_record?source=Person&amp;id=' + guilhermeId +
        '" style="background-color: rgb(255, 255, 255);">' + 
		'Guilherme Stiebler</a></p>';
	
    const camamuId = utils.idByName('Basin', 'Camamu');
    const contentCamamu = '<a href="/app/view_record?source=Basin&amp;id=' + camamuId + '" >Camamu</a> ' ;
    
    const newsObjs = [
        {
            title: 'Petrobrás compra Statoil',
            content: newsHTML,
            author_id: utils.idByName('User', 'Felipe Grandin')
        },
        {
            title: 'Petrobrás demite presidente',
            content: contentCamamu,
            author_id: utils.idByName('User', 'Felipe Maciel')
        },
        {
            title: 'Petrobrás é privatizada',
            content: 'Ações multiplicam por 4 no dia seguinte',
            author_id: utils.idByName('User', 'Guilherme Stiebler')
        }
    ];
    
	const promisesArray = [];
    for(var newsObj of newsObjs) {
        promisesArray.push(db.News.create(newsObj));
    }
    
    return Promise.all(promisesArray);
}