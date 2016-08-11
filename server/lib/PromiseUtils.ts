'use strict';

var await = require('../lib/await');
var Sync = require('sync');

export function executePromisesSequentialy(promises: Promise<any>[]):Promise<any> {
    var promise = promises[0];
    for(var i = 1; i < promises.length; i++) {
        promise = promise.then();
    }
    return promise;
}

export function syncify(func):Promise<any> {
    return new Promise((resolve, reject) => {
        Sync(() => {
            func();
            resolve();
        }, (err) => {reject(err)});
    });
}