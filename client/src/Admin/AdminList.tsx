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

    private onKmlLoad(model:string, base64Str: string) {
        var kmlStr = atob(base64Str); 
        Flash.create('success', 'Arquivo pronto para ser enviado');
        var params = { model, data: JSON.stringify(kmlStr), }
        server.postP('/db_server/upload_kml', params)
            .then(res => Flash.create('success', 'KML processado: ' + res.status))
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
            <div className="row">
                <div className="col-md-5">
                    <h4>
                        <p><Link to="/app/model_view?model=News">Notícias</Link></p>
                        <p><Link to="/app/insights_publisher">Publicador</Link></p>
                    </h4>
                    <p><Link to="/app/paginated_table_view?source=Production">Produção</Link></p>
                    <p><Link to="/app/requests_viewer">Visualizador de acessos</Link></p>
                    <hr/>
                    Importar Excel de produção
                    <ExcelUploadButton modelName="Production" /><br/>
                    <hr/>
                    Importar arquivo KML de Blocos
                    <ButtonUploadFile onFileLoad={this.onKmlLoad.bind(this, 'Block')} />
                    <hr/>
                    Importar arquivo KML de Campos
                    <ButtonUploadFile onFileLoad={this.onKmlLoad.bind(this, 'OilField')} />
                    <hr/>
                </div>
                <div className="col-md-5">
                    { sourcesLinks }
                </div>
            </div>
        );
    }
}