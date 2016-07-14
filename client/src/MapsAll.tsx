import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';

interface IAppProps {
}

interface IAppState {
}

export class MapsAll extends React.Component<IAppProps, IAppState> {

    private map:any;
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
        this.map = new this.googleMaps.maps.Map(document.getElementById('map'), {
            zoom: 5,
            center: {lat: 24.886, lng: -70.268},
            mapTypeId: this.googleMaps.maps.MapTypeId.TERRAIN
        });

        this.infoWindow = new this.googleMaps.maps.InfoWindow;
    }

    private onMapData(mapData) {
        mapData.blocks.map(block => {// Construct the polygon.
            var polygons = JSON.parse(block.polygons);
            polygons.map(polygon => {
                var gPolygon = new this.googleMaps.maps.Polygon({
                    paths: polygon,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35
                });
                gPolygon.setMap(this.map);

                // Add a listener for the click event.
                gPolygon.addListener('click', this.showArrays.bind(this, block));
            });
        });
    }

    private showArrays(block, event) {
        var contentString = '<b>Bloco: </b>' + block.name + '<br/>'

        // Replace the info window's content and position.
        this.infoWindow.setContent(contentString);
        this.infoWindow.setPosition(event.latLng);

        this.infoWindow.open(this.map);
    }

    public render(): React.ReactElement<any> {
        const style = {
            width: '800px',
            height: '500px'
        }
        return (
            <div>
                <div id="map" style={style} />
            </div>
        );
    }
}