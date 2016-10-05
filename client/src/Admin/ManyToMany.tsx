import * as React from 'react';
import * as showError from '../lib/ShowError';
import * as server from '../lib/Server';

interface IAppProps {
    comboSource: string;
    value: any[];
    onChange: any;
}

interface IAppState {
    comboValues: any[];
    modelValues: {
        id: number,
        name: string
    }[];
    comboValuesMap: any;
}

export class ManyToMany extends React.Component<IAppProps, IAppState> {

    private selectedId: number;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            comboValues: [],
            modelValues: props.value ? props.value : [],
            comboValuesMap: {}
        };
    }

    private componentDidMount() {
        server.getComboValues(this.props.comboSource, this.onComboValues.bind(this), showError.show);
    }

    private onComboValues(values) {
        this.state.comboValues = values;

        this.state.comboValuesMap = {};
        for(var i = 0; i < values.length; i++) {
            this.state.comboValuesMap[values[i].id] = values[i].label;
        }
        this.selectedId = values[0].id;
        this.setState(this.state);
    }

    private remove(index) {
        this.state.modelValues.splice(index, 1);
        this.setState(this.state);
        this.props.onChange(this.state.modelValues);
    }
    
    private add() {
        var selectedId = this.selectedId;
        var newItem = {
            id: selectedId,
            name: this.state.comboValuesMap[selectedId]
        };
        this.state.modelValues.push(newItem);
        this.setState(this.state);
        this.props.onChange(this.state.modelValues);
    }
    
    public render(): React.ReactElement<any> {
        var items = this.state.modelValues.map((modelValue, index) => {
            const label = this.state.comboValuesMap[modelValue.id];
            return (
                <tr key={'item' + index}>
                    <td>{label}</td>
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
                            <select onChange={(e:any) => {this.selectedId = e.target.value}}>
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