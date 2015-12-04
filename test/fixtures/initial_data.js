var db  = require('../../db/models');
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


function createDrillingRigs() {
    return db.DrillingRig.bulkCreate([
        {
            name: "Aban Abraham",
            type: "NS",
            contractor: "Etesco",
            status: "Em operação",
            lda: 1900,
            start: "2011-06-05",
            end: "2016-06-02"
        },
        {
            name: "S.C. Lancer",
            type: "NS",
            contractor: "Schahin",
            status: "Em operação",
            lda: 1500,
            start: "2002-08-16",
            end: "2016-08-11"
        },
        {
            name: "Paragon DPDS3",
            type: "NS",
            contractor: "Paragon",
            status: "Em operação",
            lda: 2200,
            start: "2005-04-13",
            end: "2016-03-10"
        }
    ]);
}

function createFixtures() {
    await( createUsers() );
    await( createWells() );
    await( createDrillingRigs() );
};

module.exports = createFixtures;