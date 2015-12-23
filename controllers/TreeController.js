'use strict';

var tree = require('../lib/Tree');

exports.main = function(req, res, next) {
    res.send(tree);
};
