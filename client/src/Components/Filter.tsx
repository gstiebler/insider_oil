import * as React from 'react';
import { getP } from '../lib/Server';
import { FilterSource } from '../../../common/NetworkInterfaces';
import { FilterResult, IFilter } from '../../../common/Interfaces';
import * as showError from '../lib/ShowError';

const Multiselect = require('react-bootstrap-multiselect');

export interface FilterParams {
    queryName: string;
    fieldName: string;
    label: string;
}

export interface IAppProps extends FilterParams {
    onFilterChange: (IFilter) => void;
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

    private genFilter():IFilter {
        const selectedValues:string[] = [];
        const deselectedValues:string[] = [];
        for(let key in this.selectedObjs) {
            if(this.selectedObjs[key]) {
                selectedValues.push(key);
            } else {
                deselectedValues.push(key);
            }
        }
        if(selectedValues.length < deselectedValues.length) {
            return {
                field: this.props.fieldName,
                in: selectedValues
            }
        } else {
            return {
                field: this.props.fieldName,
                notIn: deselectedValues
            }
        }
    }

    private onChange(option, checked) {
        const rawValueStr:string = $(option).val();
        const index = rawValueStr.lastIndexOf('(');
        const valueStr = rawValueStr.substring(0, index - 1);
        this.selectedObjs[valueStr] = checked;
        this.props.onFilterChange(this.genFilter());
    }

    private onSelectAll() {
        for(let key in this.selectedObjs) {
            this.selectedObjs[key] = true;
        }
        this.props.onFilterChange(null);
    }

    private onDeselectAll() {
        for(let key in this.selectedObjs) {
            this.selectedObjs[key] = false;
        }
        this.props.onFilterChange({
            field: this.props.fieldName,
            equal: '***'
        });
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
                    onSelectAll={ this.onSelectAll.bind(this) }
                    onDeselectAll={ this.onDeselectAll.bind(this) }
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