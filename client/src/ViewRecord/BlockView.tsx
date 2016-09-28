import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { Link, browserHistory } from 'react-router';
import { ViewRecordFields } from './ViewRecordFields';
import { ShowQueryData } from '../ShowQueryData';
import { ObjectNews } from '../ObjectNews';
import { ErrorReport } from '../ErrorReport';
import * as ViewRecord from './ViewRecord';
import { Map, IMapObj } from '../Maps/Map';
import { showBillboard, rioDeJaneiroCoords } from '../lib/MapUtils';
import { googleRef } from '../lib/Google';
import * as ni from '../../../common/NetworkInterfaces';
import { IGeoPoint } from '../../../common/Interfaces';
import { Polygon } from '../Maps/Polygon';
import { find } from '../lib/ArrayUtils';

interface IAppProps {
    location: any;
}

interface IAppState extends ViewRecord.IAppState {
    initialMapState: any;
}

export class BlockView extends ViewRecord.ViewRecord {

    public state: IAppState;
    private mapObj: IMapObj;
    private blockMPolygons: Polygon[];
    private title: string;

    constructor(props: IAppProps) {
        super(props);

        var { id } = props.location.query;
        var source = 'Block';
        this.blockMPolygons = [];
        this.state = {
            id: id,
            source: source,     
            recordData: [],
            allReferencedObjects: [],
            objectLabel: '',
            url: props.location.basename + props.location.pathname + props.location.search,
            initialMapState: {
                zoom: 9,
                center: rioDeJaneiroCoords,
                mapTypeId: googleRef.maps.MapTypeId.HYBRID
            }
        };
    }    
    
    public componentDidMount() {
        super.componentDidMount();
        server.getP('/maps/blocks', {})
            .then(res => { this.addBlocksToMap(res.blocks) })
            .catch(showError.show);
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
                let color = block.id == this.state.id ? '#FF2020' : '#FFFFA0';
                let mPolygon = new Polygon(this.mapObj, polygon, title, color);
                if(block.id == this.state.id) {
                    const polygonDims = mPolygon.getDimensions();
                    let gCenterPoint = new googleRef.maps.LatLng(polygonDims.center.lat, polygonDims.center.lng);
                    this.mapObj.gMap.panTo(gCenterPoint);
                }
                mPolygon.setBillboardFn(showBillboard.bind(this, block, 'Block', blockBillboard));
                this.blockMPolygons.push(mPolygon);
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
                <ObjectNews modelName={this.state.source} objId={this.state.id} ></ObjectNews>
            </div>
        );
    }
}