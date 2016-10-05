import * as React from 'react';
import * as showError from './lib/ShowError';
import * as server from './lib/Server';
import { IFrontEndProject } from '../../common/Interfaces';
const Autosuggest = require('react-autosuggest');

interface IAppProps {
    onItemSelected: any;
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
    
    private onSuggestionsUpdateRequested({ value }) {
        server.getSearchResult(value, this.onServerSearchResult.bind(this), showError.show);
    }

    private onServerSearchResult(results:IFrontEndProject[]) {
        this.state.suggestions = results;
        this.setState(this.state);
    }

    private onUserTypeChar(event, { newValue }) {
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
    
    public render(): React.ReactElement<any> {
        const inputProps = {
            placeholder: 'Buscar...',
            value: this.state.value,
            onChange: this.onUserTypeChar.bind(this)
        };
        
        return (      
            <Autosuggest suggestions={this.state.suggestions}
                   getSuggestionValue={this.getSuggestionValue}
                   renderSuggestion={this.renderSuggestion}
                   onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                   onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested.bind(this)}
                   inputProps={inputProps} />
        );
    }
}