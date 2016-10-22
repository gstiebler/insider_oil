import * as React from 'react';
import { getP } from '../lib/Server';
import { FilterSource } from '../../../common/NetworkInterfaces';
import { FilterResult } from '../../../common/Interfaces';
import * as showError from '../lib/ShowError';

const Multiselect = require('react-bootstrap-multiselect');

export interface IAppProps {
    queryName: string;
    fieldName: string;
    label: string;
}

interface IAppState {
    data: FilterResult[];
}

export class Filter extends React.Component<IAppProps, IAppState> {

    private selectedObjs;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            data: []
        };

        this.selectedObjs = {};
    }

    private componentDidMount() {
        const req: FilterSource.req = {
            queryName: this.props.queryName,
            fieldName: this.props.fieldName
        }
        getP('/filter_source', req)
            .then(this.onFilterSourceData.bind(this))
            .catch(showError.show);
    }

    private onFilterSourceData(res: FilterSource.res) {
        this.state.data = res.values;
        for(let value of res.values) {
            this.selectedObjs[value.value] = true;
        }
        this.setState(this.state);
    }

    private onChange(option, checked) {
        const rawValueStr:string = $(option).val();
        const index = rawValueStr.lastIndexOf('(');
        const valueStr = rawValueStr.substring(0, index - 1);
        this.selectedObjs[valueStr] = checked;
        console.log(option, checked, valueStr );
    }

    private onSelectAll() {
        for(let key in this.selectedObjs) {
            this.selectedObjs[key] = true;
        }
    }

    private onDeselectAll() {
        for(let key in this.selectedObjs) {
            this.selectedObjs[key] = false;
        }
    }

    public render(): React.ReactElement<any> {
        const data = this.state.data.map((v) => {
            return { 
                value: v.value + ' (' + v.qtt + ')',
                selected: true 
            };
        });

		return (
            <div>
                {this.props.label}:<br/>
                <Multiselect
                    data={data}
                    multiple
                    includeSelectAllOption
                    onChange={this.onChange.bind(this)}
                    onSelectAll={ (e) => { console.log(e) } }
                    onDeselectAll={ (e) => { console.log(e) } }
                    allSelectedText={"Tudo"}
                    selectAllText={"Selecionar todos"}
                    nonSelectedText={"Nenhum selecionado"}
                    nSelectedText={"selecionados"}
                    numberDisplayed={1}
                />
            </div>
		);
    }
}