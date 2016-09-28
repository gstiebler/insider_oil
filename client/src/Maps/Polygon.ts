import { IMapObj } from './Map';
import { IGeoPoint } from '../../../common/Interfaces';
import { BaseMapItem } from './BaseMapItem';
import { googleRef } from '../lib/Google';

interface IPolygonDimensions {
    width: number;
    height: number;
    center: IGeoPoint; 
}

export class Polygon extends BaseMapItem {

    private polygon: IGeoPoint[];

    constructor(mapObj: IMapObj, polygon: IGeoPoint[], title: string, color: string) {
        super(mapObj);

        this.polygon = polygon;
        const gPolygon = new googleRef.maps.Polygon({
            paths: polygon,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: color,
            fillOpacity: 0.35
        });
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