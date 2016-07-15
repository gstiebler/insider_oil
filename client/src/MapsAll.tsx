import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import { Map, IMapObj, googleRef } from './Maps/Map';
import { Polygon } from './Maps/Polygon';
import { IGeoPoint } from '../../common/Interfaces';

interface IAppProps {
}

interface IAppState {
    initialState: any;
}

export class MapsAll extends React.Component<IAppProps, IAppState> {

    private mapObj: IMapObj;
    private blockMPolygons: Polygon[];
    private blocksVisible: boolean;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            initialState: {
                zoom: 4,
                center: {lat: -10.0, lng: -53.0},
                mapTypeId: googleRef.maps.MapTypeId.HYBRID
            }
        };
        this.blockMPolygons = [];
        this.blocksVisible = true;
    }

    private componentDidMount() {
        server.getP('/get_map_data', {})
            .then(this.onMapData.bind(this))
            .catch(showError.show);
    }

    private onMapData(mapData) {
        this.addBlocksToMap(mapData.blocks);
    }

    private addBlocksToMap(blocks) {
        this.blockMPolygons = [];
        blocks.map(block => {
            var polygons = JSON.parse(block.polygons);
            if(!polygons) {
                return;
            }
            polygons.map((polygon:IGeoPoint[]) => {
                var mPolygon = new Polygon(this.mapObj, polygon);
                mPolygon.setBillboardFn(() => {
                    const url = '/app/view_record?source=Block&id=' + block.id;
                    return '<b>Bloco: </b><a href="' + url + '">' + block.name + '</a>'
                });
                this.blockMPolygons.push(mPolygon);
            });
        });
    }

    private changeBlocksVisibility(event) {
        this.blocksVisible = !this.blocksVisible;
        for(let mPolygon of this.blockMPolygons) {
            mPolygon.setVisibility(this.blocksVisible);
        }
    }

    public render(): React.ReactElement<any> {
        const style = {
            width: '800px',
            height: '700px'
        }
        return (
            <div>
                <Map initialState={this.state.initialState}
                    receiveMapObj={(mo) => this.mapObj = mo} />
                <input type="checkbox" defaultChecked={true}
                    onChange={this.changeBlocksVisibility.bind(this)}/> Exibir blocos
            </div>
        );
    }
}