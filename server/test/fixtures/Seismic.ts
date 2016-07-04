import utils = require('../lib/utils');

module.exports = function(db) {
    const seismics = [
        {
            process: '48610.014844/2012-28',
            authorized_company: 'Strataimage Consultoria Ltda.',
            dou_publi_date: '2013-01-09',
            end_date: '2013-03-09',
            authorized_technologies: 'Aquisição de Dados Magnetotelúricos',
            block_id: utils.idByName('Block', 'BM-BAR-1')
        },
        {
            process: '48610.000189/2013-10',
            authorized_company: 'PGS Investigação Petrolífera Ltda.',
            dou_publi_date: '2013-01-14',
            end_date: '2014-01-14',
            authorized_technologies: 'Reprocessamento de Dados Sísmicas 3D',
            block_id: utils.idByName('Block', 'BM-BAR-1')
        },
        {
            process: '48610.000912/2013-52',
            authorized_company: 'ANDL Serviços Geof ísicos Ltda.',
            dou_publi_date: '2013-01-30',
            end_date: '2015-01-30',
            authorized_technologies: 'Aquisição de Dados',
            block_id: utils.idByName('Block', 'ES-M-529')
        }
    ];
    
    return db.models.Seismic.bulkCreate(seismics);
}