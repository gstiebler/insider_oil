import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ModelOperations from '../lib/ModelOperations';
import * as ModelViewService from '../lib/ModelViewUtils';
import { browserHistory } from 'react-router';
import { editLineHTML } from './AdminRecordFields';
import { IField, IProjectJsonField } from '../../../common/Interfaces';
import * as Flash from '../Flash'
import * as ni from '../../../common/NetworkInterfaces';
import * as AdminEdit from './AdminEdit';
import { ManyToMany } from './ManyToMany';
import { DataCombo } from './DataCombo'; 

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

    private contractorInterface(index: number):React.ReactElement<any> {
        const contractor_id = this.state.recordValues.values.json_field.contractors[index].contractor_id;
        const contractedHTML = (
            <DataCombo
                value={ contractor_id }
                modelName="Company"
                onChange={ this.onContractorFieldChanged.bind(this, index, 'contractor_id') } />
        );

        const scope = this.state.recordValues.values.json_field.contractors[index].scope;
        const scopeHTML = (
            <input type="text" className="form-control" 
                value={ scope } 
                onChange={this.onContractorFieldChanged.bind(this, index, 'scope')}/>
        );

        const persons_id = this.state.recordValues.values.json_field.contractors[index].persons_id;
        const personsHTML = (
            <ManyToMany comboSource='Person'
                value={this.idsToObj(persons_id)}
                onChange={this.onContractorPersonsChanged.bind(this, index)}/>
        );

        return (
            <div key={'contracted' + index}>
                <hr/>
                <h3>Contratada {index + 1}</h3>
                <br/>
                { editLineHTML(contractedHTML, 'Contratada', 'c' + index) }
                { editLineHTML(scopeHTML, 'Escopo', 'e' + index) }
                { editLineHTML(personsHTML, 'Pessoas', 'p' + index) }
                <button
                    onClick={ this.onRemoveContractedButtonClick.bind(this, index) }
                    >Remover</button>
                <hr/>
            </div>
        );
    }

    private onRemoveContractedButtonClick(index) {
        this.state.recordValues.values.json_field.contractors.splice(index, 1);
        this.setState(this.state);
    }

    private onContractorFieldChanged(index:number, fieldName:string, evt) {
        var value = evt;
        if(evt.target)
            value = evt.target.value;
        this.state.recordValues.values.json_field.contractors[index][fieldName] = value;
        this.setState(this.state);
    }

    private onContractorPersonsChanged(index, persons_ids:any[]) {
        const ids = persons_ids.map(obj => { return obj.id });
        this.state.recordValues.values.json_field.contractors[index].persons_id = ids;
        this.setState(this.state);
    }

    private onPersonOwnerChange(persons_ids:any[]) {
        const ids = persons_ids.map(obj => { return obj.id });
        this.state.recordValues.values.json_field.owner_persons_id = ids;
        this.setState(this.state);
    }

    private idsToObj(ids: string[]):{id}[] {
        return ids.map(id => { return { id }; });
    }

    private addContracted() {
        const emptyContracted = {
            contractor_id: "",
            persons_id: [],
            scope: ""
        };
        this.state.recordValues.values.json_field.contractors.push(emptyContracted);
        this.setState(this.state);
    }

    protected getSpecialFields(): React.ReactElement<any> {
        const jsonField:IProjectJsonField = this.state.recordValues.values.json_field;
        if(!jsonField || !jsonField.owner_persons_id) return null;
        
        const manyToManyHTML =(
            <ManyToMany comboSource='Person'
                value={this.idsToObj(this.state.recordValues.values.json_field.owner_persons_id)}
                onChange={this.onPersonOwnerChange.bind(this)}/>
        );

        const contractorsHTML:React.ReactElement<any>[] = [];
        for(let i = 0; i < jsonField.contractors.length; i++) {
            contractorsHTML.push(this.contractorInterface(i));
        }

        return (
            <div>
                { editLineHTML(manyToManyHTML, 'Pessoas da contratante', 'pc') }
                { contractorsHTML }
                <button
                    onClick={ this.addContracted.bind(this) }
                    >Adicionar contratada</button>
            </div>
        );
    }

}