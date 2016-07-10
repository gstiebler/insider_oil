import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ModelOperations from '../lib/ModelOperations';
import * as ModelViewService from '../lib/ModelViewUtils';
import { browserHistory } from 'react-router';
import { AdminRecordFields } from './AdminRecordFields';
import { IField } from '../../../common/Interfaces';
import * as Flash from '../Flash'

interface IAppProps {
    location: any;
}

interface IAppState {
    id: number;
    modelName: string;
    values: any[];
    fields: IField[];
}

export class AdminEdit extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = { 
            id: props.location.query.id,
            modelName: props.location.query.modelName,
            values: [],
            fields: []
        };
    }

    public componentDidMount() {
        server.getModelFieldsAndValues(this.state.modelName, this.state.id)
                .then(this.valuesArrived.bind(this))
                .catch(showError.show);
    }

    private valuesArrived(data) {
        this.state.values = data.values;
        this.state.fields = data.fields;
        this.setState(this.state);
    }
    
    private saveItem() {
        var itemData:any = {};
        for(var prop in this.state.values)  {
            var value = this.state.values[prop];
            if(value == undefined)
                value = null;
            itemData[prop] = value;
        }
        itemData.id = this.state.id;    
        server.saveItem( this.state.modelName, itemData, this.onSave.bind(this), showError.show );
    }
    
    private onSave(status) {
        Flash.create('success', status.msg);
        browserHistory.push('/app/model_view?model=' + this.state.modelName);
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="row">   
                <div className="form-horizontal">
                    <AdminRecordFields fields={ this.state.fields } values={ this.state.values } onChange={(v) => {this.state.values = v}} />
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