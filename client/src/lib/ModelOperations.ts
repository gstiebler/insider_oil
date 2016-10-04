import { browserHistory } from 'react-router';
import * as server from './Server';

class BaseModelOperations {

    private modelName:string;

    constructor(modelName:string) {
        this.modelName = modelName;
    }

    public editRecord(id) {
        var queryStr = "/app/edit_item?modelName=" + this.modelName + '&id=' + id;
        browserHistory.push(queryStr);
    }

    public createItem() {
        var queryStr = "/app/edit_item?modelName=" + this.modelName;
        browserHistory.push(queryStr);
    }

    public deleteItem(id, onDelete, onError) {
        server.deleteItem( this.modelName, id, onDelete, onError );
    }

}

class NewsOperations extends BaseModelOperations {

    public editRecord(id) {
        var queryStr = "/app/create_news?id=" + id;
        browserHistory.push(queryStr);
    }

    public createItem() {
        browserHistory.push("/app/create_news");
    }

}

class ProjectOperations extends BaseModelOperations {

    public editRecord(id) {
        var queryStr = "/app/create_project?id=" + id;
        browserHistory.push(queryStr);
    }

    public createItem() {
        browserHistory.push("/app/create_project");
    }

}


export function getModelOperations(modelName) {
    let customModels = {
        'News': NewsOperations,
        'Project': ProjectOperations,
    }
    
    let moClass = customModels[modelName];
    if(!moClass) {
        moClass = BaseModelOperations;
    }
    
    return new moClass(modelName);
}