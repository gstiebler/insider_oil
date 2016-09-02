'use strict';

import { parseString } from 'xml2js';
import db = require('../db/models');
import * as winston from 'winston';
var Sync = require('sync');
import { await } from '../lib/await';
var removerAcentos = require('remover-acentos');

export interface IImportFunc {
    (kmlStr:string): Promise<string>;
}

function getPlacemarks(kmlObj) {
    return kmlObj.kml.Document[0].Folder[0].Placemark;
}

function getSimpleData(placemark) {
    return placemark.ExtendedData[0].SchemaData[0].SimpleData;
}

function getRegions(placemark, objName:string):any[] {
    var kmlPolygons = [];
    if(placemark.Polygon) {
        const linearRing = placemark.Polygon[0].outerBoundaryIs[0].LinearRing[0];
        kmlPolygons.push(linearRing);
    } else if (placemark.MultiGeometry) {
        kmlPolygons = placemark.MultiGeometry[0].Polygon.map(polygon => {
            const linearRing = polygon.outerBoundaryIs[0].LinearRing[0];
            return linearRing;
        });
    } else {
        winston.debug('sem polígonos em ' + objName);
        return;
    }

    const regions = [];
    kmlPolygons.map(linearRing => {
        const coordinatesRawStr:string = linearRing.coordinates[0];
        const coordinatesStr = coordinatesRawStr.replace(/\n/g, '').replace(/\t/g, '');

        const polygons = [];
        const coordinateStrs = coordinatesStr.split(' ');
        const coordinates = coordinateStrs.map((floatStr:string) => {
            const floatStrs = floatStr.split(',');
            if(floatStrs.length != 3) {
                return;
            }
            polygons.push({
                lat: parseFloat(floatStrs[1]),
                lng: parseFloat(floatStrs[0])
            });
        });

        regions.push(polygons);
    });
    return regions;
}

function processKmlObj(kmlObj:any, modelName: string, nameIndex: number):string {
    const missingObjs:string[] = [];
    var okObjs = 0;
    const model = db.models[modelName];
    const Placemarks = getPlacemarks(kmlObj);
    Placemarks.map(placemark => {
        const simpleData = getSimpleData(placemark);
        const objName:string = simpleData[nameIndex]._;
        const withoutAccents = removerAcentos(objName);
        const withoutSpecialCharacters = withoutAccents.replace(/[^\w\s]/gi, '')
        winston.info('resultado remoçÃo acentos: ', withoutSpecialCharacters);
        const objOnDB = await( model.findOne({ where: { name: withoutSpecialCharacters } }) );
        if(!objOnDB) {
            missingObjs.push(objName);
            return; 
        }
        
        const regions = getRegions(placemark, objName);
        objOnDB.polygons = JSON.stringify(regions);
        await( objOnDB.save() );
        okObjs++;
    });
    return okObjs + ' importados com sucesso. Os seguintes blocos não foram encontrados: ' + missingObjs.join('\n');
}

function processKmlString(kmlStr: string, modelName: string, nameIndex: number):Promise<string> {
    return new Promise((resolve, reject) => {
        parseString(kmlStr, function (err, result) { Sync(function() {
            if(result) {
                const status = processKmlObj(result, modelName, nameIndex);
                resolve(status);
            } else if(err) {
                reject(err);
            } else {
                reject('Erro ao importar kml');
            }
        })});
    });
}

export function importBlocks(kmlStr:string):Promise<string> {
    return processKmlString(kmlStr, 'Block', 0);
}

export function importOilFields(kmlStr:string):Promise<string> {
    return processKmlString(kmlStr, 'OilField', 1);
}