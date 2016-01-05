module.exports = function(db) {
    return db.FPSOProduction.bulkCreate([
        {
            name: 'Cidade de Anchieta',
            owner: 'SBM',
            status: 'operation',
            field: 'Baleia Azul',
            oil_processing_capacity: 100,
            gas_processing_capacity: 3.5,
            oil_storage_capacity: 1600,
            depth: 1000,
            start: '01/06/2000',
            end: '01/06/2030',
            operating_wells: 5,
            injecting_wells: 3
        },
        {
            name: 'Cidade de Angra dos Reis',
            owner: 'Modec',
            status: 'operation',
            field: 'Lula',
            oil_processing_capacity: 100,
            gas_processing_capacity: 5,
            oil_storage_capacity: 1600,
            depth: 2500,
            start: '01/10/2010',
            end: '01/10/2025',
            operating_wells: 5,
            injecting_wells: 4
        },
        {
            name: 'Cidade de Campos dos Goytacazes',
            owner: 'Modec/Schahin',
            status: 'construction',
            field: 'Tartaruga Verde/Tartaruga Mestiça',
            oil_processing_capacity: 150,
            gas_processing_capacity: 5.0,
            oil_storage_capacity: 500,
            depth: 765,
            start: '01/01/2017'
        }
    ]);
}