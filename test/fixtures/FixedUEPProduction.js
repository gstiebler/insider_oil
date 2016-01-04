module.exports = function(db) {
    return db.FixedUEPProduction.bulkCreate([
        {
            name: 'Peregrino A',
            code: 'PEREGRINO A',
            basin: 'Campos',
            operator: 'Statoil Brasil',
            lat: -23.334167,
            lng: -41.2983,
            depth: 106
        },
        {
            name: 'PEROA',
            code: 'PPER',
            basin: 'Espírito Santo',
            operator: 'Petrobras',
            lat: -19.564167,
            lng: -39.25389,
            depth: 70
        },
        {
            name: 'PLATAFORMA BIQUARA 1',
            code: 'PBIQ-1',
            basin: 'Potiguar',
            operator: 'Petrobras',
            lat: -4.85694,
            lng: -36.560278,
            depth: 20
        }
    ]);
}