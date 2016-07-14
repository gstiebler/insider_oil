import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';

interface IAppProps {
}

interface IAppState {
}

export class MapsAll extends React.Component<IAppProps, IAppState> {

    private gMap:any;
    private infoWindow:any;
    private googleMaps:any;

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
    }

    private componentDidMount() {
        this.initMap();
        server.getP('/get_map_data', {})
            .then(this.onMapData.bind(this))
            .catch(showError.show);
    }    

    private initMap() {
        this.googleMaps = google;
        this.gMap = new this.googleMaps.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: {lat: -10.0, lng: -53.0},
            mapTypeId: this.googleMaps.maps.MapTypeId.HYBRID
        });

        this.infoWindow = new this.googleMaps.maps.InfoWindow;
    }

    private onMapData(mapData) {
        mapData.blocks.map(block => {// Construct the polygon.
            var polygons = JSON.parse(block.polygons);
            if(!polygons) {
                return;
            }
            polygons.map(polygon => {
                var gPolygon = new this.googleMaps.maps.Polygon({
                    paths: polygon,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35
                });
                gPolygon.setMap(this.gMap);

                // Add a listener for the click event.
                gPolygon.addListener('click', this.showArrays.bind(this, block));
            });
        });
    }

    private showArrays(block, event) {
        const url = '/app/view_record?source=Block&id=' + block.id;
        var contentString = '<b>Bloco: </b><a href="' + url + '">' + block.name + '</a>'

        // Replace the info window's content and position.
        this.infoWindow.setContent(contentString);
        this.infoWindow.setPosition(event.latLng);

        this.infoWindow.open(this.gMap);
    }

    public render(): React.ReactElement<any> {
        const style = {
            width: '800px',
            height: '700px'
        }
        return (
            <div>
                <div id="map" style={style} />
            </div>
        );
    }
}