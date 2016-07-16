import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import { Map, IMapObj, googleRef } from './Maps/Map';
import { IGeoPoint } from '../../common/Interfaces';
import { BaseMapItem } from './Maps/BaseMapItem';
import { Polygon } from './Maps/Polygon';
import { Marker } from './Maps/Marker';
import { KmlLayer } from './Maps/KmlLayer';

interface IAppProps {
}

interface IAppState {
    initialState: any;
}

export class MapsAll extends React.Component<IAppProps, IAppState> {

    private mapObj: IMapObj;

    private blockMPolygons: Polygon[];
    private blocksVisible: boolean;

    private oilFieldMPolygons: Polygon[];
    private oilFieldsVisible: boolean;

    private productionUnitMMarkers: Marker[];
    private productionUnitsVisible: boolean;

    private gasPipeLayer: KmlLayer;
    private gasPipelinesVisible: boolean;

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

        this.oilFieldMPolygons = [];
        this.oilFieldsVisible = true;
        
        this.productionUnitMMarkers = [];
        this.productionUnitsVisible = true;

        this.gasPipelinesVisible = true;
    }

    private componentDidMount() {
        server.getP('/get_map_data', {})
            .then(this.onMapData.bind(this))
            .catch(showError.show);

        this.gasPipeLayer = new KmlLayer(this.mapObj, 'http://app.insideroil.com/maps/Gasodutos.kml');
    }

    private onMapData(mapData) {
        this.addBlocksToMap(mapData.blocks);
        this.addOilFieldsToMap(mapData.oilFields);
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
                const title = 'Bloco: ' + block.name;
                var mPolygon = new Polygon(this.mapObj, polygon, title, '#FF0000');
                mPolygon.setBillboardFn(() => {
                    const url = '/app/view_record?source=Block&id=' + block.id;
                    return '<b>Bloco: </b><a href="' + url + '">' + block.name + '</a>'
                });
                this.blockMPolygons.push(mPolygon);
            });
        });
    }

    private addOilFieldsToMap(oilFields) {
        this.oilFieldMPolygons.length = 0;
        oilFields.map(oilField => {
            var polygons:IGeoPoint[][] = JSON.parse(oilField.polygons);
            if(!polygons) {
                return;
            }
            polygons.map((polygon) => {
                const title = 'Campo: ' + oilField.name;
                var mPolygon = new Polygon(this.mapObj, polygon, title, '#FFFF00');
                mPolygon.setBillboardFn(() => {
                    const url = '/app/view_record?source=OilField&id=' + oilField.id;
                    return '<b>Campo: </b><a href="' + url + '">' + oilField.name + '</a>'
                });
                this.oilFieldMPolygons.push(mPolygon);
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
            const title = 'Unidade de produção: ' + productionUnit.name;
            var mMarker = new Marker(this.mapObj, coordinates, platformImage, title);
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

    private changeKmlLayerVisibility(kmlLayerKeyName, visibilityKeyName: string, event) {
        // it's getting by keyname because the member is not initialized when render is called
        const kmlLayer: KmlLayer = this[kmlLayerKeyName];
        this[visibilityKeyName] = !this[visibilityKeyName];
        kmlLayer.setVisibility(this[visibilityKeyName]);
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
                    onChange={this.changeMapsItemsVisibility.bind(this, this.oilFieldMPolygons, 'blocksVisible')}/> 
                    Exibir campos<br/>
                <input type="checkbox" defaultChecked={true}
                    onChange={this.changeMapsItemsVisibility.bind(this, this.productionUnitMMarkers, 'productionUnitsVisible')}/> 
                    Exibir unidades de produção<br/>
                <input type="checkbox" defaultChecked={true}
                    onChange={this.changeKmlLayerVisibility.bind(this, 'gasPipeLayer', 'gasPipelinesVisible')}/> 
                    Exibir gasodutos<br/>
            </div>
        );
    }
}