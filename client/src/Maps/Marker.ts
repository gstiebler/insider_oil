import { IMapObj } from './Map';
import { IGeoPoint } from '../../../common/Interfaces';
import { BaseMapItem } from './BaseMapItem';
import { googleRef } from '../lib/Google';

export class Marker extends BaseMapItem {

    constructor(mapObj: IMapObj, position: IGeoPoint, iconImage: string, title: string) {
        super(mapObj);

        const gMarker = new googleRef.maps.Marker({
            position: position,
            map: this.mapObj.gMap,
            title,
            icon: iconImage
        });

        this.setGMapItem(gMarker);
    }

}