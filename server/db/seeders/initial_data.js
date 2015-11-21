var db  = require('../models');
var await = require('../../lib/await');

function createUsers() {
    return db.User.bulkCreate([
        {
            login: "gstiebler",
            name: "Guilherme Stiebler",
            email: "guilhermemst@gmail.com",
            password: "guilherme",
            admin: true
        }
    ]);
}

function createWells() {
    return db.Well.bulkCreate([
        {
            name: "1A 0001 BA",
            operator: "Petrobrás",
            state: "BA",
            bacia: "Recôncavo",
            lat: -12.79429444,
            lng: -38.43638167
        },
        {
            name: "1AGIP1RJS",
            operator: "Eni Oil",
            state: "RJ",
            bacia: "Santos",
            lat: -4.91808556,
            lng: -37.22464472
        },
        {
            name: "1AJ 0001 BA",
            operator: "Recôncavo E&P",
            state: "BA",
            bacia: "Recôncavo",
            lat: -9.98799556,
            lng: -38.67655583
        }
    ]);
}

function createFixtures() {
    await( createUsers() );
    await( createWells() );
};

module.exports = createFixtures;