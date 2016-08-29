import { IMapObj, googleRef } from './Map';
import { IGeoPoint } from '../../../common/Interfaces';
import { BaseMapItem } from './BaseMapItem';

export class HeatMap extends BaseMapItem {

    constructor(mapObj: IMapObj, coordinates: any[]) {
        super(mapObj);

        const points = coordinates.map((item) => {
            return new googleRef.maps.LatLng(item.coordinates.lat, item.coordinates.lng);
        });

        const gHeatMap =  new googleRef.maps.visualization.HeatmapLayer({
            data: points,
            map: this.mapObj.gMap
        });

        this.setGMapItem(gHeatMap);
    }

}