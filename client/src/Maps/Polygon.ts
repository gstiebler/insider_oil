import { IMapObj, googleRef } from './Map';
import { IGeoPoint } from '../../../common/Interfaces';
import { BaseMapItem } from './BaseMapItem';

export class Polygon extends BaseMapItem {

    constructor(mapObj: IMapObj, polygon: IGeoPoint[]) {
        super(mapObj);

        const gPolygon = new googleRef.maps.Polygon({
            paths: polygon,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        gPolygon.setMap(this.mapObj.gMap);
       
        this.setGMapItem(gPolygon);
    }

}