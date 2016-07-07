import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { browserHistory } from 'react-router';
import { ProjectSearch } from '../ProjectSearch'
import * as Flash from '../Flash'
import * as ReactQuill from 'react-quill';

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
        if(this.id) {
            itemData.id = this.id;
            server.saveItem( this.modelName, itemData, this.onSave.bind(this), showError.show );
        } else {
            server.createNewItem( this.modelName, itemData, this.onSave.bind(this), showError.show );
        }
    }
	
	private onSave(status) {
	    Flash.create('success', status.msg);
	    browserHistory.push("/app/model_view?model=" + this.modelName);
	}  

    public render(): React.ReactElement<any> {
        return ( <div>
            <h4 className="col-sm-2" >{this.state.mainTitle}</h4>
            <br/><br/><br/><br/>
            <div className="row">   
                <form className="form-horizontal" role="form" onSubmit={(e) => {e.preventDefault();}}>
                    <div className="form-group">
                        <label className="control-label col-sm-2" for="title_box">Título:</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" 
                                   value={this.state.title}
                                   onChange={(e) => {this.state.title = e.target.value;}} />
                        </div>    
                    </div>
                    
                    <div className="form-group">
                        <label className="control-label col-sm-2" for="content_box">Notícia:</label>
                        <div className="col-sm-10">
                            <ReactQuill theme="snow" 
                                        value={this.state.content}
                                        onChange={(v) => {this.state.content = v;})}/>
                                        
                            Busca: <ProjectSearch onItemSelected={this.onProjectSelected.bind(this)} />
                            <button className="btn btn-default" onClick={() => {console.log(this.state.content)}}>print html</button>
                        </div>
                    </div>
                        
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button className="btn btn-default" onClick={this.saveItem.bind(this)} >Salvar</button>
                        </div>
                    </div>
                </form>
            </div> 
        </div>);
    }
}