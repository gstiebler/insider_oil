import * as React from 'react';
import * as showError from './lib/ShowError';
import * as ModelViewService from './lib/ModelViewUtils';
import { Link } from 'react-router';
import { strContains } from './lib/StringUtils';

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
                    strContains(recordData[i].label, 'admin')) {
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
    
    public render(): React.ReactElement<any> {
        var fields = this.state.record.map((field):React.ReactElement<any> => {
            var label:React.ReactElement<any> = <div className="col-md-6"> {field.label} </div>;

            var fieldHtml:React.ReactElement<any> = null;
            if(field.ref) {
                var url = "/app/view_record?source=" + field.model + "&id=" + field.value;
                fieldHtml = <Link className="col-sm-10" to={url} >{field.name}</Link>
            } else if (field.isLink) {
                fieldHtml = <a className="col-sm-10" href={field.value} target="_blank">{field.value}</a>;
            } else if (field.isHTML) {
                fieldHtml = field.value;
            } else if (field.isList) {
                var listItems = field.value.map((item) => { <span className="col-sm-10">{item}</span> });
                fieldHtml = <div className="col-md-6">{ listItems } </div>;
            } else if (field.isProjectList) {
                var listItems = field.value.map((item) => { 
                    var url = "/app/view_record?source=" + item.model + "&id=" + item.id;
                    <Link className="col-sm-10" to={url} >{item.name}</Link>
                    { item.description ? <span> - Descrição: {item.description}</span> : null } 
                });
                fieldHtml = <div className="col-md-6">{ listItems } </div>;
            } else if (field.isPhoto) {
                var url = "/db_image?dataSource=" + this.props.source + "&id=" + this.props.objId + "&fieldName=" + field.name;
                fieldHtml = <img className="col-sm-10" src={url} ></img> 
            } else if(field.isConcessionaries) {
                var listItems = field.value.map((concessionary) => { 
                    var url = "/app/view_record?source=Company&id=" + concessionary.id;
                    var labelHtml:string = ": " + concessionary.prop * 100 + "%";
                    return <div><Link to={url}>{concessionary.name}</Link>{labelHtml}</div>; 
                });
                fieldHtml = <div className="col-md-6">{ listItems } </div>;
            } else {
                fieldHtml = <span className="col-sm-10">{field.value}</span>
            }

            return (
                <li>
                    { label }
                    <div className="col-md-6">{ fieldHtml }</div>
                </li>
            );
        });

        return (
            <div className="main-boxes">
                <div className="row">
                    <div className="col-md-6">
                        <div className="box-wrapper">
                            <div className="box-head">
                                Informações
                            </div>
                            <div className="box-body">
                                <ul>{ fields }</ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}