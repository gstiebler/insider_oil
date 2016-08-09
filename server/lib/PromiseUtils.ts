'use strict';

export function executePromisesSequentialy(promises: Promise<any>[]):Promise<any> {
    var promise = promises[0];
    for(var i = 1; i < promises.length; i++) {
        promise = promise.then();
    }
    return promise;
}