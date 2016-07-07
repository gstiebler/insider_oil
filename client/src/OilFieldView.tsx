import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import { Link, browserHistory } from 'react-router';
import { ViewRecordFields } from './ViewRecordFields';
import { ShowQueryData } from './ShowQueryData';
import { ObjectNews } from './ObjectNews';
import { TimeSeriesChart } from './TimeSeriesChart';

interface IAppProps {
    location: any;
}

interface IAppState {
    id: number;
    source: string;
    relatedPersons: any;
    relatedBids: any;
    relatedContracts: any;
    recordData: any;
    referencedObjects: any[];
    prodQueryParams: any;
    productionChartParams: any;
}

export class OilFieldView extends React.Component<IAppProps, IAppState> {

    public state: IAppState;

    constructor(props: IAppProps) {
        super(props);

        var { id } = props.location.query;
        var source = 'OilField';
        this.state = {
            id: id,
            source: source,
            relatedPersons: {
                queryName: 'PersonsByProject',
                title: 'Pessoas',
                filters: {
                    project_id: id,
                    dataSource: source
                },
            },
            relatedBids: {
                queryName: 'BidsByObject',
                title: 'Licitações',
                filters: {
                    obj_id: id,
                    dataSource: source
                }
            },
            relatedContracts: {
                queryName: 'contractsByObject',
                title: 'Contratos',
                filters: {
                    obj_id: id,
                    dataSource: source
                }
            },            
            recordData: {},
            referencedObjects: [],
            prodQueryParams: { oilField: id },
            productionChartParams: {
                yLabel: 'Produção (bbl/dia)',
                yAxis: 'oil_production',
                xAxis: 'date_prod'
            }
        };
    }

    protected componentDidMount() {
        var { id, source } = this.state;
        server.viewRecord( source, id, this.showValues.bind(this), showError.show );
    }

    private componentWillReceiveProps(nextProps) {
        var { id } = nextProps.location.query;
        this.state.id = id;
        server.viewRecord( this.state.source, id, this.showValues.bind(this), showError.show );
    } 
 
    // show record values
    private showValues(viewData) {
        this.state.recordData = viewData.record;
        this.state.referencedObjects = viewData.referencedObjects ? viewData.referencedObjects : [];
        this.setState(this.state);
    }
    
    public render(): React.ReactElement<any> {
        var referencedObjects = this.state.referencedObjects.map((referencedObject) => {
            return <div key={referencedObject.queryName}>
                <ShowQueryData model={referencedObject} objId={this.state.id}></ShowQueryData>
                <hr/>
            </div>
        });

        return (
            <div>
                <ViewRecordFields recordData={this.state.recordData} source={this.state.source} objId={this.state.id}></ViewRecordFields>
                <hr/>
                <ShowQueryData model={this.state.relatedPersons}></ShowQueryData>
                <ShowQueryData model={this.state.relatedBids}></ShowQueryData>
                <ShowQueryData model={this.state.relatedContracts}></ShowQueryData>
                <hr/>
                { referencedObjects }
                <TimeSeriesChart queryName="ProductionByField"
                                 qParams={this.state.prodQueryParams}
                                 chartParams={this.state.productionChartParams}/>
                <ObjectNews modelName={this.state.source} objId={this.state.id} ></ObjectNews>
            </div>
        );
    }
}