'use strict';

import tree = require('../lib/Tree');

exports.main = function(req, res, next) {
    res.json(tree);
};
