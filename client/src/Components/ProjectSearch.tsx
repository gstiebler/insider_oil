import * as React from 'react';
import * as showError from '../lib/ShowError';
import * as server from '../lib/Server';
import { IFrontEndProject } from '../../../common/Interfaces';
import { Search } from '../../../common/NetworkInterfaces';
import Autosuggest = require('react-autosuggest');

interface IAppProps {
    onItemSelected: (any) => void;
    onSearchTyped?: (string) => void;
    value?: any[];
}

interface IAppState {
    value: '';
    suggestions: IFrontEndProject[];
}

export class ProjectSearch extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            value: '',
            suggestions: []
        };
    }

    private onSuggestionsFetchRequested({ value }) {
        const req: Search.req = {
            searchValue: value,
            countLimit: 5
        } 
        server.getP('/search', req)
            .then(this.onServerSearchResult.bind(this))
            .catch(showError.show);
    }

    private onServerSearchResult(res: Search.res) {
        this.state.suggestions = res.values;
        this.setState(this.state);
    }

    private onUserTypeChar(event, { newValue, method }) {
        this.state.value = newValue;
        this.setState(this.state);
    }

    private onSuggestionSelected(event, { suggestion, suggestionValue, sectionIndex, method }) {
        this.props.onItemSelected(suggestion);
        this.state.value = '';
        this.setState(this.state);
    }

    /**
     * when suggestion selected, this function tells what should be the value of the input
     */
    private getSuggestionValue(suggestion:IFrontEndProject) {
        return suggestion.name;
    } 

    /**
     * Renders an item in the list of suggestions
     */
    private renderSuggestion(suggestion:IFrontEndProject) {
        return <span>{suggestion.modelLabel + ': ' + suggestion.name}</span>
    }

    private onFormSubmit(event) {
        event.preventDefault();
        if(this.props.onSearchTyped && this.state.value != '') {
            this.props.onSearchTyped(this.state.value);
            this.state.value = '';
            this.setState(this.state);
        }
    }
    
    public render(): React.ReactElement<any> {
        const inputProps = {
            placeholder: 'Buscar...',
            value: this.state.value,
            onChange: this.onUserTypeChar.bind(this)
        };
        
        return (   
            <form onSubmit={this.onFormSubmit.bind(this)}>
                <Autosuggest suggestions={this.state.suggestions}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
                    inputProps={inputProps}
                    onSuggestionsClearRequested={ () => {} }
                />
            </form>   
        );
    }
}