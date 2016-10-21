import * as React from 'react';
import * as showError from '../lib/ShowError';
import { IFilter } from '../../../common/Interfaces';

export interface FilterField {
    data: string;
    title: string;
    render: any;
}

export interface HeaderParams {
    filterFields: FilterField[];
    label: string;
}

interface IAppProps {
    headerParams: HeaderParams;
    filterChanged: (string) => void;
}

interface IAppState {
    delayTimer: any;
    searchText: string;
}

export class PaginatedTableHeader extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = { 
            delayTimer: {},
            searchText: '',
        };
    }
    
    private componentDidMount() {
        
    }
    
    private componentWillReceiveProps(nextProps:IAppProps) {
        
    }

    private filterChanged() {
        this.props.filterChanged(this.state.searchText);
    }

    private searchTextChanged(event) {
        this.state.searchText = event.target.value;
        this.setState(this.state);
        clearTimeout(this.state.delayTimer);
        this.state.delayTimer = setTimeout(this.filterChanged.bind(this), 400);
        event.persist();
    };

    public render(): React.ReactElement<any> {
        var filterComboOptions = this.props.headerParams.filterFields.map((filterField) => {
            return <option key={filterField.title} value={filterField.data} >{filterField.title}</option>;
        });

        return (
            <div className="table-options">
                <div className="col-md-4 col-sm-6">
                    <div className="table-options-name">
                        <h1>{this.props.headerParams.label}</h1>
                    </div>
                </div>
                <div className="col-md-8 col-sm-6">
                    <div className="table-options-pages">
                        Busca:
                        <input className="header-input" 
                               style={{ marginLeft: 15, marginRight: 15 }}
                               type="text" 
                               value={this.state.searchText} 
                               onChange={ this.searchTextChanged.bind(this) } >
                        </input>
                    </div>
                </div>
            </div>
        );
    }
}