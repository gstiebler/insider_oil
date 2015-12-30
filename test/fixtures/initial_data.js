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


function createCompanies() {
    return db.Company.bulkCreate([
        {
            name: "Petrobrás",
            address: "Rua no Centro"
        },
        {
            name: "Eni Oil"
        },
        {
            name: "Recôncavo E&P"
        },
        {
            name: "Statoil",
            address: "Rua em Botafogo"
        },
        {
            name: "Etesco"
        },
        {
            name: "Schahin"
        },
        {
            name: "Paragon"
        }
    ]);
}


function createWells() {
    return db.Well.bulkCreate([
        {
            name: "1A 0001 BA",
            operator_id: 1,
            state: "BA",
            bacia: "Recôncavo",
            lat: -12.79429444,
            lng: -38.43638167
        },
        {
            name: "1AGIP1RJS",
            operator_id: 2,
            state: "RJ",
            bacia: "Santos",
            lat: -4.91808556,
            lng: -37.22464472
        },
        {
            name: "1AJ 0001 BA",
            operator_id: 3,
            state: "BA",
            bacia: "Recôncavo",
            lat: -9.98799556,
            lng: -38.67655583
        }
    ]);
}


function createDrillingRigsOffshore() {
    return db.DrillingRigOffshore.bulkCreate([
        {
            name: "Aban Abraham",
            type: "NS",
            contractor_id: 4,
            status: "Em operação",
            lda: 1900,
            start: "2011-06-05",
            end: "2016-06-02"
        },
        {
            name: "S.C. Lancer",
            type: "NS",
            contractor_id: 5,
            status: "Em operação",
            lda: 1500,
            start: "2002-08-16",
            end: "2016-08-11"
        },
        {
            name: "Paragon DPDS3",
            type: "NS",
            contractor_id: 6,
            status: "Em operação",
            lda: 2200,
            start: "2005-04-13",
            end: "2016-03-10"
        }
    ]);
}


function createPersons() {
    return db.Person.bulkCreate([
        {
            name: "Guilherme Stiebler",
            company_id: 1,
            phone: "+55 21 99401-1944"
        },
        {
            name: "Felipe",
            company_id: 2
        },
        {
            name: "Marcelo",
            company_id: 3
        }
    ]);
}


function createOilFields() {
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


function createFixtures() {
    await( createUsers() );
    await( createCompanies() );
    await( createWells() );
    await( createDrillingRigsOffshore() );
    await( createPersons() );
    await( createOilFields() );
};

module.exports = createFixtures;