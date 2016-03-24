module.exports = function(db) {
    return db.User.bulkCreate([
        {
            login: "gstiebler",
            name: "Guilherme Stiebler",
            email: "guilhermemst@gmail.com",
            password: "guilherme",
            admin: true
        },
        {
            login: 'grandin',
            name: 'Felipe Grandin',
            email: 'grandin@gmail.com',
            password: 'io_grandin_io2016',
            admin: true
        },
        {
            login: 'maciel',
            name: 'Felipe Maciel',
            email: 'maciel.felipe@gmail.com',
            password: 'io_maciel_io2016',
            admin: true
        },
        {
            login: 'usuario',
            name: 'José da Silva',
            email: 'jose@example.com',
            password: 'io_usuario_io2016',
            admin: false
        }
    ]);
}