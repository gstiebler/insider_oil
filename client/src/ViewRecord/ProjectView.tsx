import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { Link, browserHistory } from 'react-router';
import * as ViewRecordFields from './ViewRecordFields';
import { ShowQueryData } from '../ShowQueryData';
import { ObjectNews } from '../ObjectNews';
import { ErrorReport } from '../ErrorReport';
import * as ViewRecord from './ViewRecord';
import * as ni from '../../../common/NetworkInterfaces';
import { IFrontEndProject,
         IProjectJsonField, 
         IRefObjectsOnView 
} from '../../../common/Interfaces';
import { find } from '../lib/ArrayUtils';

interface IAppProps {
    location: any;
}

interface IAppState extends ViewRecord.IAppState {
    companies: any[];
}

export class ProjectView extends ViewRecord.ViewRecord {

    public state: IAppState;

    constructor(props: IAppProps) {
        super(props);
        this.state.source = 'Project';
        this.state.companies = [];
    }

    public componentDidMount() {
        super.componentDidMount();   

        const req:ni.ComboValues.req = { model: 'Company' };
        server.getP('/combo_values', req)
            .then(this.onCompanies.bind(this))
            .catch(showError.show);
    }

    private onCompanies(res:ni.ComboValues.res) {
        this.state.companies = res.values;
        this.setState(this.state);
    }

    public render(): React.ReactElement<any> {
        const objsField = find(this.state.recordData, r => { return r.name == 'objects' });
        let objFieldsHTML = null;
        if(objsField) {
            const objValues:IFrontEndProject[] = objsField.value;
            objFieldsHTML = objValues.map(o => {
                const platHTML = ViewRecordFields.objLinkHTML(o.model, o.id.toString(), o.name);
                return ViewRecordFields.completeHTML(o.description, platHTML);
            });
        }
        let contracteds: React.ReactElement<any>[] = [];
        const jsonField = find(this.state.recordData, r => { return r.name == 'json_field' });
        if(jsonField) {
            const jsonValues:IProjectJsonField = JSON.parse(jsonField.value);
            for(let i = 0; i < jsonValues.contractors.length; i++) {
                const queries:IRefObjectsOnView[] = [
                    {
                        queryName: 'contractsOfContractedInProject',
                        title: 'Contratos da contratada no projeto',
                        filters: {
                            index: i,
                            id: this.state.id
                        },
                    },
                    {
                        queryName: 'personsOfContractedInProject',
                        title: 'Pessoas da contratada',
                        filters: {
                            index: i,
                            id: this.state.id
                        },
                    },
                ];
                const contractor_id = jsonValues.contractors[i].contractor_id;
                const contractorName = this.state.companies[contractor_id].label; 
                const contractedHTML = (
                    <div key={ 'index' + i } >
                        <h3>{ contractorName + ' - ' + jsonValues.contractors[i].scope }</h3>
                        { this.getRefObjectsElements(queries) }
                    </div>
                );
                contracteds.push(contractedHTML);
            }
        }

        return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <ViewRecordFields.ViewRecordFields  
                            recordData={this.state.recordData} 
                            source={this.state.source} 
                            additionalFields={objFieldsHTML}
                            objId={this.state.id}></ViewRecordFields.ViewRecordFields>
                    </div>
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
                { contracteds }
                <ObjectNews modelName={this.state.source} objId={this.state.id} ></ObjectNews>
            </div>
        );
    }
}