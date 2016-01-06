module.exports = function(db) {
    return db.Block.bulkCreate([
        {
            name: 'BM-BAR-1',
            basin: 'Barreirinhas',
            name_contract: 'BM-BAR-1',
            bid: 'BID3',
            operator: 'Petrobras',
            end_1: '8/29/2004',
            end_2: '7/18/2012',
            end_3 : '4/20/2014',
            end_last: '12/31/2016',
            status: 'SUSPENSO',
            concessionaries: '*Petrobras - 75%, ONGC Campos - 25%'
        },
        {
            name: 'ES-M-529',
            basin: 'Espírito Santo',
            name_contract: 'BM-ES-40',
            bid: 'BID9',
            operator: 'Perenco Brasil',
            end_1: '10/14/2012',
            end_2: '3/28/2015',
            end_3 : '12/31/2019',
            end_last: '12/31/2019',
            status: 'PAD EM ANÁLISE',
            concessionaries: '*Perenco Brasil - 40%, OGX - 50%, Sinochem Petróleo - 10%'
        },
        {
            name: 'PN-T-102',
            basin: 'Parnaíba',
            name_contract: 'BT-PN-1',
            bid: 'BID9',
            operator: 'Parnaíba Gás Natural',
            end_1: '3/12/2012',
            end_2: '3/12/2014',
            end_3 : '',
            end_last: '6/25/2016',
            status: '',
            concessionaries: '*Parnaíba Gás Natural - 50%, Imetame - 16.67%, Delp - 16.665%, Orteng - 16.665%'
        }
    ]);
}