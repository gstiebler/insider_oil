import { IMapObj, googleRef } from './Map';
import { IGeoPoint } from '../../../common/Interfaces';
import { BaseMapItem } from './BaseMapItem';

export class Marker extends BaseMapItem {

    constructor(mapObj: IMapObj, position: IGeoPoint, iconImage: string) {
        super(mapObj);

        const gMarker = new googleRef.maps.Marker({
            position: position,
            map: this.mapObj.gMap,
            title: 'Hello World!',
            icon: iconImage
        });

        this.setGMapItem(gMarker);
    }

}