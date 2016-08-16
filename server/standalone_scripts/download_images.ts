import db = require('../db/models');
import * as lwip from 'lwip';
var Sync = require('sync');
var await = require('../lib/await');

Sync(function(){
    const records:any[] = await( db.models.DrillingRigOffshore.findAll({order: 'name'}) );
    console.log('num: ', records.length);
    for(var record of records) {
        console.log(record.id);
        if(!record.photo) continue;
        lwip.open(record.photo, 'jpg', onPhotoOpen.bind(this, record.id));
    }
}); 

function onPhotoOpen(id, err, image) {
    if(!image) return;
    const fileName = 'out/img_' + id + '_original.jpg';
    image.writeFile(fileName, function(err){
        console.log(fileName);
    });
}