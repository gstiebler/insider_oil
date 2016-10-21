import * as React from 'react';
import * as Flash from '../Components/Flash'
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { getP } from '../lib/Server';
import * as ni from '../../../common/NetworkInterfaces';

function optionsInCombo(values: any[]): React.ReactElement<any>[] {
    if(!values)
        return [];
    return values.map((value, index) => {
        return <option value={value.id} key={'c' + index}>{value.label}</option>;
    });
}

interface IAppProps {
    modelName: string;
    value: string;
    onChange: (string) => void;
}

interface IAppState {
    value: string;
    comboValues: ni.ComboValues.IValue[];
}

export class DataCombo extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);
        this.state = {
            value: props.value,
            comboValues: []
        };
    }

    private componentDidMount() {
        const req:ni.ComboValues.req = { model: this.props.modelName };
        getP('/combo_values/', req)
            .then(this.onComboValues.bind(this))
            .catch(showError.show);
    }

    private componentWillReceiveProps(nextProps: IAppProps) {
        this.state.value = nextProps.value;
        this.setState(this.state);
    }

    private onComboValues(res:ni.ComboValues.res) {
        res.values.unshift({id: null, label: ''});
        this.state.comboValues = res.values;
        this.setState(this.state);
    }

    private onComboChange(evt) {
        this.state.value = evt.target.value;
        this.props.onChange(evt.target.value);
        this.setState(this.state);
    }

    public render(): React.ReactElement<any> {
        return ( 
            <select className="form-control" 
                    value={ this.state.value }
                    onChange={this.onComboChange.bind(this)}>
                { optionsInCombo(this.state.comboValues) }
            </select>
        );
    }
}