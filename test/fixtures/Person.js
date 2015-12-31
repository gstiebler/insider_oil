module.exports = function(db) {
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
