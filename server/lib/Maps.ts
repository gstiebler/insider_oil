import db = require('../db/models');
import { GetItemsInsideMap } from '../../common/NetworkInterfaces';
import { IQueryParams } from '../../common/Interfaces';
import * as QueryGenerator from '../db/queries/QueryGenerator';
import { queries } from  '../db/queries/TableQueries';

const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};

function getProductionUnitsInsideAreaQuery(geoLimits: GetItemsInsideMap.IGeoLimits): string {
    const options:QueryGenerator.IQueryOpts = {
        table: {
            name: 'production_units',
            fields: [
                'id', 
                'name',
            ]
        },
        extraFields: [
            ['"ProductionUnit"', 'model']
        ],
        joinTables: [],
        where: [
            { customFilter: 'JSON_EXTRACT(coordinates, "$.lat") >= ' + geoLimits.latMin },
            { customFilter: 'JSON_EXTRACT(coordinates, "$.lat") <= ' + geoLimits.latMax },
            { customFilter: 'JSON_EXTRACT(coordinates, "$.lng") >= ' + geoLimits.lngMin },
            { customFilter: 'JSON_EXTRACT(coordinates, "$.lng") <= ' + geoLimits.lngMax }
        ],
        order: []
    };
    const puQueryStr = QueryGenerator.generate(options);
    return puQueryStr;
}

function geDrillingRigsInsideAreaQuery(geoLimits: GetItemsInsideMap.IGeoLimits): string {
    const queryParams: IQueryParams = {
        order: [], 
        filters: [
            { customFilter: 'JSON_EXTRACT(coordinates, "$.lat") >= ' + geoLimits.latMin },
            { customFilter: 'JSON_EXTRACT(coordinates, "$.lat") <= ' + geoLimits.latMax },
            { customFilter: 'JSON_EXTRACT(coordinates, "$.lng") >= ' + geoLimits.lngMin },
            { customFilter: 'JSON_EXTRACT(coordinates, "$.lng") <= ' + geoLimits.lngMax }
        ],
        pagination: {
            first: 0,
            itemsPerPage: 300
        } 
    };
    const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};
    let drQueryStr = queries['DrillingRigs'].queryStrFn(queryParams);
    drQueryStr = 'select dr_id as id, dr_name as name, model from (' + drQueryStr + ') as dr';
    return drQueryStr;
}

export async function getItemsInsideArea(geoLimits: GetItemsInsideMap.IGeoLimits): Promise<GetItemsInsideMap.IMapItem[]> {
    const subQueries: string[] = [];
    subQueries.push( getProductionUnitsInsideAreaQuery(geoLimits) );
    subQueries.push( geDrillingRigsInsideAreaQuery(geoLimits) );

    const query = '(' + subQueries.join(') union (') + ')';

    const items = await db.sequelize.query(query, simpleQueryType);
    return items;
}