var Sync = require('sync');

function transPro( promise, callback ) {
    promise.then( function(result) {
        callback( null, result );
    });
};

function await( promise ) {
    return transPro.sync( null, promise );
}

module.exports = await;