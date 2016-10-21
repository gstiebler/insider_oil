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

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            data: []
        };
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
        this.setState(this.state);
    }

    public render(): React.ReactElement<any> {
        const data = this.state.data.map((v) => {
            return { value: v.value + ' (' + v.qtt + ')' };
        });

		return (
            <div>
                {this.props.label}:
                <Multiselect 
                    data={data}
                    multiple
                    includeSelectAllOption
                    onChange={ (e) => { console.log(e) } }
                    onSelectAll={ (e) => { console.log(e) } }
                    allSelectedText={"Tudo"}
                    selectAllText={"Selecionar todos"}
                    nonSelectedText={"Nenhum selecionado"}
                    style={{ marginLeft: 15, marginRight: 15 }}
                />
            </div>
		);
    }
}