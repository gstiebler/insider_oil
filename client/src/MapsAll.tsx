import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import { Map, IMapObj, googleRef } from './Maps/Map';
import { Polygon } from './Maps/Polygon';
import { Marker } from './Maps/Marker';
import { IGeoPoint } from '../../common/Interfaces';
import { BaseMapItem } from './Maps/BaseMapItem';

interface IAppProps {
}

interface IAppState {
    initialState: any;
}

export class MapsAll extends React.Component<IAppProps, IAppState> {

    private mapObj: IMapObj;

    private blockMPolygons: Polygon[];
    private blocksVisible: boolean;

    private productionUnitMMarkers: Marker[];
    private productionUnitsVisible: boolean;

    constructor(props: IAppProps) {
        super(props);

        const rioDeJaneiroCoords = {lat: -23.0, lng: -43.0};
        this.state = {
            initialState: {
                zoom: 7,
                center: rioDeJaneiroCoords,
                mapTypeId: googleRef.maps.MapTypeId.HYBRID
            }
        };
        this.blockMPolygons = [];
        this.blocksVisible = true;
        
        this.productionUnitMMarkers = [];
        this.productionUnitsVisible = true;
    }

    private componentDidMount() {
        server.getP('/get_map_data', {})
            .then(this.onMapData.bind(this))
            .catch(showError.show);
    }

    private onMapData(mapData) {
        this.addBlocksToMap(mapData.blocks);
        this.addProductionUnitsToMap(mapData.productionUnits);
    }

    private addBlocksToMap(blocks) {
        this.blockMPolygons.length = 0;
        blocks.map(block => {
            var polygons:IGeoPoint[][] = JSON.parse(block.polygons);
            if(!polygons) {
                return;
            }
            polygons.map((polygon) => {
                var mPolygon = new Polygon(this.mapObj, polygon);
                mPolygon.setBillboardFn(() => {
                    const url = '/app/view_record?source=Block&id=' + block.id;
                    return '<b>Bloco: </b><a href="' + url + '">' + block.name + '</a>'
                });
                this.blockMPolygons.push(mPolygon);
            });
        });
    }

    private addProductionUnitsToMap(productionUnits) {
        this.productionUnitMMarkers.length = 0;
        const platformImage = 'images/platform.png';
        productionUnits.map(productionUnit => {
            var coordinates:IGeoPoint = JSON.parse(productionUnit.coordinates);
            if(!coordinates) {
                return;
            }
            var mMarker = new Marker(this.mapObj, coordinates, platformImage);
            mMarker.setBillboardFn(() => {
                const url = '/app/view_record?source=ProductionUnit&id=' + productionUnit.id;
                return '<b>Unidade de produção: </b><a href="' + url + '">' + productionUnit.name + '</a>'
            });
            this.productionUnitMMarkers.push(mMarker);
        });
    }

    private changeMapsItemsVisibility(mObjects: BaseMapItem[], visibilityFieldName: string, event) {
        this[visibilityFieldName] = !this[visibilityFieldName];
        for(let mObject of mObjects) {
            mObject.setVisibility(this[visibilityFieldName]);
        }
    }

    public render(): React.ReactElement<any> {
        const style = {
            width: '100%',
            height: 700
        }
        return (
            <div>
                <Map initialState={this.state.initialState}
                    receiveMapObj={(mo) => this.mapObj = mo}
                    style={style} />
                <input type="checkbox" defaultChecked={true}
                    onChange={this.changeMapsItemsVisibility.bind(this, this.blockMPolygons, 'blocksVisible')}/> 
                    Exibir blocos<br/>
                <input type="checkbox" defaultChecked={true}
                    onChange={this.changeMapsItemsVisibility.bind(this, this.productionUnitMMarkers, 'productionUnitsVisible')}/> 
                    Exibir unidades de produção
            </div>
        );
    }
}