import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { Link, browserHistory } from 'react-router';
import { ViewRecordFields } from './ViewRecordFields';
import { ShowQueryData } from '../ShowQueryData';
import { ObjectNews } from '../ObjectNews';
import { ErrorReport } from '../ErrorReport';
import * as ni from '../../../common/NetworkInterfaces';

interface IAppProps {
    location: any;
}

export interface IAppState {
    id: number;
    source: string;
    recordData: any[];
    allReferencedObjects: any[];
    objectLabel: string;
    url:string;
}

export class ViewRecord extends React.Component<IAppProps, IAppState> {

    public state: IAppState;

    private fixedRefObjects: {
        relatedPersons: any;
        relatedBids: any;
        relatedContracts: any;
    };

    constructor(props: IAppProps) {
        super(props);

        var { id, source } = props.location.query;
        this.state = {
            id: id,
            source: source,      
            recordData: [],
            allReferencedObjects: [],
            objectLabel: '',
            url: props.location.basename + props.location.pathname + props.location.search
        };

        var customSources = {
            'OilField': "/app/oil_field",
            'GasPipeline': "/app/gas_pipeline",
        };

        var customSource = customSources[source];
        if(customSource) {
            browserHistory.replace(customSource + '?id=' + id)
        }
    }

    public getFixedRefObjects(source, id) {
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

    public componentDidMount() {
        var { id, source } = this.state;
        server.viewRecord( source, id)
            .then(this.showValues.bind(this))
            .catch(showError.show);
    }

    public componentWillReceiveProps(nextProps: IAppProps) {
        var { id, source } = nextProps.location.query;
        this.state.id = id;
        this.state.source = source;
        server.viewRecord( source, id)
            .then(this.showValues.bind(this))
            .catch(showError.show);
    } 
 
    // show record values
    public showValues(viewData:ni.GetViewRecord.res) {
        this.state.recordData = viewData.record;
        this.state.objectLabel = viewData.record[0].value;
        const customReferencedObjs = viewData.referencedObjects ? viewData.referencedObjects : [];
        const fixedRefObjects = this.getFixedRefObjects(this.state.source, this.state.id);
        this.state.allReferencedObjects = [];
        Array.prototype.push.apply(this.state.allReferencedObjects, customReferencedObjs);
        Array.prototype.push.apply(this.state.allReferencedObjects, fixedRefObjects);
        this.setState(this.state);
        return null;
    }

    public getRefObjectsElements(): React.ReactElement<any>[] {
        var referencedObjects = this.state.allReferencedObjects.map((referencedObject) => {
            return <div key={referencedObject.queryName}>
                <ShowQueryData model={referencedObject} objId={this.state.id}></ShowQueryData>
            </div>
        });
        return referencedObjects;
    }
    
    public render(): React.ReactElement<any> {
        return (
            <div>
                <ErrorReport objectLabel={this.state.objectLabel}
                             url={this.state.url} />
                <ViewRecordFields recordData={this.state.recordData} source={this.state.source} objId={this.state.id}></ViewRecordFields>
                <hr/>
                { this.getRefObjectsElements() }
                <ObjectNews modelName={this.state.source} objId={this.state.id} ></ObjectNews>
            </div>
        );
    }
}