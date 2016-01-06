var utils = require('../lib/utils');

module.exports = function(db) {
    return db.DrillingRigOnshore.bulkCreate([
        {
            name: "BS-04",
            type: "Perfuração",
            contractor_id: utils.idByName('Company', 'Statoil'),
            end: "2016-06-02"
        },
        {
            name: "ebs-05",
            type: "Perfuração",
            contractor_id: utils.idByName('Company', 'Etesco'),
            end: "2016-08-11"
        },
        {
            name: "NIC-01",
            type: "Produção",
            contractor_id: utils.idByName('Company', 'Schahin'),
            end: "2016-03-10"
        }
    ]);
}