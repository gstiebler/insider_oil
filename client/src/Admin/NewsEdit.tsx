import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { browserHistory } from 'react-router';
import { ProjectSearch } from '../ProjectSearch'
import * as Flash from '../Flash'

interface IAppProps {
    location: any;
}

interface IAppState {
    mainTitle: string;
    title: string;
    content: string;
}

export class NewsEdit extends React.Component<IAppProps, IAppState> {

    private id:number;
    private modelName: string;

    constructor(props: IAppProps) {
        super(props);

        this.state = {            
            mainTitle: '',
            title: '',
            content: '',
        };

	    this.modelName = 'News';
        this.id = props.location.query.id;
    }

    public componentDidMount() {
        if(this.id) {
            this.state.mainTitle = "Editar notícia"
            
            server.getModelFieldsAndValues(this.modelName, this.id)
                .then(this.onServerData.bind(this))
                .catch(showError.show);
        } else {
            this.state.mainTitle = "Nova notícia"
        }
    }

    private onServerData(data) {
        this.state.title = data.values.title;
        this.state.content = data.values.content;
    }

    private saveItem() {
        server.getUserDetails(this.onUserDataArrived.bind(this), showError.show);
	}

    private onUserDataArrived(userData) {
        var itemData:any = {};
        itemData.title = this.state.title;
        itemData.content = this.state.content;
        itemData.author_id = userData.id;
        if(this.id) {
            itemData.id = this.id;
            server.saveItem( this.modelName, itemData, this.onSave.bind(this), showError.show );
        } else {
            server.createNewItem( this.modelName, itemData, this.onSave.bind(this), showError.show );
        }
    }
	
	private onSave(status) {
	    Flash.create('success', status.data.msg);
	    browserHistory.push("/app/model_view?model=" + this.modelName);
	}  

    public render(): React.ReactElement<any> {
        return (
            <h4 className="col-sm-2" >{this.state.mainTitle}</h4>
            <br/><br/><br/><br/>
            <div className="row">   
                <form className="form-horizontal" role="form">
                    <div className="form-group">
                        <label className="control-label col-sm-2" for="title_box">Título:</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="title_box" ng-model="title"/>
                        </div>    
                    </div>
                    
                    <div className="form-group">
                        <label className="control-label col-sm-2" for="content_box">Notícia:</label>
                        <div className="col-sm-10">
                            Busca: <ProjectSearch on-item-selected="onProjectSelected" />
                            <div text-angular id="content_box_html" ng-model="content"></div><br/>
                            <button className="btn btn-default" ng-click="printHtml()" >print html</button>
                        </div>
                    </div>
                        
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button className="btn btn-default" ng-click="saveItem()" >Salvar</button>
                        </div>
                    </div>
                </form>
            </div> 
        );
    }
}