import utils = require('../lib/utils');
import { await } from '../../lib/await';

module.exports = function(db) {
    const objs = [
        {
            name: 'Petróleo'
        },
        {
            name: 'Drilling'
        },
        {
            name: 'Floatel'
        },
        {
            name: 'Seismic'
        },
        {
            name: 'Apoio Offshore'
        },
        {
            name: 'FPSO'
        },
        {
            name: 'Produção'
        },
        {
            name: 'Dummy'
        },
        {
            name: 'UMS'
        },
        {
            name: 'UPSTREAM'
        },
        {
            name: 'Oilfield Services'
        },
        {
            name: 'Manutenção'
        },
    ];

    for(var obj of objs) { 
        await(db.models.IndustrySegment.create(obj));
    }
}