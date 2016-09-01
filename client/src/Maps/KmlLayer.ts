import { IMapObj } from './Map';
import { BaseMapItem } from './BaseMapItem';
import { googleRef } from '../lib/Google';

export class KmlLayer extends BaseMapItem {

    constructor(mapObj: IMapObj, fileName: string) {
        super(mapObj);

        var ctaLayer = new googleRef.maps.KmlLayer({
            url: fileName,
            map: this.mapObj.gMap
        });
       
        this.setGMapItem(ctaLayer);
    }

}