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
import * as ni from '../../../common/NetworkInterfaces';

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
                        <img src={this.getImgUrl()} style={{ width: 600 }} />
                    </div>
                </div>
                <br/>
                <ErrorReport objectLabel={this.state.objectLabel}
                             url={this.state.url} />
                <hr/>
                { this.getTableausHTML() }
                { this.getEmbedsHTML() }
                { this.getRefObjectsElements() }
                <ObjectNews modelName={this.state.source} objId={this.state.id} ></ObjectNews>
            </div>
        );
    }
}