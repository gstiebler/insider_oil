import * as React from 'react';
import * as showError from '../lib/ShowError';

interface IAppProps {
    value: any[];
    onChange: any;
}

interface IAppState {
    items: any[];
}

export class ListOfInputs extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            items: props.value ? props.value : []
        };
    }

    private addItem() {
        this.state.items.push('');
        this.setState(this.state);
        this.props.onChange(this.state.items);
    }

    private removeItem(index) {
        this.state.items.splice(index, 1);
        this.setState(this.state);
        this.props.onChange(this.state.items);
    }

    private updateItem(index, event) {
        this.state.items[index] = event.target.value;
        this.setState(this.state);
        this.props.onChange(this.state.items);
    }
    
    public render(): React.ReactElement<any> {
        var items = this.state.items.map((item, index) => {
            return (
                <tr key={'item' + index}>
                    <td><input type="text" value={item} onChange={this.updateItem.bind(this, index)}/><br/></td>
                    <td><button className="btn btn-default" onClick={this.removeItem.bind(this, index)}>Remover</button></td>
                </tr>
            );  
        });

        return (
            <table className="table">
                <tbody>
                    <tr>
                        <td width="300">
                            <table className="table">
                                <tbody> {items} </tbody>
                            </table>
                        </td>
                        <td>
                            <button onClick={this.addItem.bind(this)}>Adicionar</button><br/>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}