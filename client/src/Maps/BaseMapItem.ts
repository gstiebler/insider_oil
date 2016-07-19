import { IMapObj } from './Map';
import * as Promise from 'bluebird';
import * as Flash from '../Flash'

interface IBillboardFunction {
    (): Promise<string>;
} 

export class BaseMapItem {

    protected mapObj: IMapObj;
    private gMapItem: any;
    private billboardFn: IBillboardFunction;

    constructor(mapObj: IMapObj) {
        this.mapObj = mapObj;
    }

    protected setGMapItem(gMapItem) {
        this.gMapItem = gMapItem;
    }

    public setBillboardFn(billboardFn: IBillboardFunction) {
        this.billboardFn = billboardFn;

        // Add a listener for the click event.
        this.gMapItem.addListener('click', this.showBillboard.bind(this));
    }

    private showBillboard(event) {
        this.billboardFn()
            .then(this.onBillboardContent.bind(this, event.latLng))
            .catch((error) => { Flash.create('warning', error); });
    }

    private onBillboardContent(latLng, contentString: string) {
        // Replace the info window's content and position.
        this.mapObj.infoWindow.setContent(contentString);
        this.mapObj.infoWindow.setPosition(latLng);

        this.mapObj.infoWindow.open(this.mapObj.gMap);
    }

    public setVisibility(visible: boolean) {
        this.gMapItem.setMap(visible ? this.mapObj.gMap : null);
    }

}