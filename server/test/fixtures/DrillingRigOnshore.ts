import utils = require('../lib/utils');

module.exports = function(db) {
    return db.models.DrillingRigOnshore.bulkCreate([
        {
            name: "BS-04",
            type: "Perfuração",
            contractor_id: utils.idByName('Company', 'Statoil'),
            operator_id: utils.idByName('Company', 'Petrobras'),
            end: "2016-06-02",
            coordinates: '{"lat":-22.23799528,"lng":-38.96288806}',
            day_rate: '113025'
        },
        {
            name: "ebs-05",
            type: "Perfuração",
            contractor_id: utils.idByName('Company', 'Petrobras'),
            operator_id: utils.idByName('Company', 'Petrobras'),
            end: "2016-08-11",
            coordinates: '{"lat":-21.93799528,"lng":-40.96288806}',
            day_rate: '121000'
        },
        {
            name: "NIC-01",
            type: "Produção",
            contractor_id: utils.idByName('Company', 'Petrobras'),
            operator_id: utils.idByName('Company', 'Etesco'),
            end: "2016-03-10",
            coordinates: '{"lat":-20.23799528,"lng":-40.96288806}',
            day_rate: '82000'
        }
    ]);
}