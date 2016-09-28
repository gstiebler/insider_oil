import { IMapObj } from './Map';
import { IGeoPoint } from '../../../common/Interfaces';
import { BaseMapItem } from './BaseMapItem';
import { googleRef } from '../lib/Google';

interface IPolygonDimensions {
    width: number;
    height: number;
    center: IGeoPoint; 
}

export interface IOptions {
    paths: IGeoPoint[];
    strokeColor: string;
    strokeOpacity: number;
    strokeWeight: number;
    fillColor: string;
    fillOpacity: number;
}

export class Polygon extends BaseMapItem {

    private polygon: IGeoPoint[];

    constructor(mapObj: IMapObj, title: string, options: IOptions) {
        super(mapObj);

        this.polygon = options.paths;
        const gPolygon = new googleRef.maps.Polygon(options);
        gPolygon.setMap(this.mapObj.gMap);
       
        this.setGMapItem(gPolygon);
    }

    public getDimensions():IPolygonDimensions {
        let minLat = 1000.0;
        let minLng = 1000.0;
        let maxLat = -1000.0;
        let maxLng = -1000.0;
        for(let point of this.polygon) {
            minLat = Math.min(minLat, point.lat);
            minLng = Math.min(minLng, point.lng);
            maxLat = Math.max(maxLat, point.lat);
            maxLng = Math.max(maxLng, point.lng);
        }
        return {
            width: maxLng - minLng,
            height: maxLat - minLat,
            center: {
                lat: (maxLat + minLat) / 2,
                lng: (maxLng + minLng) / 2
            }
        };
    }

}