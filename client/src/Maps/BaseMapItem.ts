import { IMapObj } from './Map';

export class BaseMapItem {

    protected mapObj: IMapObj;
    private gMapItem: any;
    private billboardFn: any;

    constructor(mapObj: IMapObj) {
        this.mapObj = mapObj;
    }

    protected setGMapItem(gMapItem) {
        this.gMapItem = gMapItem;
    }

    public setBillboardFn(billboardFn) {
        this.billboardFn = billboardFn;

        // Add a listener for the click event.
        this.gMapItem.addListener('click', this.showBillboard.bind(this));
    }

    private showBillboard(event) {
        var contentString = this.billboardFn();

        // Replace the info window's content and position.
        this.mapObj.infoWindow.setContent(contentString);
        this.mapObj.infoWindow.setPosition(event.latLng);

        this.mapObj.infoWindow.open(this.mapObj.gMap);
    }

    public setVisibility(visible: boolean) {
        this.gMapItem.setMap(visible ? this.mapObj.gMap : null);
    }

}