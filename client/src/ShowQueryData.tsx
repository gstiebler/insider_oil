import * as React from 'react';
import * as showError from './lib/ShowError';
import * as ModelViewService from './lib/ModelViewUtils';
import * as server from './lib/Server';
import * as StringUtils from './lib/StringUtils';
import { Link } from 'react-router';


interface IAppProps {
    model: any;
    objId: any;
}

interface IAppState {
    header: any[];
    records: any[];
    title: string;
}

export class ShowQueryData extends React.Component<IAppProps, IAppState> {

    public state: IAppState;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            header: [],
            records: [],
            title: this.props.model.title
        };
    }
    
    private componentWillReceiveProps(nextProps: IAppProps) {
        this.getQueryData(nextProps);
    }

    private getQueryData(props: IAppProps) {
        var filters =  props.model.filters;
        if(!filters) {
            filters = {};
            filters.id = props.objId;
        }
        var options = { 
            filters: filters,
            queryName:  props.model.queryName
        };
        server.getQueryData(options)
            .then(this.onData.bind(this))
            .catch(showError.show);
    }
 
    private onData(data) {
        var records = data.records;
        var fields = data.fields;
        
        var header = [];
        for(var i = 0; i < fields.length; i++) {
            var field = fields[i];
            header.push( field.label );
        }
        this.state.header = header;
        
        var showRecords = [];
        for(var i = 0; i < records.length; i++) {
            var recordValues = [];
            var record = records[i];
            for(var j = 0; j < fields.length; j++) {
                var item:any = {};
                var field = fields[j];
                if(field.ref) {
                    item.model = record[field.ref.modelField];
                    item.id = record[field.ref.idField];
                    item.value = record[field.ref.valueField];
                } else {
                    var recordValue = record[field.fieldName];
                    var fn = ModelViewService.formatFnByType(field);
                    recordValue = fn(recordValue);
                    if(field.type == 'CURRENCY') {
                        item.rightAlign = true; 
                    }
                    item.value = recordValue;
                }
                
                recordValues.push(item);
            }
            showRecords.push(recordValues);
        }
        this.state.records = showRecords;
        this.setState(this.state);
    }
    
    public render(): React.ReactElement<any> {
        if(this.state.records.length == 0) {
            return null;
        }

        var headerHtml = this.state.header.map((headerItem) => {
            return <th key={headerItem}>{headerItem}</th>;
        });

        var rowsHtml = this.state.records.map((record:any[], i:number) => {          
            var recordColumns = record.map((recordColumn, j:number):React.ReactElement<any> => {   
                var valueHtml:React.ReactElement<any> = null;
                if(recordColumn.model) {
                    var url = StringUtils.format("/app/view_record?source={0}&id={1}", recordColumn.model, recordColumn.id);
                    valueHtml = <Link to={url} >{recordColumn.value}</Link>;
                } else {
                    valueHtml = <div className="{'text-right': record_column.rightAlign}">{recordColumn.value}</div>;
                }

                return <td key={j}> {valueHtml} </td>;
           });

            return <tr key={i}>{recordColumns}</tr>
        });

        var table =        
            <table className="borderless table table-hover" data-height="500">
                <thead>
                    <tr>{headerHtml}</tr>
                </thead>
                <tbody>
                    {rowsHtml}
                </tbody>
            </table>;

        return (
            <div>
                <h4>{this.state.title}</h4>    
                <div className="main-table">
                    <div className="bootstrap-table fixed-table-container"> 
                        <div className="fixed-table-body"> 
                            { table } </div>
                    </div>
                </div>
                <hr/>
            </div>
        );
    }
}