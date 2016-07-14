'use strict';

import { parseString } from 'xml2js';
import db = require('../db/models');
import * as winston from 'winston';
var Sync = require('sync');
var await = require('../lib/await');

export function importBlocks(kmlStr:string):Promise<string> {

    function getRegions(placemark, BlockName:string):any[] {
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
            winston.debug('sem polígonos em ' + BlockName);
            return;
        }

        const regions = [];
        kmlPolygons.map(linearRing => {
            const coordinatesRawStr:string = linearRing.coordinates[0];
            const coordinatesStr = coordinatesRawStr.replace(/\n/g, '').replace(/\t/g, '');
            const coordinates = coordinatesStr.split(',').map((floatStr:string):number => {
                const floatStrs = floatStr.split(' ');
                return parseFloat(floatStrs[floatStrs.length-1]);
            });

            const polygons = [];
            for(var i = 0; i < coordinates.length - 1; i += 2) {
                polygons.push({
                    lat: coordinates[i],
                    lng: coordinates[i + 1]
                });
            }
            regions.push(polygons);
        });
        return regions;
    }

    function processBlockKml(kmlObj:any):string {
        const missingBlocks:string[] = [];
        const Placemarks = kmlObj.kml.Document[0].Folder[0].Placemark
        Placemarks.map(placemark => {
            const simpleData = placemark.ExtendedData[0].SchemaData[0].SimpleData;
            const BlockName = simpleData[0]._;
            const block = await( db.models.Block.findOne({ where: { name: BlockName } }) );
            if(!block) {
                missingBlocks.push(BlockName);
                return;
            }
            
            const regions = getRegions(placemark, BlockName);
            block.polygons = JSON.stringify(regions);
            await( block.save() );
        });
        return 'status';
    }

    return new Promise((resolve, reject) => {
        parseString(kmlStr, function (err, result) { Sync(function() {
            if(result) {
                const status = processBlockKml(result);
                resolve(status);
            } else if(err) {
                reject(err);
            } else {
                reject('Erro ao importar bloco');
            }
        })});
    });
}