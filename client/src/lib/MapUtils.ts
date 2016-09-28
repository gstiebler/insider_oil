import * as Promise from 'bluebird';
import * as server from './Server';

export const rioDeJaneiroCoords = {lat: -23.0, lng: -43.0};

export function showBillboard(object, modelName: string, billboardHTMLfn): Promise<string> {
    return new Promise<string>(function(resolve, reject) {
        const req = {
            queryName: 'NewsByObject',
            filters: {
                modelName,
                id: object.id
            }
        };
        server.getQueryData(req)
        .then(res => {
            var result = billboardHTMLfn(object);
            if(res.records.length > 0) {
                result += '<hr/><b>Notícias:</b>';
            }
            for(var newsRecord of res.records) {
                const newsUrl = '/app/view_record?source=News&id=' + newsRecord.id;
                result += '<br/><a href="' + newsUrl + '">' + newsRecord.title + '</a>';
            }
            resolve(result);
        }).catch(reject);
    });
}