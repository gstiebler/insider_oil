"use strict"

import db = require('../db/models');

interface IModelInclude {
    model: any;
    as: string;
    attributes: string[];
}

export interface IGetRecordOptions {
    model: any;
    seqOptions: {
        attributes: string[];
        include?: IModelInclude;
    }
}

export const getRecordOptions = {
    'SingleNews': {
        model: db.models.News,
        seqOptions: {
            attributes: [
                'title',
                'content',
                'created_at'
            ],
            include: [{
                model: db.models.News.associations['author'].target, 
                as: 'author',
                attributes: ['name']
            }]
        }
    }
}  