module.exports = function(db) {
    return db.DrillingRigOnshore.bulkCreate([
        {
            name: "BS-04",
            type: "Perfuração",
            contractor_id: 4,
            end: "2016-06-02"
        },
        {
            name: "ebs-05",
            type: "Perfuração",
            contractor_id: 5,
            end: "2016-08-11"
        },
        {
            name: "NIC-01",
            type: "Produção",
            contractor_id: 6,
            end: "2016-03-10"
        }
    ]);
}