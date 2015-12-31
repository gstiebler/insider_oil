module.exports = function(db) {
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
