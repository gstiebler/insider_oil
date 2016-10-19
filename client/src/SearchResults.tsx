import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import { IFrontEndProject } from '../../common/Interfaces';
import { Link } from 'react-router';

interface IAppProps {
    location: any;
}

interface IAppState {
    results: IFrontEndProject[];
}

export class SearchResults extends React.Component<IAppProps, IAppState> {

    public state: IAppState;
    //private searchStr;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            results: []
        };
        //this.searchStr = props.location.query.search;
    }   

    private componentDidMount() {
        this.fetchServerResults(this.props.location.query.search);
    } 

    private componentWillReceiveProps(nextProps:IAppProps) {
        this.fetchServerResults(nextProps.location.query.search);
    }

    private fetchServerResults(searchStr) {
        server.getSearchResult(searchStr)
            .then(this.onServerSearchResult.bind(this))
            .catch(showError.show);
    }

    private onServerSearchResult(results:IFrontEndProject[]) {
        this.state.results = results;
        this.setState(this.state);
    }
 
    public render(): React.ReactElement<any> {

        const resultsHTML = this.state.results.map((r) => {
            const url = '/app/view_record?source=' + r.model + '&id=' + r.id;
            return <p>{ r.modelLabel + ': ' }<Link to={url}>{ r.name }</Link></p>
        });

        return (
            <div>
                <h2><b>Resultados da busca para "{this.props.location.query.search}"</b></h2>
                <br/>
                { resultsHTML }
            </div>
        );
    }
}