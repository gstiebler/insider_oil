module.exports = function(db) {
    return db.OilField.bulkCreate([
        {
            name: 'Anambé',
            basin: 'Alagoas',
            state: 'Alagoas',
            concessionaries: 'Petrobras¹ (100)',
            shore: 'on',
            stage: 'production'
        },
        {
            name: 'Jiribatuba2',
            basin: 'Camamu',
            state: 'Bahia',
            concessionaries: 'Alvopetro¹ (100)',
            shore: 'on',
            stage: 'production'
        },
        {
            name: 'Abalone',
            basin: 'Campos',
            state: 'Espírito Santo',
            concessionaries: 'Shell Brasil¹ (50)/ONGC Campos (27)/QPI Brasil Petróleo (23)',
            shore: 'off',
            stage: 'production'
        },
        {
            name: 'Arapaçu',
            basin: 'Alagoas',
            state: 'Alagoas',
            concessionaries: 'Petrobras¹ (100)',
            shore: 'on',
            stage: 'development'
        },
        {
            name: 'Azulão',
            basin: 'Amazonas',
            state: 'Amazonas',
            concessionaries: 'Petrobras¹ (100)',
            shore: 'on',
            stage: 'development'
        },
        {
            name: 'Baleia Anã',
            basin: 'Campos',
            state: 'Espírito Santo',
            concessionaries: 'Petrobras¹ (100)',
            shore: 'off',
            stage: 'development'
        }
    ]);
}