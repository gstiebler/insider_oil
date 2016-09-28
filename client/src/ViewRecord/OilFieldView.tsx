import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { Link, browserHistory } from 'react-router';
import { ViewRecordFields } from './ViewRecordFields';
import { ShowQueryData } from '../ShowQueryData';
import { ObjectNews } from '../ObjectNews';
import { TimeSeriesChart, IChartParams } from '../Charts/TimeSeriesChart';
import { ErrorReport } from '../ErrorReport';
import * as ViewRecord from './ViewRecord';
import { Map, IMapObj, rioDeJaneiroCoords } from '../Maps/Map';
import { googleRef } from '../lib/Google';
import * as ni from '../../../common/NetworkInterfaces';
import { IGeoPoint } from '../../../common/Interfaces';
import { Polygon } from '../Maps/Polygon';
import { find } from '../lib/ArrayUtils';

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
    private polygonMapItem: Polygon;
    private polygonPoints: IGeoPoint[];
    private title: string;

    constructor(props: IAppProps) {
        super(props);

        var { id } = props.location.query;
        var source = 'OilField';
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
                zoom: 7,
                center: rioDeJaneiroCoords,
                mapTypeId: googleRef.maps.MapTypeId.HYBRID
            }
        };
    }

    public showValues(viewData:ni.GetViewRecord.res) {
        super.showValues(viewData);
        const polygonField = find(viewData.record, r => { return r.name == 'polygons'; });
        try {
            this.polygonPoints = JSON.parse(polygonField.value)[0];
        } catch(err) {
            console.log(err);
            this.polygonPoints = [];
        }
        if(this.polygonPoints.length < 3) return null;
        this.title = viewData.record[0].title;
        this.addOilFieldToMap();
        const polygonDims = this.polygonMapItem.getDimensions();
        let gCenterPoint = new googleRef.maps.LatLng(polygonDims.center.lat, polygonDims.center.lng);
        // using global variable:
        this.mapObj.gMap.panTo(gCenterPoint);
        return null;
    }

    private addOilFieldToMap() {
        this.polygonMapItem = new Polygon(this.mapObj, this.polygonPoints, this.title, '#FFFF00');
    }

    public render(): React.ReactElement<any> {
        const mapStyle = {
            width: '100%',
            height: '100%'
        }

        return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <ViewRecordFields  
                            recordData={this.state.recordData} 
                            source={this.state.source} 
                            objId={this.state.id}></ViewRecordFields>
                    </div>
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
                { this.getRefObjectsElements() }
                <TimeSeriesChart queryName="ProductionByField"
                                 qParams={this.state.prodQueryParams}
                                 chartParams={this.state.productionChartParams}/>
                <ObjectNews modelName={this.state.source} objId={this.state.id} ></ObjectNews>
            </div>
        );
    }
}