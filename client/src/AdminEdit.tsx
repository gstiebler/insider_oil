import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import * as ModelOperations from './lib/ModelOperations';
import * as ModelViewService from './lib/ModelViewUtils';
import { browserHistory } from 'react-router';

interface IAppProps {
    location: any;
}

interface IAppState {
    id: number;
    modelName: string;
    values: any[];
    fields: any[];
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
        server.getModelFieldsAndValues(this.state.modelName, this.state.id, 
                this.valuesArrived.bind(this), showError.show);
    }

    private valuesArrived(data) {
        this.state.values = data.values;
        this.state.fields = data.fields;
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
        server.saveItem( this.state.modelName, itemData, this.onSave, showError.show );
    }
    
    private onSave(status) {
        //Flash.create('success', status.data.msg);
        browserHistory.push('/app/model_view?model=' + this.state.modelName);
    }

    public render(): JSX.Element {
        return (
            <div className="row">   
                <form className="form-horizontal" role="form">
                    <record-fields fields="fields" values="values" onError={ showError.show }></record-fields>
                    <div className="form-group" >
                        <div className="col-sm-offset-2 col-sm-10">
                            <button className="btn btn-default" onClick={ this.saveItem.bind(this) } >Salvar</button>
                        </div>
                    </div>
                </form>
            </div> 
        );
    }
}