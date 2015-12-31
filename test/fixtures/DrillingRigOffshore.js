module.exports = function(db) {
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