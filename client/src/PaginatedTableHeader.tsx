import * as React from 'react';
import * as showError from './lib/ShowError';

interface IAppProps {
    headerParams: any;
    filterChanged: any;
}

interface IAppState {
    delayTimer: any;
    searchText: string;
    selectedField: any;
}

export class PaginatedTableHeader extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = { 
            delayTimer: {},
            searchText: '',
            selectedField: {}
        };
    }

    private filterChanged() {
        var filterOpts = [
            {
                field: this.state.selectedField,
                like: this.state.searchText
            }
        ]
        if(this.state.searchText == '')
            filterOpts = [];
          
        this.props.filterChanged(filterOpts);
    }

    private searchTextChanged(value) {
        this.state.searchText = value;
        clearTimeout(this.state.delayTimer);
        this.state.delayTimer = setTimeout(this.filterChanged.bind(this), 400);
    };

    private selectedFieldChanged(selectedField) {
        this.state.searchText = '';
        this.state.selectedField = selectedField;
        this.filterChanged();
    }

    public render(): JSX.Element {
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
                        Filtrar por:
                        <select onchange={this.selectedFieldChanged}>
                            { filterComboOptions }
                        </select>
                        <input className="header-input" type="text" oninput={ this.searchTextChanged } ></input>
                    </div>
                </div>
            </div>
        );
    }
}