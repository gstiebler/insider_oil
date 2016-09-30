import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { browserHistory } from 'react-router';
import { ProjectSearch } from '../ProjectSearch'
import * as Flash from '../Flash'
import * as ReactQuill from 'react-quill';
import { ImageShow } from './ImageShow';
import * as ni from '../../../common/NetworkInterfaces';

interface IAppProps {
    location: any;
}

interface IAppState {
    mainTitle: string;
    title: string;
    content: string;
    tableauUrl: string;
    id: number;
    author_id: number;
    image: any;
    users: any[];
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
            author_id: null,
            image: null,
            users: []
        };

	    this.modelName = 'News';
    }

    public componentDidMount() {
        if(this.state.id) {
            this.state.mainTitle = "Editar notícia"
            
            const req:ni.RecordValues.req = {
                model: this.modelName,
                id: this.state.id
            };
            server.getP('/record_values/', req)
                .then(this.onServerData.bind(this))
                .catch(showError.show);
        } else {
            this.state.mainTitle = "Nova notícia"
            this.setState(this.state);
        }

        server.getP('/combo_values', { model: 'User' })
            .then(this.onUsers.bind(this))
            .catch(showError.show);
    }

    private onServerData(data:ni.RecordValues.res) {
        this.state.title = data.values.title;
        this.state.content = data.values.content;
        this.state.author_id = data.values.author_id;
        this.state.tableauUrl = data.values.tableau_url;
        console.log(data.values);
        this.setState(this.state);
    }

    private onUsers(users:any[]) {
        this.state.users = users;
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
        var itemData:any = {};
        itemData.title = this.state.title;
        itemData.content = this.state.content;
        itemData.author_id = this.state.author_id;
        itemData.image = this.state.image;
        itemData.tableau_url = this.state.tableauUrl;
        if(this.state.id) {            
            itemData.id = this.state.id;
            const params:ni.SaveItem.req = {
                model: this.modelName,
                record: itemData,
                extraRecordData: { 
                    tableauUrls: [], // TODO Use this for Tableaus 
                    embedStrs: []
                }
            };

            server.putP('/save_item/', {data: JSON.stringify(params)})
                .then(this.onSave.bind(this))
                .catch(showError.show);
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

    private onUserChange(e) {
        this.state.author_id = e.target.value;
        this.setState(this.state);
    }

    public render(): React.ReactElement<any> {
        const imgPath = server.paths.baseImg + 'insights/img_' + this.state.id + '.jpg';

        const titleHTML = (                    
            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="title_box">Título:</label>
                <div className="col-sm-10">
                    <input type="text" className="form-control" 
                            value={this.state.title}
                            onChange={(e) => {this.state.title = e.target.value; this.setState(this.state);}} />
                </div>    
            </div>
        );

        const newContentHTML = (
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
        );

        const usersHTMLOptions = this.state.users.map((user, i) => {
            return <option value={user.id} key={i}>{user.label}</option>;
        });

        const authortHTML = (
            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="title_box">Autor:</label>
                <div className="col-sm-10">                
                    <select className="form-control" 
                        value={this.state.author_id}
                        onChange={this.onUserChange.bind(this)}>
                        { usersHTMLOptions }
                    </select>
                </div>    
            </div>
        );

        return ( <div>
            <h4 className="col-sm-2" >{this.state.mainTitle}</h4>
            <br/><br/><br/><br/>
            <div className="row">   
                <div className="form-horizontal">
                    { titleHTML }
                    { authortHTML }
                    { newContentHTML }

                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <textarea rows="8" cols="100"
                                      value={this.state.content}
                                      onChange={(e) => {this.state.content = e.target.value;this.setState(this.state);}}/>
                        </div>    
                    </div>
                    <div className="form-group">
                        <label className="control-label col-sm-2" htmlFor="title_box">Tableau URLs:</label>
                        <div className="col-sm-10">
                            <textarea rows="4" className="form-control" 
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