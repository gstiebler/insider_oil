var await = require('../../lib/await');

module.exports = function(db) {
    return db.Well.bulkCreate([
        {
            name: "1A 0001 BA",
            operator_id: await( db.Company.findOne( { where: { name: 'Petrobrás' }} ) ).id,
            state: "BA",
            bacia: "Recôncavo",
            lat: -12.79429444,
            lng: -38.43638167
        },
        {
            name: "1AGIP1RJS",
            operator_id: await( db.Company.findOne( { where: { name: 'Eni Oil' }} ) ).id,
            state: "RJ",
            bacia: "Santos",
            lat: -4.91808556,
            lng: -37.22464472
        },
        {
            name: "1AJ 0001 BA",
            operator_id: await( db.Company.findOne( { where: { name: 'Recôncavo E&P' }} ) ).id,
            state: "BA",
            bacia: "Recôncavo",
            lat: -9.98799556,
            lng: -38.67655583
        }
    ]);
}