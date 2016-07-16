import { IMapObj, googleRef } from './Map';
import { IGeoPoint } from '../../../common/Interfaces';
import { BaseMapItem } from './BaseMapItem';

export class Polygon extends BaseMapItem {

    constructor(mapObj: IMapObj, polygon: IGeoPoint[], title: string, color: string) {
        super(mapObj);

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

}