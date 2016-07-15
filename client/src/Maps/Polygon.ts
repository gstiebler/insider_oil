import { IMapObj, googleRef } from './Map';
import { IGeoPoint } from '../../../common/Interfaces';

export class Polygon {

    private mapObj: IMapObj;
    private gPolygon: any;
    private billboardFn: any;

    constructor(mapObj: IMapObj, polygon: IGeoPoint[]) {
        this.mapObj = mapObj;

        this.gPolygon = new googleRef.maps.Polygon({
            paths: polygon,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
       this. gPolygon.setMap(this.mapObj.gMap);
    }

    public setBillboardFn(billboardFn) {
        this.billboardFn = billboardFn;

        // Add a listener for the click event.
        this.gPolygon.addListener('click', this.showBillboard.bind(this));
    }

    private showBillboard(event) {
        var contentString = this.billboardFn();

        // Replace the info window's content and position.
        this.mapObj.infoWindow.setContent(contentString);
        this.mapObj.infoWindow.setPosition(event.latLng);

        this.mapObj.infoWindow.open(this.mapObj.gMap);
    }
    
}