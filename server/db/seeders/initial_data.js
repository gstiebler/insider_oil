var db  = require('../models');
var await = require('../../lib/await');

function createUsers() {
    return db.User.bulkCreate([
        {
            login: "gstiebler",
            name: "Guilherme Stiebler",
            email: "guilhermemst@gmail.com",
            password: "guilherme"
        }
    ]);
}

function createFixtures() {
    await( createUsers() );
};

module.exports = createFixtures;