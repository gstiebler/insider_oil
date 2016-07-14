import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { Link } from 'react-router';
import * as Flash from '../Flash'
import { ExcelUploadButton } from './ExcelUploadButton'
import { ButtonUploadFile } from './ButtonUploadFile';

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
        Flash.create('success', status );
    }

    private onBlocksKmlLoad(base64Str: string) {
        var kmlStr = atob(base64Str); 
        Flash.create('success', 'Arquivo pronto para ser enviado');
        var params = { data: JSON.stringify(kmlStr), }
        server.postP('/db_server/upload_blocks_kml', params)
            .then(res => Flash.create('success', 'KML de Blocos carregado: ' + res.status))
            .catch(showError.show);
        return null;
    }

    public render(): React.ReactElement<any> {
        var sourcesLinks = [];
        for( var key in this.state.sourcesList ) {
            var link = "/app/model_view?model=" + key;
            var source = this.state.sourcesList[key];
            sourcesLinks.push(<p key={key}><Link to={link} >{source}</Link></p>);
        }

        return (
            <div>
            <h4>
                <Link to="/app/model_view?model=News">Notícias</Link>
            </h4>
            <hr/>
            { sourcesLinks }
            <hr/>
            Importar Excel de produção
            <ExcelUploadButton modelName="Production" /><br/>
            <hr/>
            Importar arquivo KML de Blocos
            <ButtonUploadFile onFileLoad={this.onBlocksKmlLoad.bind(this)} />
            <hr/>
            </div>
        );
    }
}