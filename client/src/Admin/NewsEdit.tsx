import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { browserHistory } from 'react-router';
import { ProjectSearch } from '../ProjectSearch'
import * as Flash from '../Flash'
import * as ReactQuill from 'react-quill';
import { ImageShow } from './ImageShow';

interface IAppProps {
    location: any;
}

interface IAppState {
    mainTitle: string;
    title: string;
    content: string;
    tableauUrl: string;
    id: number;
    image: any;
}

export class NewsEdit extends React.Component<IAppProps, IAppState> {

    private modelName: string;

    constructor(props: IAppProps) {
        super(props);

        this.state = {            
            mainTitle: '',
            title: '',
            content: '',
            tableauUrl: null,
            id: props.location.query.id,
            image: null
        };

	    this.modelName = 'News';
    }

    public componentDidMount() {
        if(this.state.id) {
            this.state.mainTitle = "Editar notícia"
            
            server.getModelFieldsAndValues(this.modelName, this.state.id)
                .then(this.onServerData.bind(this))
                .catch(showError.show);
        } else {
            this.state.mainTitle = "Nova notícia"
            this.setState(this.state);
        }
    }

    private onServerData(data) {
        this.state.title = data.values.title;
        this.state.content = data.values.content;
        this.state.tableauUrl = data.values.tableau_url;
        this.setState(this.state);
    }

    private onProjectSelected(selectedItem) {
    	var linkStr = '<a href="/app/view_record?source=' + selectedItem.model + '&id=' + selectedItem.id + '">' + selectedItem.name + '</a>';
    	this.state.content = this.insertLinkInContent(this.state.content, linkStr);
        this.setState(this.state);
    }

    private insertLinkInContent(previousContent, linkStr) {
        var symbolPos = previousContent.lastIndexOf('<');
        var beforeSymbolStr = previousContent.slice(0, symbolPos);
        var afterSymboStr = previousContent.slice(symbolPos, previousContent.length);
        return beforeSymbolStr + linkStr + afterSymboStr;
    }

    private saveItem() {
        server.getUserDetails(this.onUserDataArrived.bind(this), showError.show);
	}

    private onUserDataArrived(userData) {
        var itemData:any = {};
        itemData.title = this.state.title;
        itemData.content = this.state.content;
        itemData.author_id = userData.id;
        itemData.image = this.state.image;
        itemData.tableau_url = this.state.tableauUrl;
        if(this.state.id) {
            itemData.id = this.state.id;
            server.saveItem( this.modelName, itemData, this.onSave.bind(this), showError.show );
        } else {
            server.createNewItem( this.modelName, itemData, this.onSave.bind(this), showError.show );
        }
    }
	
	private onSave(status) {
	    Flash.create('success', status.msg);
	    browserHistory.push("/app/model_view?model=" + this.modelName);
	}  

    private onImage(image) {
        this.state.image = image;
    }

    public render(): React.ReactElement<any> {
        const imgPath = server.paths.baseImg + 'insights/img_' + this.state.id + '.jpg';
        return ( <div>
            <h4 className="col-sm-2" >{this.state.mainTitle}</h4>
            <br/><br/><br/><br/>
            <div className="row">   
                <div className="form-horizontal">
                    <div className="form-group">
                        <label className="control-label col-sm-2" htmlFor="title_box">Título:</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" 
                                   value={this.state.title}
                                   onChange={(e) => {this.state.title = e.target.value; this.setState(this.state);}} />
                        </div>    
                    </div>
                    
                    <div className="form-group" style={{border: "3px"}}>
                        <label className="control-label col-sm-2" htmlFor="content_box">Notícia:</label>
                        <div className="col-sm-10">
                            <table className="table table-bordered"><tbody><tr><td>
                                <ReactQuill theme="snow" 
                                        value={this.state.content}
                                        onChange={(v) => {this.state.content = v;this.setState(this.state);}}/>
                            </td></tr></tbody></table>   
                            Busca: <ProjectSearch onItemSelected={this.onProjectSelected.bind(this)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <textarea rows="8" cols="100"
                                      value={this.state.content}
                                      onChange={(e) => {this.state.content = e.target.value;this.setState(this.state);}}/>
                        </div>    
                    </div>
                    <div className="form-group">
                        <label className="control-label col-sm-2" htmlFor="title_box">Tableau URL:</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" 
                                   value={this.state.tableauUrl}
                                   onChange={(e) => {this.state.tableauUrl = e.target.value; this.setState(this.state);}} />
                        </div>    
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button className="btn btn-default" onClick={this.saveItem.bind(this)} >Salvar</button>
                        </div>
                    </div>
                </div>
            </div> 
            Foto de capa
            <ImageShow onChange={this.onImage.bind(this)} 
                    imgPath={imgPath} />
        </div>);
    }
}