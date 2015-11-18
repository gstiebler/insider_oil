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
            bacia: "Recôncavo"
        },
        {
            name: "1AGIP1RJS",
            operator: "Eni Oil",
            state: "RJ",
            bacia: "Santos"
        },
        {
            name: "1AJ 0001 BA",
            operator: "Recôncavo E&P",
            state: "BA",
            bacia: "Recôncavo"
        }
    ]);
}

function createFixtures() {
    await( createUsers() );
    await( createWells() );
};

module.exports = createFixtures;