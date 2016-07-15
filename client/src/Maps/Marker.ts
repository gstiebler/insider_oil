import { IMapObj, googleRef } from './Map';
import { IGeoPoint } from '../../../common/Interfaces';

export class Marker {

    private mapObj: IMapObj;
    private gMarker: any;
    private billboardFn: any;

    constructor(mapObj: IMapObj, position: IGeoPoint, iconImage: string) {
        this.mapObj = mapObj;

        this.gMarker = new googleRef.maps.Marker({
            position: position,
            map: this.mapObj.gMap,
            title: 'Hello World!',
            icon: iconImage
        });
    }

    public setBillboardFn(billboardFn) {
        this.billboardFn = billboardFn;

        // Add a listener for the click event.
        this.gMarker.addListener('click', this.showBillboard.bind(this));
    }

    private showBillboard(event) {
        var contentString = this.billboardFn();

        // Replace the info window's content and position.
        this.mapObj.infoWindow.setContent(contentString);
        this.mapObj.infoWindow.setPosition(event.latLng);

        this.mapObj.infoWindow.open(this.mapObj.gMap);
    }

    public setVisibility(visible: boolean) {
        this.gMarker.setMap(visible ? this.mapObj.gMap : null);
    }

}