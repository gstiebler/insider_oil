import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { Link, browserHistory } from 'react-router';
import { ViewRecordFields } from './ViewRecordFields';
import { ShowQueryData } from '../Components/ShowQueryData';
import { ObjectNews } from '../Components/ObjectNews';
import { TimeSeriesChart, IChartParams } from '../Charts/TimeSeriesChart';
import { ErrorReport } from '../Components/ErrorReport';
import * as ViewRecord from './ViewRecord';
import { Map, IMapObj } from '../Maps/Map';
import { showBillboard, rioDeJaneiroCoords } from '../lib/MapUtils';
import { googleRef } from '../lib/Google';
import * as ni from '../../../common/NetworkInterfaces';
import { IGeoPoint } from '../../../common/Interfaces';
import * as Polygon from '../Maps/Polygon';
import { find } from '../lib/ArrayUtils';
import { Tableau } from '../Components/Tableau'; 

interface IAppProps {
    location: any;
}

interface IAppState extends ViewRecord.IAppState {
    prodQueryParams: any;
    productionChartParams: IChartParams;
    initialMapState: any;
}

export class OilFieldView extends ViewRecord.ViewRecord {

    public state: IAppState;
    private mapObj: IMapObj;
    private oilFieldMPolygons: Polygon.Polygon[];
    private title: string;

    constructor(props: IAppProps) {
        super(props);

        var { id } = props.location.query;
        var source = 'OilField';
        this.oilFieldMPolygons = [];
        this.state = {
            id: id,
            source: source,     
            recordData: [],
            allReferencedObjects: [],
            objectLabel: '',
            url: props.location.basename + props.location.pathname + props.location.search,
            prodQueryParams: { oilField: id },
            productionChartParams: {
                yLabel: 'Produção (bbl/dia)',
                seriesList: [
                   {
                       fieldName: 'oil_production',
                       label: 'Óleo'
                   },
                   {
                       fieldName: 'water_production',
                       label: 'Água'
                   },
                   /*{
                       fieldName: 'gas_associated_production',
                       label: 'Gás'
                   },*/
                ],
                xAxis: 'date_prod'
            },
            initialMapState: {
                zoom: 8,
                center: rioDeJaneiroCoords,
                mapTypeId: googleRef.maps.MapTypeId.HYBRID
            },
            extraRecordData: {
                tableauUrls: [],
                embedStrs: []
            },
            updatedAt: ''
        };
    }    
    
    public componentDidMount() {
        super.componentDidMount();
        server.getP('/maps/oil_fields', {})
            .then(res => { this.addOilFieldsToMap(res.oilFields) })
            .catch(showError.show);
    }

    private addOilFieldsToMap(oilFields:any[]) {

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
                    strokeOpacity: 0.3,
                    strokeWeight: 2,
                    fillColor: '#FFFF00',
                    fillOpacity: 0.1,
                };
                if(oilField.id == this.state.id) {                    
                    options = {
                        paths: polygon,
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 3,
                        fillColor: '#FF0000',
                        fillOpacity: 0.45,
                    };
                }
                let mPolygon = new Polygon.Polygon(this.mapObj, title, options);
                if(oilField.id == this.state.id) {
                    const polygonDims = mPolygon.getDimensions();
                    let gCenterPoint = new googleRef.maps.LatLng(polygonDims.center.lat, polygonDims.center.lng);
                    this.mapObj.gMap.panTo(gCenterPoint);
                }
                mPolygon.setBillboardFn(showBillboard.bind(this, oilField, 'OilField', oilFieldBillboard));
                this.oilFieldMPolygons.push(mPolygon);
            });
        });
    }

    public render(): React.ReactElement<any> {
        const mapStyle = {
            width: '100%',
            height: '100%'
        }

        return (
            <div>
                <div className="row">
                    { this.getInfoBox() }
                    <div className="col-md-6 main-boxes">                
                        <Map initialState={this.state.initialMapState}
                                receiveMapObj={(mo) => this.mapObj = mo}
                                style={mapStyle} />
                    </div>
                </div>
                <br/>
                <ErrorReport objectLabel={this.state.objectLabel}
                             url={this.state.url} />
                <hr/>
                { this.getTableausHTML() }
                { this.getEmbedsHTML() }
                { this.getRefObjectsElements(this.state.allReferencedObjects) }
                <TimeSeriesChart queryName="ProductionByField"
                                 qParams={this.state.prodQueryParams}
                                 chartParams={this.state.productionChartParams}/>
                <ObjectNews modelName={this.state.source} objId={this.state.id} ></ObjectNews>
            </div>
        );
    }
}