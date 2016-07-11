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
import { GetViewParams, GetTableData } from '../../../common/NetworkInterfaces';

interface IAppProps {
    location: any;
}

interface IAppState {
    viewParams: any;
    dataTableElement: any;
    dataTable: any;
    modelOperations: any;
    modelName: string;
}

export class AdminGrid extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = { 
            viewParams: {},
            dataTableElement: null,
            modelOperations: {},
            modelName: props.location.query.model,
            dataTable: null
        };
        window['adminGridRef'] = this;
    }

    public componentDidMount() {
        this.state.dataTableElement = $('#mainTable');
        this.state.modelOperations = ModelOperations.getModelOperations(this.state.modelName);
        const req:GetViewParams.req = { table: this.state.modelName }; 
        server.getP('/view_params', req)
            .then(this.initTable.bind(this))
            .catch(showError.show);
    }

    private initTable(res: GetViewParams.res) {
        var columns = ModelViewService.getColumns(res.viewParams, res.types);
        columns.push( { title: "Editar", data: 'edit' } );
        columns.push( { title: "Apagar", data: 'delete' } );
        
        this.state.dataTable = this.state.dataTableElement.DataTable( {
            columns: columns,
            language: ModelViewService.datatablesPtBrTranslation,
            processing: true, // show processing message when loading rows
            serverSide: true,
            searching: true,
            //dom: 'rtip', // constrols what parts of datatables is visible
            ajax: this.ajaxFn.bind(this)
        } );

        this.state.viewParams = res.viewParams;
        this.setState(this.state);
        this.state.dataTable.draw();
        return null;
    }

     /**
     * DataTables callback to refresh the data. It's called when the order column change,
     * and when a page on pagination is clicked
     */
    private ajaxFn(data, callback, settings) {
        var orderColumns: GetTableData.IOrderColumn[] = [];
        for(var i = 0; i < data.order.length; i++) {
            var columnIndex = data.order[i].column;
            var orderObj:GetTableData.IOrderColumn = {
                fieldName: data.columns[columnIndex].data,
                dir: data.order[i].dir
            };
            orderColumns.push( orderObj );
        }

        const filters: GetTableData.IFilter[] = [];
        if(data.search.value && data.search.value != '') {
            filters.push({
                field: orderColumns[0].fieldName,
                value: data.search.value,
            });
        }
        const req:GetTableData.req = { 
            table: this.state.modelName,
            pagination: {
                first: data.start,
                itemsPerPage: data.length 
            },
            order: orderColumns,
            filters: filters
        }; 
        server.getP('/table_data', req)
            .then(this.onTableData.bind(this, callback))
            .catch(showError.show);
    }

    private onTableData(callback, res:GetTableData.res) {
        var dataSet = [];
        for( var i = 0; i < res.records.length; i++) {
            var record = res.records[i];
            record.edit = '<a class="btn btn-large btn-primary" onclick="window.adminGridRef.editRecord(' + record.id + ')">Editar</a>';
            record.delete = '<button class="btn btn-large btn-danger" onclick="window.adminGridRef.deleteRecord(' + record.id + ')">Apagar</button>';
            dataSet.push(record);
        }

        var result = { 
            aaData: dataSet,
            recordsTotal: 3,
            recordsFiltered: 3 
        };
        callback(result);
        return null;
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
        this.state.dataTableElement.draw(); 
    }
    
    private showMap() {
        browserHistory.push('/app/map?model=' + this.state.modelName);
    }
    
        
    private onFileUploaded(status) {
        Flash.create('success', status );
        this.state.dataTableElement.draw(); 
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