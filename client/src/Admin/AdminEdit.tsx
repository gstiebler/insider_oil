import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ModelOperations from '../lib/ModelOperations';
import * as ModelViewService from '../lib/ModelViewUtils';
import { browserHistory } from 'react-router';
import { AdminRecordFields } from './AdminRecordFields';
import { IField } from '../../../common/Interfaces';
import * as Flash from '../Components/Flash'
import * as ni from '../../../common/NetworkInterfaces';

function arrayToLines(array:string[]):string {
    return array.join('\n');
}

interface IAppProps {
    location: any;
}

export interface IAppState {
    id: number;
    modelName: string;
    recordValues: ni.RecordValues.res;
}

export class AdminEdit extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = { 
            id: props.location.query.id,
            modelName: props.location.query.modelName,
            recordValues: {
                values: {},
                fields: [],
                extraRecordData: {
                    tableauUrls: [],
                    embedStrs: []
                }
            },
        };
    }

    public componentDidMount() {
        if(this.state.id) {
            const req:ni.RecordValues.req = {
                model: this.state.modelName,
                id: this.state.id
            };
            server.getP('/record_values/', req)
                    .then(this.valuesArrived.bind(this))
                    .catch(showError.show);
        } else {
            server.getModelFields(this.state.modelName)
                    .then(this.fieldsArrived.bind(this))
                    .catch(showError.show);
        }
    }

    protected valuesArrived(data:ni.RecordValues.res) {
        this.state.recordValues = data;
        this.setState(this.state);
        return null;
    }

    private fieldsArrived(data) {
        this.state.recordValues.fields = data.fields;
        this.setState(this.state);
        return null;
    }
    
    private saveItem() {
        let itemData:any = {};
        for(let prop in this.state.recordValues.values)  {
            let value = this.state.recordValues.values[prop];
            if(value == undefined)
                value = null;
            itemData[prop] = value;
        }

        if(this.state.id) {
            itemData.id = this.state.id;   

            const params:ni.SaveItem.req = {
                model: this.state.modelName,
                record: itemData,
                extraRecordData: this.state.recordValues.extraRecordData
            };

            server.putP('/save_item/', {data: JSON.stringify(params)})
                .then(this.onSave.bind(this))
                .catch(showError.show);
        } else {
            const params:ni.CreateItem.req = {
                model: this.state.modelName,
                newItemData: itemData,
                extraRecordData: this.state.recordValues.extraRecordData
            };

            server.postP('/create_item/', { data: JSON.stringify(params) })
                .then(this.onSave.bind(this))
                .catch(showError.show);
        }
    }
    
    private onSave(status:ni.SaveItem.res) {
        Flash.create('success', status.msg);
        browserHistory.push('/app/model_view?model=' + this.state.modelName);
    }

    private onExtraRecordDataChange(erdFieldName, event) {
        this.state.recordValues.extraRecordData[erdFieldName] =
                event.target.value.split('\n');
        this.setState(this.state);
    }

    protected getSpecialFields(): React.ReactElement<any> {
        return null;
    }

    public render(): React.ReactElement<any> {
        const tableauHTMLcontent = arrayToLines(this.state.recordValues.extraRecordData.tableauUrls);
        const tableauHTML = (
            <div className="form-group">
                <label className="control-label col-sm-2">URLs Tableau:</label>
                <div className="col-sm-10">
                    <textarea type="text" className="form-control" 
                            value={tableauHTMLcontent}
                             onChange={this.onExtraRecordDataChange.bind(this, 'tableauUrls')}/>
                </div>
            </div>
        );

        const embedHTMLcontent = arrayToLines(this.state.recordValues.extraRecordData.embedStrs);
        const embedHTML = (
            <div className="form-group">
                <label className="control-label col-sm-2">Embeds:</label>
                <div className="col-sm-10">
                    <textarea type="text" className="form-control" 
                            value={embedHTMLcontent}
                            onChange={this.onExtraRecordDataChange.bind(this, 'embedStrs')}/>
                </div>
            </div>
        );

        return (
            <div className="row">   
                <div className="form-horizontal">
                    <AdminRecordFields fields={ this.state.recordValues.fields } 
                           values={ this.state.recordValues.values } 
                           onChange={(v) => {this.state.recordValues.values = v}} />
                    { tableauHTML }
                    { embedHTML }
                    { this.getSpecialFields() }
                    <div className="form-group" >
                        <div className="col-sm-offset-2 col-sm-10">
                            <button className="btn btn-default" onClick={ this.saveItem.bind(this) } >Salvar</button>
                        </div>
                    </div>
                </div>
            </div> 
        );
    }
}