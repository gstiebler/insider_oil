import { IMapObj, googleRef } from './Map';
import { IGeoPoint } from '../../../common/Interfaces';
import { BaseMapItem } from './BaseMapItem';

export class Marker extends BaseMapItem {

    constructor(mapObj: IMapObj, position: IGeoPoint, iconImage: stringtitle) {
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