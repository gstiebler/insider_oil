import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
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
            this.setState( { sourcesList: sourcesList } );
        }

        server.sourceList(onData.bind(this), showError.show);
    }

    private onProductionFileUploaded(status) {
        console.log(status);
        //Flash.create('success', status );
    }

    public render(): React.ReactElement<any> {
        /*
        var importProductionButton = (
            Importar Excel de produção
            <upload-excel-file model-name="'Production'" on-file-uploaded="onProductionFileUploaded" ></upload-excel-file>
        );*/
        var importProductionButton = null;

        var sourcesLinks = [];
        for( var key in this.state.sourcesList ) {
            var link = "/app/model_view?model=" + key;
            var source = this.state.sourcesList[key];
            sourcesLinks.push(<p><Link to={link} key={key}>{source}</Link></p>);
        }

        return (
            <div>
            <h4>
                <Link to="/app/model_view?model=News">Notícias</Link>
            </h4>
            { sourcesLinks }
            { importProductionButton }
            </div>
        );
    }
}