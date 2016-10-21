import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { Map, IMapObj } from '../Maps/Map';
import { showBillboard, rioDeJaneiroCoords } from '../lib/MapUtils';
import { googleRef } from '../lib/Google';
import { IGeoPoint } from '../../../common/Interfaces';
import { BaseMapItem } from '../Maps/BaseMapItem';
import * as Polygon from '../Maps/Polygon';
import { Marker } from '../Maps/Marker';
import { HeatMap } from '../Maps/HeatMap';
import { KmlLayer } from '../Maps/KmlLayer';
import * as Promise from 'bluebird';

interface IAppProps {
}

interface IAppState {
    initialState: any;
}

export class MapsAll extends React.Component<IAppProps, IAppState> {

    private mapObj: IMapObj;

    private blockMPolygons: Polygon.Polygon[];
    private blocksVisible: boolean;

    private oilFieldMPolygons: Polygon.Polygon[];
    private oilFieldsVisible: boolean;

    private productionUnitMMarkers: Marker[];
    private productionUnitsVisible: boolean;

    private drillingRigMMarkers: Marker[];
    private drillingRigVisible: boolean;

    private gasPipeLayer: KmlLayer;
    private gasPipelinesVisible: boolean;

    private wellHeatMap: HeatMap;
    private wellHeatMapVisible: boolean;

    constructor(props: IAppProps) {
        super(props);

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
        
        this.drillingRigMMarkers = [];
        this.drillingRigVisible = true;

        this.gasPipelinesVisible = false;

        this.wellHeatMapVisible = false;
    }

    private componentDidMount() {
        server.getP('/maps/blocks', {})
            .then(res => { this.addBlocksToMap(res.blocks) })
            .catch(showError.show);
            
        server.getP('/maps/oil_fields', {})
            .then(res => { this.addOilFieldsToMap(res.oilFields) })
            .catch(showError.show);

        server.getP('/maps/production_units', {})
            .then(res => { this.addProductionUnitsToMap(res.productionUnits) })
            .catch(showError.show);

        server.getP('/maps/drilling_rigs', {})
            .then(this.addDrillingRigsToMap.bind(this))
            .catch(showError.show);

        server.getP('/maps/wells', {})
            .then(this.addWellsToMap.bind(this))
            .catch(showError.show);

        this.gasPipeLayer = new KmlLayer(this.mapObj, 'http://app.insideroil.com/maps/Gasodutos.kml');
        this.gasPipeLayer.setVisibility(false);
    }

    private addBlocksToMap(blocks) {

        function blockBillboard(block):string {
            const url = '/app/view_record?source=Block&id=' + block.id;
            return '<b>Bloco: </b><a href="' + url + '">' + block.name + '</a>';
        }

        this.blockMPolygons.length = 0;
        blocks.map(block => {
            var polygons:IGeoPoint[][] = JSON.parse(block.polygons);
            if(!polygons) {
                return;
            }
            polygons.map((polygon) => {
                const title = 'Bloco: ' + block.name;
                
                let options:Polygon.IOptions = {
                    paths: polygon,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                };
                var mPolygon = new Polygon.Polygon(this.mapObj, title, options);
                mPolygon.setBillboardFn(showBillboard.bind(this, block, 'Block', blockBillboard));
                this.blockMPolygons.push(mPolygon);
            });
        });
    }

    private addOilFieldsToMap(oilFields) {

        function oilFieldBillboard(oilField):string {
            const url = '/app/view_record?source=OilField&id=' + oilField.id;
            return '<b>Campo: </b><a href="' + url + '">' + oilField.name + '</a>';
        }

        this.oilFieldMPolygons.length = 0;
        oilFields.map(oilField => {
            var polygons:IGeoPoint[][] = JSON.parse(oilField.polygons);
            if(!polygons) {
                return;
            }
            polygons.map((polygon) => {
                const title = 'Campo: ' + oilField.name;
                let options:Polygon.IOptions = {
                    paths: polygon,
                    strokeColor: '#FFFF00',
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    fillColor: '#FFFF00',
                    fillOpacity: 0.35,
                };
                var mPolygon = new Polygon.Polygon(this.mapObj, title, options);
                mPolygon.setBillboardFn(showBillboard.bind(this, oilField, 'OilField', oilFieldBillboard));
                this.oilFieldMPolygons.push(mPolygon);
            });
        });
    }

