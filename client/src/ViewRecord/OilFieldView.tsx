import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { Link, browserHistory } from 'react-router';
import { ViewRecordFields } from './ViewRecordFields';
import { ShowQueryData } from '../ShowQueryData';
import { ObjectNews } from '../ObjectNews';
import { TimeSeriesChart } from '../TimeSeriesChart';
import { ErrorReport } from '../ErrorReport';
import * as ViewRecord from './ViewRecord';

interface IAppProps {
    location: any;
}

interface IAppState extends ViewRecord.IAppState {
    prodQueryParams: any;
    productionChartParams: any;
}

export class OilFieldView extends ViewRecord.ViewRecord {

    public state: IAppState;

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
                yAxis: 'oil_production',
                xAxis: 'date_prod'
            }
        };
    }
    
    public render(): React.ReactElement<any> {
        return (
            <div>
                <ErrorReport objectLabel={this.state.objectLabel}
                             url={this.state.url} />
                <ViewRecordFields recordData={this.state.recordData} source={this.state.source} objId={this.state.id}></ViewRecordFields>
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