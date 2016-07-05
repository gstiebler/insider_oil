import * as React from 'react';
import * as showError from '../lib/ShowError';
import * as server from '../lib/Server';

interface IAppProps {
    comboSource: any;
}

interface IAppState {
    comboValues: any[];
    modelValues: any[];
}

export class ManyToMany extends React.Component<IAppProps, IAppState> {

    private selectedId: number;
    private comboValuesMap: any;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            comboValues: [],
            modelValues: []
        };
    }

    private componentDidMount() {
        server.getComboValues(this.props.comboSource, this.onComboValues.bind(this), showError.show);
    }

    private onComboValues(values) {
        this.state.comboValues = values;
        this.setState(this.state);

        this.comboValuesMap = {};
        for(var i = 0; i < values.length; i++) {
            this.comboValuesMap[values[i].id] = values[i].label;
        }
    }

    private remove(index) {
        this.state.modelValues.splice(index, 1);
        this.setState(this.state);
    }
    
    private add() {
        var selectedId = this.selectedId;
        var newItem = {
            id: selectedId,
            name: this.comboValuesMap[selectedId]
        };
        this.state.modelValues.push(newItem);
        this.setState(this.state);
    }
    
    public render(): React.ReactElement<any> {
        var items = this.state.modelValues.map((modelValue, index) => {
            return (
                <tr key={'item' + index}>
                    <td>{modelValue.name}</td>
                    <td><button className="btn btn-default" onClick={this.remove.bind(this, index)}>Remover</button></td>
                </tr>
            );
        });

        var comboItems = this.state.comboValues.map((comboValue, index) => {
            return <option value={comboValue.id} key={'ci' + index}> {comboValue.label} </option>
        });

        return (
            <table className="table" style={{ width: "100%"}}>
                <tbody>
                    <tr>
                        <td width="300">
                            <table className="table table-bordered">
                                <tbody>
                                    {items}
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <button className="btn btn-default" onClick={this.add.bind(this)}>Adicionar</button><br/>
                            <select onClick={(e, value) => {this.selectedId = value}}>
                                {comboItems}
                            </select>  
                        </td>
                        <td>
                            
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}