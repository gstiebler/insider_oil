var Busboy = require('busboy');

exports.receive = function( req, onFile, onFinish ) {
    var busboy = new Busboy({ headers: req.headers });
    var allData = [];
    var dataLen = 0; 
    
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      
        file.on('data', function(data) {
            allData.push(data);
            dataLen += data.length;
        });
      
        file.on('end', function() {
            var buf = new Buffer(dataLen); 
            for (var i=0, pos = 0; i < allData.length; i++) { 
                allData[i].copy(buf, pos); 
                pos += allData[i].length; 
            } 
            onFile( filename, buf );
        });
    });
    
    busboy.on('finish', onFinish);
    
    req.pipe(busboy);
}