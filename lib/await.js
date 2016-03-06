var Sync = require('sync');

function transPro( promise, callback ) {
    var promiseResponse = promise.then( function(result) {
        callback( null, result );
    });
    if(promiseResponse.thenCatch) {
        promiseResponse.thenCatch(function(error) {
            console.error(error.stack); // something went wrong
            callback(error);
            throw error;
        });
    } else if(promiseResponse.catch) {
        promiseResponse.catch(function(error) {
            console.error(error.stack); // something went wrong
            callback(error);
            throw error;
        });
    }
    return promiseResponse;
};

function await( promise ) {
    return transPro.sync( null, promise );
}

module.exports = await;