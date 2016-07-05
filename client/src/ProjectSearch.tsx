import * as React from 'react';
import * as showError from './lib/ShowError';
import * as server from './lib/Server';
//import Autosuggest from 'react-autosuggest';

interface IAppProps {
    value: any[];
    onItemSelected: any;
}

interface IAppState {
    searchOptions: any[];
}

export class ProjectSearch extends React.Component<IAppProps, IAppState> {

    private searchResult: any;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            searchOptions: []
        };
    }

    private onSearchType(value) {
        server.getSearchResult(value, this.onSearchResult.bind(this), showError.show);
    }
    
    private onSearchResult(results) {
        this.state.searchOptions = [];
        this.searchResult = {};
        for(var i = 0; i < results.length; i++) {
            var completeSearchKey = results[i].modelLabel + ': ' +results[i].name;
            this.state.searchOptions.push(completeSearchKey);
            this.searchResult[completeSearchKey] = results[i];
        }
        this.setState(this.state);
    }

    private onSelectItemOnSearchBox(value) {
        this.props.onItemSelected(this.searchResult[value]);
    }
    
    public render(): React.ReactElement<any> {
        return (
            <button />
        );
    }
}