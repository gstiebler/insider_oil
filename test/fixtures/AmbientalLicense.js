'use strict';

var utils = require('../lib/utils');

module.exports = function(db) {
    const ambientalLicenseObjs = [
        {
            license: 'ABio 560/2014',
            start: '2015-09-01',
            end: '2016-09-01',
            enterprise: 'Perfuração Marítima - Bloco BM-CAL-13 - Bacia de Camamu-Almada',
            entrepreneur: 'BP ENERGY DO BRASIL LTDA',
            process: '02022.001868/2007-89',
            tipology: 'Petróleo - Perfuração',
            pac: 'Não',
            blocks: [
                { id: utils.idByName('Block', 'BM-BAR-1')  },
                { id: utils.idByName('Block', 'ES-M-529')  }
            ]
        },
        {
            license: 'LPS 101/2015',
            start: '2015-03-02',
            end: '2015-09-30',
            enterprise: 'Pesquisa Sísmica Marítima 2D na Bacia de Pelotas - Programa Pelotas Fase II',
            entrepreneur: 'SPECTRUM GEO DO BRASIL SERVIÇOS GEOFÍSICOS LTDA.',
            process: '02022.000874/2014-48',
            tipology: 'Petróleo - Aquisição de Dados',
            pac: 'Não',
            blocks: [
                { id: utils.idByName('Block', 'BM-BAR-1')  }
            ]
        },
        {
            license: 'LPS 102/2015',
            start: '2015-03-23',
            end: '2017-03-31',
            enterprise: 'Pesquisa Sísmica Marítima 4D Nodes no Campo de lula, Bacia de Santos',
            entrepreneur: 'PETROLEO BRASILEIRO S/A - PETROBRAS',
            process: '02022.001105/2013-86',
            tipology: 'Petróleo - Aquisição de Dados',
            pac: 'Não'
        }
    ];
    
    const promisesArray = [];
    for(var ambientalLicenseObj of ambientalLicenseObjs) {
        promisesArray.push(db.AmbientalLicense.create(ambientalLicenseObj));
    }
    
    return Promise.all(promisesArray);
}