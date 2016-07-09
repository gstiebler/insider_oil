import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ModelOperations from '../lib/ModelOperations';
import * as ModelViewService from '../lib/ModelViewUtils';
import { browserHistory } from 'react-router';
import * as Flash from '../Flash'
import { ExcelUploadButton } from './ExcelUploadButton'
import { str2ab } from '../lib/BytesUtils';
import * as FileSaver from 'file-saver'; 

interface IAppProps {
    location: any;
}

interface IAppState {
    viewParams: any;
    dataTableElement: any;
    datatableInitialized: boolean;
    modelOperations: any;
    modelName: string;
}

export class AdminGrid extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = { 
            viewParams: {},
            dataTableElement: {},
            datatableInitialized: false,
            modelOperations: {},
            modelName: ''
        };
        this.state.modelName = props.location.query.model;
        this.state.datatableInitialized = false;
        window['adminGridRef'] = this;
    }

    public componentDidMount() {
        this.state.dataTableElement = $('#mainTable');
        this.state.modelOperations = ModelOperations.getModelOperations(this.state.modelName);
        server.getTable(this.state.modelName, {}, this.showModel.bind(this), showError.show );
    }

    private showModel(modelData) {
        if(modelData.records.length == 0) return;
        
        if(!this.state.datatableInitialized) {
            var columns = ModelViewService.getColumns(modelData.viewParams, modelData.types);
            columns.push( { title: "Editar", data: 'edit' } );
            columns.push( { title: "Apagar", data: 'delete' } );
            
            this.state.dataTableElement.DataTable( {
                columns: columns,
                language: ModelViewService.datatablesPtBrTranslation
            } );
            this.state.datatableInitialized = true;
        }
        
        var dataSet = [];
        for( var i = 0; i < modelData.records.length; i++) {
            var record = modelData.records[i];
            record.edit = '<a class="btn btn-large btn-primary" onclick="window.adminGridRef.editRecord(' + record.id + ')">Editar</a>';
            record.delete = '<button class="btn btn-large btn-danger" onclick="window.adminGridRef.deleteRecord(' + record.id + ')">Apagar</button>';
            dataSet.push(record);
        }
        
        var oTable = this.state.dataTableElement.dataTable();
        oTable.fnClearTable();
        oTable.fnAddData( dataSet );

        this.state.viewParams = modelData.viewParams;
        this.setState(this.state);
    }

    private editRecord(id) {
    	this.state.modelOperations.editRecord(id); 
    }
    
    private deleteRecord(id) {
        if(confirm("Deseja realmente apagar o registro?")){
        	this.state.modelOperations.deleteItem(id, this.onDelete.bind(this), showError.show);
        }
    }
    
    private onDelete(status) {
        Flash.create('success', status.msg );
        server.getTable(this.state.modelName, {}, this.showModel.bind(this), showError.show ); 
    }
    
    private showMap() {
        browserHistory.push('/app/map?model=' + this.state.modelName);
    }
    
        
    private onFileUploaded(status) {
        Flash.create('success', status );
        server.getTable(this.state.modelName, {}, this.showModel.bind(this), showError.show );
    }
    
    private getExcelFile() {
    	server.downloadExcelFile(this.state.modelName, onExcelFile.bind(this), showError.show);
    	
    	function onExcelFile(xlsxBinary) {
    		var ba = str2ab(xlsxBinary);
    		var blob = new Blob([ba], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    		FileSaver.saveAs(blob, "arquivo.xlsx");
    	}
    }
    
    private importFromURL() {
        server.importFromURL(this.state.modelName, onImportFromURL.bind(this), showError.show);
        
        function onImportFromURL(response) {
            var statusStr = ModelViewService.formatExcelUploadResult(response);
            this.onFileUploaded(statusStr);
        }
    }

    public render(): React.ReactElement<any> {
        return (
            <div>
                <h1>{this.state.viewParams.tableLabel}</h1>
                <div className="table-responsive">
                    <table id="mainTable" className="table table-striped table-bordered" width="100%"></table>
                </div>
                <button className="btn btn-large btn-success" onClick={ this.state.modelOperations.createItem } >Adicionar {this.state.viewParams.tableLabel}</button><br/><br/>
                { this.state.viewParams.hasMap ? (<button className="btn btn-large btn-success" onClick={ this.showMap } >Mapa</button>) : <div/> }
                <br/><br/><br/>
                <ExcelUploadButton modelName={this.state.modelName} /><br/>
                <button onClick={ this.getExcelFile.bind(this) } >Baixar arquivo Excel</button>
            </div>
        );
    }
}