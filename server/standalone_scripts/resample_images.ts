import * as lwip from 'lwip';
import fs = require('fs');
import { resampleImage } from '../lib/ImageProcessing';
var Sync = require('sync');
var await = require('../lib/await');

Sync(function(){const files = fs.readdirSync(__dirname);
    for(var fileName of files) {
        console.log(__dirname + '/' + fileName);
        lwip.open(__dirname + '/' + fileName, 'jpg', onPhotoOpen.bind(this, fileName));
    }
}); 

function onPhotoOpen(fileNameIn: string, err, image: lwip.Image) {	
    if(!image) return;
    const regex = /img_([0-9\.]+)_original.jpg/;
	const results = fileNameIn.match(regex);
    console.log(image, results);
    if(!results || results.length < 2) return;
    const id = results[1];
    const fileNameOut = 'out/img_' + id + '.jpg';
    const batch = resampleImage(image, 300, 300);
    batch.writeFile(__dirname + '/' + fileNameOut, (err) => {
        console.log(fileNameOut);
    });
}