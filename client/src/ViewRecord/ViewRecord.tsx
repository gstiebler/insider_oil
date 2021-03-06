import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { browserHistory } from 'react-router';
import { ViewRecordFields } from './ViewRecordFields';
import { ShowQueryData } from '../Components/ShowQueryData';
import { ObjectNews } from '../Components/ObjectNews';
import { ErrorReport } from '../Components/ErrorReport';
import * as ni from '../../../common/NetworkInterfaces';
import { IRefObjectsOnView } from '../../../common/Interfaces';
import { Tableau } from '../Components/Tableau'; 
import * as moment from 'moment';

interface IAppProps {
    location: any;
}

export interface IAppState {
    id: number;
    source: string;
    recordData: any[];
    allReferencedObjects: IRefObjectsOnView[];
    objectLabel: string;
    url:string;
    extraRecordData: ni.IExtraRecordData;
    updatedAt: any;
}

export class ViewRecord extends React.Component<IAppProps, IAppState> {

    public state: IAppState;

    private fixedRefObjects: any[];

    constructor(props: IAppProps) {
        super(props);

        var { id, source } = props.location.query;
        this.state = {
            id: id,
            source: source,      
            recordData: [],
            allReferencedObjects: [],
            objectLabel: '',
            url: props.location.basename + props.location.pathname + props.location.search,
            extraRecordData: {
                tableauUrls: [],
                embedStrs: []
            },
            updatedAt: ''
        };

        var customSources = {
            'OilField': "/app/oil_field",
            'Block': "/app/block",
            'GasPipeline': "/app/gas_pipeline",
            'News': "/app/view_new",
            'Project': "/app/view_project",
        };

        var customSource = customSources[source];
        if(customSource) {
            browserHistory.replace(customSource + '?id=' + id)
        }
    }

    public getFixedRefObjects(source, id):IRefObjectsOnView[] {
        return [ 
            {
                queryName: 'PersonsByProject',
                title: 'Pessoas',
                filters: {
                    project_id: id,
                    dataSource: source
                },
            },
            {
                queryName: 'BidsByObject',
                title: 'Licitações',
                filters: {
                    obj_id: id,
                    dataSource: source
                }
            },
            {
                queryName: 'contractsByObject',
                title: 'Contratos',
                filters: {
                    obj_id: id,
                    dataSource: source
                }
            },  
            {
                queryName: 'objectRelatedProjects',
                title: 'Oportunidades',
                filters: {
                    id,
                    modelName: source
                }
            }, 
        ]
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
        this.state.updatedAt = viewData.updatedAt;
        this.state.objectLabel = viewData.record[0].value;
        this.state.extraRecordData = viewData.extraRecordData;
        const customReferencedObjs = viewData.referencedObjects ? viewData.referencedObjects : [];
        const fixedRefObjects = this.getFixedRefObjects(this.state.source, this.state.id);
        this.state.allReferencedObjects = [];
        Array.prototype.push.apply(this.state.allReferencedObjects, customReferencedObjs);
        Array.prototype.push.apply(this.state.allReferencedObjects, fixedRefObjects);
        this.setState(this.state);
        return null;
    }

    public getRefObjectsElements(objects:IRefObjectsOnView[]): React.ReactElement<any>[] {
        var referencedObjects = objects.map((referencedObject) => {
            return(
                <ShowQueryData key={referencedObject.queryName} 
                            model={referencedObject} 
                            objId={this.state.id}>
                </ShowQueryData>
            );
        });
        return referencedObjects;
    }

    protected getTableausHTML() {
        return this.state.extraRecordData.tableauUrls.map((turl, i) => {
            return (
                <div>
                    <Tableau vizUrl={turl}/>
                    <br/>
                </div>
            );
        });
    }

    protected getEmbedsHTML() {
        return this.state.extraRecordData.embedStrs.map((eurl, i) => {
            return (
                <div>
				    <p dangerouslySetInnerHTML={ {__html: eurl } } />
                    <br/>
                </div>
            );
        });
    }

    protected getImgUrl():string {
        return server.paths.baseImg + this.state.source + '/' + 
                            'img_' + this.state.id + '_original.jpg';
    }

    public getInfoBox(): React.ReactElement<any> {
        return (
            <div className="col-md-6">
                <ViewRecordFields  
                    recordData={this.state.recordData} 
                    source={this.state.source} 
                    objId={this.state.id}></ViewRecordFields>
                Atualizado em { moment(this.state.updatedAt).format("DD/MM/YYYY") }
            </div>
        );
    }
    
    public render(): React.ReactElement<any> {
        return (
            <div>
                <div className="row">
                    { this.getInfoBox() }
                    <div className="col-md-6 main-boxes">
                        <img src={this.getImgUrl()} style={{ width: 600 }} />
                    </div>
                </div>
                <br/>
                <ErrorReport objectLabel={this.state.objectLabel}
                             url={this.state.url} />
                <hr/>
                { this.getTableausHTML() }
                { this.getEmbedsHTML() }
                { this.getRefObjectsElements(this.state.allReferencedObjects) }
                <ObjectNews modelName={this.state.source} objId={this.state.id} ></ObjectNews>
            </div>
        );
    }
}