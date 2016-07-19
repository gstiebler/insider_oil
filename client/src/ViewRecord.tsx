import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import { Link, browserHistory } from 'react-router';
import { ViewRecordFields } from './ViewRecordFields';
import { ShowQueryData } from './ShowQueryData';
import { ObjectNews } from './ObjectNews';
import { ErrorReport } from './ErrorReport';

interface IAppProps {
    location: any;
}

interface IAppState {
    id: number;
    source: string;
    fixedRefObjects: {
        relatedPersons: any;
        relatedBids: any;
        relatedContracts: any;
    }
    recordData: any;
    referencedObjects: any[];
}

export class ViewRecord extends React.Component<IAppProps, IAppState> {

    public state: IAppState;

    constructor(props: IAppProps) {
        super(props);

        var { id, source } = props.location.query;
        this.state = {
            id: id,
            source: source,
            fixedRefObjects: this.getFixedRefObjects(source, id),        
            recordData: {},
            referencedObjects: [],
        };

        var customSources = {
            'OilField': "/app/oil_field",
            'GasPipeline': "/app/gas_pipeline",
            'ProductionUnit': "/app/production_unit",
        };

        var customSource = customSources[source];
        if(customSource) {
            browserHistory.replace(customSource + '?id=' + id)
        }
    }

    private getFixedRefObjects(source, id) {
        return {
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
        }
    }

    private componentDidMount() {
        var { id, source } = this.state;
        server.viewRecord( source, id, this.showValues.bind(this), showError.show );
    }

    private componentWillReceiveProps(nextProps: IAppProps) {
        var { id, source } = nextProps.location.query;
        this.state.id = id;
        this.state.source = source;
        this.state.fixedRefObjects = this.getFixedRefObjects(source, id);
        server.viewRecord( source, id, this.showValues.bind(this), showError.show );
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
            </div>
        });

        return (
            <div>
                <ErrorReport />
                <ViewRecordFields recordData={this.state.recordData} source={this.state.source} objId={this.state.id}></ViewRecordFields>
                <hr/>
                <ShowQueryData model={this.state.fixedRefObjects.relatedPersons}></ShowQueryData>
                <ShowQueryData model={this.state.fixedRefObjects.relatedBids}></ShowQueryData>
                <ShowQueryData model={this.state.fixedRefObjects.relatedContracts}></ShowQueryData>
                { referencedObjects }
                <ObjectNews modelName={this.state.source} objId={this.state.id} ></ObjectNews>
            </div>
        );
    }
}