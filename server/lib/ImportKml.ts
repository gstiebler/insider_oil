'use strict';

import { parseString } from 'xml2js';
import db = require('../db/models');
import * as winston from 'winston';
var Sync = require('sync');
var await = require('../lib/await');
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

    function processBlockKml(kmlObj:any):string {
        const missingBlocks:string[] = [];
        var okBlocks = 0;
        const Placemarks = getPlacemarks(kmlObj);
        Placemarks.map(placemark => {
            const simpleData = getSimpleData(placemark);
            const BlockName = simpleData[0]._;
            const block = await( db.models.Block.findOne({ where: { name: BlockName } }) );
            if(!block) {
                missingBlocks.push(BlockName);
                return;
            }
            
            const regions = getRegions(placemark, BlockName);
            block.polygons = JSON.stringify(regions);
            await( block.save() );
            okBlocks++;
        });
        return okBlocks + ' importados com sucesso. Os seguintes blocos não foram encontrados: ' + missingBlocks.join('\n');
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

export function importOilFields(kmlStr:string):Promise<string> {

    function getRegions(placemark, OilFieldName:string):any[] {
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
            winston.debug('sem polígonos em ' + OilFieldName);
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

    function processOilFieldKml(kmlObj:any):string {
        const missingOilFields:string[] = [];
        var okOilFields = 0;
        const Placemarks = getPlacemarks(kmlObj);
        Placemarks.map(placemark => {
            const simpleData = getSimpleData(placemark);
            const OilFieldName:string = simpleData[1]._;
            const withoutAccents = removerAcentos(OilFieldName);
            const withoutSpecialCharacters = withoutAccents.replace(/[^\w\s]/gi, '')
			winston.info('resultado remoçÃo acentos: ', withoutSpecialCharacters);
            const oilField = await( db.models.OilField.findOne({ where: { name: withoutSpecialCharacters } }) );
            if(!oilField) {
                missingOilFields.push(OilFieldName);
                return; 
            }
            
            const regions = getRegions(placemark, OilFieldName);
            oilField.polygons = JSON.stringify(regions);
            await( oilField.save() );
            okOilFields++;
        });
        return okOilFields + ' importados com sucesso. Os seguintes blocos não foram encontrados: ' + missingOilFields.join('\n');
    }

    return new Promise((resolve, reject) => {
        parseString(kmlStr, function (err, result) { Sync(function() {
            if(result) {
                const status = processOilFieldKml(result);
                resolve(status);
            } else if(err) {
                reject(err);
            } else {
                reject('Erro ao importar bloco');
            }
        })});
    });
}