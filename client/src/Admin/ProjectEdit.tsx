import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ModelOperations from '../lib/ModelOperations';
import * as ModelViewService from '../lib/ModelViewUtils';
import { browserHistory } from 'react-router';
import { AdminRecordFields } from './AdminRecordFields';
import { IField, IProjectJsonField } from '../../../common/Interfaces';
import * as Flash from '../Flash'
import * as ni from '../../../common/NetworkInterfaces';
import * as AdminEdit from './AdminEdit';
import { ManyToMany } from './ManyToMany';

interface IAppProps {
    location: any;
}

interface IAppState extends AdminEdit.IAppState {
}

export class ProjectEdit extends AdminEdit.AdminEdit {

    constructor(props: IAppProps) {
        super(props);

        this.state.modelName = 'Project';
    }
    
    protected valuesArrived(data:ni.RecordValues.res) {
        super.valuesArrived(data);

        if(!this.state.recordValues.values.json_field) return null;
        this.state.recordValues.values.json_field = 
                JSON.parse(this.state.recordValues.values.json_field);
        this.setState(this.state);
        return null;
    }

    private onJsonFieldChange(e, fieldName: string) {
        this.state.recordValues.values.json_field[fieldName] = e.target.value;
        this.setState(this.state);
    }

    protected getSpecialFields(): React.ReactElement<any> {
        const jsonField:IProjectJsonField = this.state.recordValues.values.json_field;
        if(!jsonField || !jsonField.owner_persons_id) return null;
        
        return <ManyToMany comboSource='Person'
                            value={this.state.recordValues.values.json_field.owner_persons_id}
                            onChange={this.onJsonFieldChange.bind(this, 'owner_persons_id')}/>
    }

}