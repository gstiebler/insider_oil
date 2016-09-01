import { IMapObj } from './Map';
import { IGeoPoint } from '../../../common/Interfaces';
import { BaseMapItem } from './BaseMapItem';
import { googleRef } from '../lib/Google';

export class HeatMap extends BaseMapItem {

    constructor(mapObj: IMapObj, coordinates: any[]) {
        super(mapObj);

        const points = coordinates.map((item) => {
            return new googleRef.maps.LatLng(item.coordinates.lat, item.coordinates.lng);
        });

        const gHeatMap =  new googleRef.maps.visualization.HeatmapLayer({
            data: points,
            map: this.mapObj.gMap,
            maxIntensity: 50,
            //radius: 30
        });

        //gHeatMap.set('radius', 30);
        this.setGMapItem(gHeatMap);
    }

}