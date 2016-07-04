import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import { Link, browserHistory } from 'react-router';
import { ViewRecordFields } from './ViewRecordFields';

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
}

export class ViewRecord extends React.Component<IAppProps, IAppState> {

    public state: IAppState;

    constructor(props: IAppProps) {
        super(props);

        var { id, source } = props.location.query;
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
        };

        var customSources = {
            'OilField': "/app/oil_field",
            'GasPipeline': "/app/gas_pipeline",
            'ProductionUnit': "/app/production_unit",
        };

        var customSource = customSources[source];
        if(customSource) {
            browserHistory.push(customSource + '?id=' + id)
        }

        server.viewRecord( source, id, this.showValues, showError.show );
    }
 
    // show record values
    private showValues(viewData) {
        this.state.recordData = viewData.record;
        this.state.referencedObjects = viewData.referencedObjects;
    }
    
    public render(): React.ReactElement<any> {
        var referencedObjects = this.state.referencedObjects.map((referencedObject) => {
            return <div>
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
                <ObjectNews modelName={this.state.source} objId={this.state.id} ></ObjectNews>
            </div>
        );
    }
}