import * as utils from '../lib/utils';
import { executePromisesSequentialy } from '../../lib/PromiseUtils';
import { await } from '../../lib/await';

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
            author_id: utils.idByName('User', 'Felipe Grandin'),
            created_at: '2009-10-17'
        },
        {
            title: 'Petrobrás demite presidente',
            content: contentCamamu,
            author_id: utils.idByName('User', 'Felipe Maciel'),
            created_at: '2010-10-19'
        },
        {
            title: 'Petrobrás é privatizada',
            content: 'Ações multiplicam por 4 no dia seguinte',
            author_id: utils.idByName('User', 'Guilherme Stiebler'),
            created_at: '2010-11-17'
        }
    ];
    
    for(var newsObj of newsObjs) {
        await(db.models.News.create(newsObj));
    }
}