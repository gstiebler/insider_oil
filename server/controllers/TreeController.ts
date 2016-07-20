'use strict';

import * as tree from '../lib/Tree';
import * as express from "express";

export function main(req: express.Request, res: express.Response) {
    res.json(tree);
};
