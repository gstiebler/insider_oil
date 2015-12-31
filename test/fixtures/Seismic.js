module.exports = function(db) {
    return db.Seismic.bulkCreate([
        {
            process: '48610.014844/2012-28',
            authorized_company: 'Strataimage Consultoria Ltda.',
            dou_publi_date: '1/9/2013',
            end_date: '3/9/2013',
            authorized_technologies: 'Aquisição de Dados Magnetotelúricos',
            basin: 'São Francisco'
        },
        {
            process: '48610.000189/2013-10',
            authorized_company: 'PGS Investigação Petrolífera Ltda.',
            dou_publi_date: '1/14/2013',
            end_date: '1/14/2014',
            authorized_technologies: 'Reprocessamento de Dados Sísmicas 3D',
            basin: 'Espírito Santo e Campos'
        },
        {
            process: '48610.000912/2013-52',
            authorized_company: 'ANDL Serviços Geof ísicos Ltda.',
            dou_publi_date: '1/30/2013',
            end_date: '1/30/2015',
            authorized_technologies: 'Aquisição de Dados',
            basin: 'Parecis'
        }
    ]);
}