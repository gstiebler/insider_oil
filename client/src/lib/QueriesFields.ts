import * as server from './Server';
import * as showError from './ShowError';
import * as Promise from 'bluebird';
import { GetTableQueriesFields } from '../../../common/NetworkInterfaces';
import { IField } from '../../../common/Interfaces';

var fields = null;

function onQueriesFields(resolve, field: string, res:GetTableQueriesFields.res) {
    fields = res;
    resolve(fields[field]);
}

export function getFields(field: string):Promise<IField[]> {
    return new Promise<IField[]>((resolve, reject) => {
        if(fields) {
            resolve(fields[field]);
        } else {
            server.getP('/queries_fields', {})
                .then(onQueriesFields.bind(this, resolve, field))
                .catch(showError.show);
        }
    });
}