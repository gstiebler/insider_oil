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
import { IFrontEndProject } from '../../../common/Interfaces';
import { find } from '../lib/ArrayUtils';

interface IAppProps {
    location: any;
}

interface IAppState extends ViewRecord.IAppState {
}

export class ProjectView extends ViewRecord.ViewRecord {

    constructor(props: IAppProps) {
        super(props);
        this.state.source = 'Project';
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
                <ObjectNews modelName={this.state.source} objId={this.state.id} ></ObjectNews>
            </div>
        );
    }
}