import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';

var map;
var infoWindow;

function showArrays(event) {
    // Since this polygon has only one path, we can call getPath() to return the
    // MVCArray of LatLngs.
    var vertices = this.getPath();

    var contentString = '<b>Bermuda Triangle polygon</b><br>' +
        'Clicked location: <br>' + event.latLng.lat() + ',' + event.latLng.lng() +
        '<br>' + '<a href="http://www.google.com">Google</a>';

    // Iterate over the vertices.
    for (var i =0; i < vertices.getLength(); i++) {
        var xy = vertices.getAt(i);
        contentString += '<br>' + 'Coordinate ' + i + ':<br>' + xy.lat() + ',' +
            xy.lng();
    }

    // Replace the info window's content and position.
    infoWindow.setContent(contentString);
    infoWindow.setPosition(event.latLng);

    infoWindow.open(map);
}

interface IAppProps {
}

interface IAppState {
}

export class MapsAll extends React.Component<IAppProps, IAppState> {

    public state: IAppState;

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
    }

    private componentDidMount() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 5,
            center: {lat: 24.886, lng: -70.268},
            mapTypeId: google.maps.MapTypeId.TERRAIN
        });

        // Define the LatLng coordinates for the polygon.
        var triangleCoords = [
            {lat: 25.774, lng: -80.190},
            {lat: 18.466, lng: -66.118},
            {lat: 32.321, lng: -64.757}
        ];

        // Construct the polygon.
        var bermudaTriangle = new google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        bermudaTriangle.setMap(map);

        infoWindow = new google.maps.InfoWindow;

        // Add a listener for the click event.
        bermudaTriangle.addListener('click', showArrays);
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