    private addProductionUnitsToMap(productionUnits) {

        function productionUnitBillboard(productionUnit):string {
            const url = '/app/view_record?source=ProductionUnit&id=' + productionUnit.id;
            return '<b>Unidade de produção: </b><a href="' + url + '">' + productionUnit.name + '</a>'
        }

        this.productionUnitMMarkers.length = 0;
        const platformImage = 'images/platform.png';
        productionUnits.map(productionUnit => {
            var coordinates:IGeoPoint = JSON.parse(productionUnit.coordinates);
            if(!coordinates) {
                return;
            }
            const title = 'Unidade de produção: ' + productionUnit.name;
            var mMarker = new Marker(this.mapObj, coordinates, platformImage, title);
            mMarker.setBillboardFn(showBillboard.bind(this, productionUnit, 'ProductionUnit', productionUnitBillboard));
            this.productionUnitMMarkers.push(mMarker);
        });
    }

    private addDrillingRigsToMap(res) {

        function getModel(drillingRig) {
            return drillingRig.type == 'offshore' ? 'DrillingRigOffshore' : 'DrillingRigOnshore';
        }

        function drillingRigBillboard(drillingRig):string {
            const url = '/app/view_record?source=' + getModel(drillingRig) + '&id=' + drillingRig.id;
            return '<b>Sonda: </b><a href="' + url + '">' + drillingRig.name + '</a>'
        }

        this.drillingRigMMarkers.length = 0;
        const platformImage = 'images/drilling_rig.png';
        res.drillingRigs.map(drillingRig => {
            var coordinates:IGeoPoint = JSON.parse(drillingRig.coordinates);
            if(!coordinates) {
                return;
            }
            const title = 'Sonda: ' + drillingRig.name;
            var mMarker = new Marker(this.mapObj, coordinates, platformImage, title);
            mMarker.setBillboardFn(showBillboard.bind(this, drillingRig, getModel(drillingRig), drillingRigBillboard));
            this.drillingRigMMarkers.push(mMarker);
        });
    }

    private addWellsToMap(res) {
        this.wellHeatMap = new HeatMap(this.mapObj, res.wells);
        this.wellHeatMap.setVisibility(false);
    }

    private changeMapsItemsVisibility(mObjects: BaseMapItem[], visibilityFieldName: string, event) {
        this[visibilityFieldName] = !this[visibilityFieldName];
        for(let mObject of mObjects) {
            mObject.setVisibility(this[visibilityFieldName]);
        }
    }

    private changeMapsItemVisibility(itemName, visibilityKeyName: string, event) {
        // it's getting by keyname because the member is not initialized when render is called
        const mapItem: BaseMapItem = this[itemName];
        this[visibilityKeyName] = !this[visibilityKeyName];
        mapItem.setVisibility(this[visibilityKeyName]);
    }

    public render(): React.ReactElement<any> {
        const style = {
            width: '100%',
            height: 700
        }
        return (
            <div>
                <h2><b>Mapas</b></h2>
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
                    onChange={this.changeMapsItemsVisibility.bind(this, this.drillingRigMMarkers, 'drillingRigVisible')}/> 
                    Exibir sondas<br/>
                <input type="checkbox" defaultChecked={false}
                    onChange={this.changeMapsItemVisibility.bind(this, 'gasPipeLayer', 'gasPipelinesVisible')}/> 
                    Exibir gasodutos<br/>
                <input type="checkbox" defaultChecked={false}
                    onChange={this.changeMapsItemVisibility.bind(this, 'wellHeatMap', 'wellHeatMapVisible')}/> 
                    Exibir mapa de calor de poços<br/>
            </div>
        );
    }
}