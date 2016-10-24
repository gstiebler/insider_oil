import utils = require('../lib/utils');

module.exports = function(db) {
    return db.models.DrillingRigOffshore.bulkCreate([
        {
            name: "Aban Abraham",
            type: "NS",
            contractor_id: utils.idByName('Company', 'Statoil'),
            operator_id: utils.idByName('Company', 'Petrobras'),
            status: "Em operação",
            lda: 1900,
            start: "2011-06-05",
            end: "2016-06-02",
            coordinates: '{"lat":-23.23799528,"lng":-40.96288806}',
            day_rate: '95020'
        },
        {
            name: "S.C. Lancer",
            type: "NS",
            contractor_id: utils.idByName('Company', 'Petrobras'),
            operator_id: utils.idByName('Company', 'Schahin'),
            status: "Em operação",
            lda: 1500,
            start: "2002-08-16",
            end: "2016-08-11",
            coordinates: '{"lat":-22.799528,"lng":-39.6288806}',
            day_rate: '128900'
        },
        {
            name: "Paragon DPDS3",
            type: "NS",
            contractor_id: utils.idByName('Company', 'Petrobras'),
            operator_id: utils.idByName('Company', 'Petrobras'),
            status: "Em operação",
            lda: 2200,
            start: "2005-04-13",
            end: "2016-03-10",
            coordinates: '{"lat":-22.99528,"lng":-38.288806}',
            day_rate: '110000'
        }
    ]);
}