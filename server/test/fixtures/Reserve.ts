module.exports = function(db) {
    return db.models.Reserve.bulkCreate([
        {
            state: 'Alagoas',
            reserve: 10.5,
            year: 2011,
            shore: 'on',
            quantity_type: 'proven',
            type: 'oil'
        },
        {
            state: 'Paraná',
            reserve: 21.3,
            year: 2007,
            shore: 'off',
            quantity_type: 'proven',
            type: 'oil'
        },
        {
            state: 'Maranhão',
            reserve: 7286,
            year: 2013,
            shore: 'on',
            quantity_type: 'proven',
            type: 'gas'
        },
        {
            state: 'Sergipe',
            reserve: 2751,
            year: 2005,
            shore: 'off',
            quantity_type: 'proven',
            type: 'gas'
        },
        {
            state: 'Alagoas',
            reserve: 21.2,
            year: 2011,
            shore: 'on',
            quantity_type: 'total',
            type: 'oil'
        },
        {
            state: 'Paraná',
            reserve: 54.3,
            year: 2007,
            shore: 'off',
            quantity_type: 'total',
            type: 'oil'
        },
        {
            state: 'Maranhão',
            reserve: 8652,
            year: 2013,
            shore: 'on',
            quantity_type: 'total',
            type: 'gas'
        },
        {
            state: 'Sergipe',
            reserve: 4652,
            year: 2005,
            shore: 'off',
            quantity_type: 'total',
            type: 'gas'
        }
    ]);
}