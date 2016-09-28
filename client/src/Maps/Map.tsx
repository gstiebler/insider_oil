import * as React from 'react';
import * as showError from '../lib/ShowError';
import { googleRef } from '../lib/Google';

export interface IMapObj {
    gMap:any;
    infoWindow:any;
}

interface IAppProps {
    initialState: any;
    receiveMapObj: any;
}

interface IAppState {
}

export class Map extends React.Component<IAppProps, IAppState> {

    private mapObj: IMapObj;

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
    }

    private componentDidMount() {
        this.initMap();
    }    

    private initMap() {
        this.mapObj = {
            infoWindow: new googleRef.maps.InfoWindow,
            gMap: new googleRef.maps.Map(
                                    document.getElementById('map'), 
                                    this.props.initialState)
        }
        this.props.receiveMapObj(this.mapObj);
    }

    public render(): React.ReactElement<any> {
        const style = {
            width: 100 + '%',
            height: 700
        }
        return (
            <div>
                <div id="map" style={style} />
            </div>
        );
    }
}