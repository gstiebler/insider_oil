/// <reference path="../typings/browser.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as server from './Server';
import * as showError from './ShowError';
import { Link } from 'react-router';

interface IAppProps {
    model: string;
    location: any;
}

interface IAppState {
    sourcesList: any[];
}


export class AdminList extends React.Component<IAppProps, IAppState> {

    public state: IAppState;

    constructor(props: IAppProps) {
        super(props);

        this.state = { sourcesList: [] };

        function onData(sourcesList) {
            console.log(sourcesList);
            this.setState( { sourcesList: sourcesList } );
        }

        server.sourceList(onData.bind(this), showError.show);
    }

    private onProductionFileUploaded(status) {
        console.log(status);
        //Flash.create('success', status );
    }

    public render(): JSX.Element {
        /*
        var importProductionButton = (
            Importar Excel de produção
            <upload-excel-file model-name="'Production'" on-file-uploaded="onProductionFileUploaded" ></upload-excel-file>
        );*/
        var importProductionButton = null;

        var sourcesLinks = [];
        for( var key in this.state.sourcesList ) {
            var link = "/app/model_view?model=" + key;
            sourcesLinks.push(<Link to={link} > {this.state.sourcesList[key]} </Link>);
        }

        return (
            <div>
            <h4>
                <a href="/app/model_view?model=News">Notícias</a>
            </h4>
            <p> { sourcesLinks } </p>
            { importProductionButton }
            </div>
        );
    }
}