import * as React from 'react';
import * as showError from '../lib/ShowError';
import * as ModelViewService from '../lib/ModelViewUtils';
import { Link } from 'react-router';
import { strContains } from '../lib/StringUtils';
import { paths } from '../lib/Server';

interface IAppProps {
    location: any;
    recordData: any;
    source: string;
    objId: number;
}

interface IAppState {
    record: any[];
}

export class ViewRecordFields extends React.Component<IAppProps, IAppState> {

    public state: IAppState;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            record: []
        };
    }

    private componentDidMount() {
        this.onRecordDataChange(this.props);
    }

    private componentWillReceiveProps(nextProps) {
        this.onRecordDataChange(nextProps);
    }

    private onRecordDataChange(props) {
        var recordData = props.recordData;
        var fieldValues = [];
        for(var i = 0; i < recordData.length; i++) {
            if(!recordData[i].value || 
                    strContains(recordData[i].label, 'ignorar') || 
                    strContains(recordData[i].label, 'admin') ||
                    recordData[i].isPhoto) {
                continue;
            }
            if(recordData[i].isMultiFieldText) {
                var items = recordData[i].value.split('\n');
                for(var j = 0; j < items.length; j++) {
                    var newFieldInfo:any = { type: items[j].type };
                    var parts = items[j].split(':');
                    newFieldInfo.label = parts[0];
                    newFieldInfo.value = parts[1];

                    if(!newFieldInfo.value || 
                            strContains(newFieldInfo.label, 'ignorar') ||
                            strContains(newFieldInfo.label, 'admin')) {
                        continue;
                    }
                    fieldValues.push(newFieldInfo);   
                }
            } else {
                recordData[i].value = ModelViewService.formatByType(recordData[i]);
                fieldValues.push(recordData[i]);   
            }
        }
        this.state.record = fieldValues;
        this.setState(this.state);
    }

    private insertBR(input:string): React.ReactElement<any>[] { 
        if(!(typeof input == 'string')) {
            return [<div key={'text' + 0}>{input} <br/></div>];
        }                       
        return input.split('\n').map((text, index) => {
            return <div key={'text' + index}>{text} <br/></div>;
        })
    }
    
    public render(): React.ReactElement<any> {
        if(this.state.record.length == 0) {
            return <div></div>;
        }
        const first = this.state.record[0];
        const filteredFields = this.state.record.slice(1, this.state.record.length);

        var fields = filteredFields.map((field):React.ReactElement<any> => {
            var label:React.ReactElement<any> = <div className="col-md-4" key={field.label}> {field.label} </div>;

            var fieldHtml:React.ReactElement<any> = null;
            if(field.ref) {
                var url = "/app/view_record?source=" + field.model + "&id=" + field.value;
                fieldHtml = <Link to={url} >{field.name}</Link>
            } else if (field.isLink) {
                fieldHtml = <a href={field.value} target="_blank">{field.value}</a>;
            } else if (field.isHTML) {
                fieldHtml = <div dangerouslySetInnerHTML={ {__html: field.value } } ></div>
            } else if (field.isList) {
                var listItems = field.value.map((item, index) => { 
                    return <div key={'i'+index}>{item}<br/></div> 
                });
                fieldHtml = <div>{ listItems } </div>;
            } else if (field.isProjectList) {
                var listItems = field.value.map((item, index) => { 
                    var url = "/app/view_record?source=" + item.model + "&id=" + item.id;
                    return (
                        <div key={'pl' + index}>
                            <Link to={url} >{item.name}</Link>
                            { item.description ? <span> - Descrição: {item.description}</span> : null }
                        </div>
                    ); 
                });
                fieldHtml = <div>{ listItems } </div>;
            } else if(field.isConcessionaries) {
                var listItems = field.value.map((concessionary) => { 
                    var url = "/app/view_record?source=Company&id=" + concessionary.id;
                    var labelHtml:string = ": " + concessionary.prop * 100 + "%";
                    return <div key={concessionary.name}><Link to={url}>{concessionary.name}</Link>{labelHtml}</div>; 
                });
                fieldHtml = <div>{ listItems } </div>;
            } else {
                fieldHtml = <span> { this.insertBR(field.value) } </span>
            }

            return (
                <li key={field.label}>
                    { label }
                    <div className="col-md-8">{ fieldHtml }</div>
                </li>
            );
        });

        return (
            <div className="main-boxes">
                <div className="box-wrapper">
                    <div className="box-head">
                        <div><b>{ first.value }</b></div>
                    </div>
                    <div className="box-body">
                        <ul>{ fields }</ul>
                    </div>
                </div>
            </div>
        );
    }
}