import * as React from 'react';
import * as Filter from '../Components/Filter'; 
import { ITableParams } from '../PaginatedTable/PaginatedTable';
import { IFilter } from '../../../common/Interfaces';

export interface IAppProps {
    tableParams: ITableParams;
    onChange: any;
}

interface IAppState {
    filterParams: Filter.FilterParams[];
}

export class FiltersGroup extends React.Component<IAppProps, IAppState> {

    private filters: { [s: string]: IFilter };

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            filterParams: []
        };
        this.filters = {};
    }

    private componentDidMount() {
        this.genFilterParams(this.props);
        this.setState(this.state);
    }

    private componentWillReceiveProps(nextProps:IAppProps) {
        this.genFilterParams(nextProps);
        this.setState(this.state);
    }

    private genFilterParams(props:IAppProps) {
        this.state.filterParams = [];
        for(let field of props.tableParams.fields) {
            if(!field.hasFilter) continue;
            let filter:Filter.FilterParams = {
                label: field.label,
                fieldName: field.fieldName,
                queryName: props.tableParams.source
            };
            if(!field.fieldName) {
                filter.fieldName = field.ref.valueField;
            }
            this.state.filterParams.push(filter);
        }
    }

    private getFiltersArray():IFilter[] {
        const result:IFilter[] = [];
        for(let fieldName in this.filters) {
            const filter = this.filters[fieldName];
            if(!filter) continue;
            result.push(filter);
        }
        return result;
    }

    private onFilterChange(fieldName: string, filter: IFilter) {
        this.filters[fieldName] = filter;
        const filterArray = this.getFiltersArray();
        this.props.onChange(filterArray);
    }

    public render(): React.ReactElement<any> {

        const filtersHTML = this.state.filterParams.map((f, i) => {
            return (
                <div className="col-md-2" key={'f' + i} >
                    <Filter.Filter
                        queryName={f.queryName}
                        fieldName={f.fieldName}
                        label={f.label}
                        onFilterChange={this.onFilterChange.bind(this, f.fieldName)}
                    />
                </div>
            );
        });

		return (
            <div className="row">
                { filtersHTML }
            </div>
		);
    }
}