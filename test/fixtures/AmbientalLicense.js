module.exports = function(db) {
    return db.AmbientalLicense.bulkCreate([
        {
            license: 'ABio 560/2014',
            start: '09/01/2015',
            end: '09/01/2016',
            enterprise: 'Perfuração Marítima - Bloco BM-CAL-13 - Bacia de Camamu-Almada',
            entrepreneur: 'BP ENERGY DO BRASIL LTDA',
            process: '02022.001868/2007-89',
            tipology: 'Petróleo - Perfuração',
            pac: 'Não'
        },
        {
            license: 'LPS 101/2015',
            start: '03/02/2015',
            end: '30/09/2015',
            enterprise: 'Pesquisa Sísmica Marítima 2D na Bacia de Pelotas - Programa Pelotas Fase II',
            entrepreneur: 'SPECTRUM GEO DO BRASIL SERVIÇOS GEOFÍSICOS LTDA.',
            process: '02022.000874/2014-48',
            tipology: 'Petróleo - Aquisição de Dados',
            pac: 'Não'
        },
        {
            license: 'LPS 102/2015',
            start: '23/03/2015',
            end: '31/03/2017',
            enterprise: 'Pesquisa Sísmica Marítima 4D Nodes no Campo de lula, Bacia de Santos',
            entrepreneur: 'PETROLEO BRASILEIRO S/A - PETROBRAS',
            process: '02022.001105/2013-86',
            tipology: 'Petróleo - Aquisição de Dados',
            pac: 'Não'
        }
    ]);
}