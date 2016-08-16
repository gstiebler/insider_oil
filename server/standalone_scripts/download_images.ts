import db = require('../db/models');
import * as lwip from 'lwip';
var Sync = require('sync');
var await = require('../lib/await');

Sync(function(){
    const records:any[] = await( db.models.Person.findAll({order: 'name'}) );
    console.log('num: ', records.length);
    for(var person of records) {
        if(!person.photo) continue;
        lwip.open(person.photo, 'jpg', onPhotoOpen.bind(this, person.id));
    }
}); 

function onPhotoOpen(id, err, image) {
    if(!image) return;
    const fileName = 'out/img_' + id + '_original.jpg';
    image.writeFile(fileName, function(err){
        console.log(fileName);
    });
}