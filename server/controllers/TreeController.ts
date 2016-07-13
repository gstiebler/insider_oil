'use strict';

import * as tree from '../lib/Tree';
import * as express from "express";

exports.main = function(req: express.Request, res: express.Response) {
    res.json(tree);
};
