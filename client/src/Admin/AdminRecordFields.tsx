import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as moment from 'moment';
import { ListOfInputs } from './ListOfInputs';
import { ListOfProjects } from './ListOfProjects';
import { ManyToMany } from './ManyToMany';
import { DataCombo } from './DataCombo'; 
import { ImageShow } from './ImageShow';
import { IField } from '../../../common/Interfaces';
const DateTime = require('react-datetime');

export function editLineHTML(value: React.ReactElement<any>, label: string, key: string): React.ReactElement<any> {
    return (
        <div className="form-group" key={ key }>
            <label className="control-label col-sm-2">{label}:</label>
            <div className="col-sm-10">
                { value }
            </div>
        </div>
    );
}

interface IARField extends IField {
    hasRef?: boolean;
    isDate?: boolean;
    isDateTime?: boolean;
    isBool?: boolean;
    htmlId?: string;
}

interface IAppProps {
    fields: IARField[];
    values: any;
    onChange: any;
}

interface IAppState {
    values: any;
}

export class AdminRecordFields extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            values: {},
        };
    }

    private componentWillReceiveProps(nextProps:IAppProps) {
        this.buildValues(nextProps);
    }

    private buildValues(props:IAppProps) {
        for( var i = 0; i < props.fields.length; i++ ) {
            var field = props.fields[i];
            field.hasRef = field.type == 'ref';
            field.isDate = field.type == 'DATE';
            field.isDateTime = field.type == 'DATETIME';
            field.isBool = field.type == 'TINYINT(1)';
            if( field.hasRef ) {
                if(props.values[field.name]) {
                    this.state.values[field.name] = props.values[field.name].toString();
                }
            } else if(field.isDate) {
                var dateStr = props.values[field.name];
                if(dateStr) {
                    var date = new Date(dateStr);
                    // TODO use moment.js
                    date.setTime( date.getTime() + date.getTimezoneOffset()*60*1000 ); // correction for timezone
                    this.state.values[field.name] = date;
                }
            } else if(field.isPhoto) {
                var fieldValues = props.values[field.name];
                if(fieldValues && fieldValues.data) {
                    this.state.values[field.name] = fieldValues.data;
                }
            } else {
                this.state.values[field.name] = props.values[field.name];
            }
        }
    }

    private onChange(fieldName, event) {
        var value = event;
        if(event.target)
            value = event.target.value;
        value = value == '' ? null : value;
        this.state.values[fieldName] = value;
        this.props.onChange( this.state.values );
    }

    private onChangeDate(fieldName, value) {
        var formattedValue = value.toDate();
        this.state.values[fieldName] = formattedValue;
        this.props.onChange( this.state.values ); 
        this.setState(this.state);
    }
    
    private onComboChange(fieldName, value) {
        this.onChange(fieldName, value);
        this.setState(this.state);
    }
    
    private onMultiFieldChange(fieldName: string, event) {
        const lines = event.target.value.split('\n');
        const result = {};
        for(let line of lines) {
            const parts = line.split(':');
            result[parts[0]] = parts[1];
        }
        this.onChange(fieldName, JSON.stringify(result));
        this.setState(this.state);
    }

    private getMultiFieldValue(fieldName: string):string {
        if(!this.state.values[fieldName])
            return '';
            
        const obj = JSON.parse(this.state.values[fieldName]);
        const lines = [];
        for(let key in obj) {
            lines.push(key + ': ' + obj[key]);
        }
        return lines.join('\n');
    }
            
    private onCheckboxChange(field, event) {
        var value = !this.state.values[field.name];
        this.onChange(field.name, value);
        this.setState(this.state);
    }

    private fieldHTML(field:IARField): React.ReactElement<any> {

        if(field.type == 'ref') {
            return (
                <DataCombo
                    value={ this.state.values[field.name] }
                    modelName={ field.model }
                    onChange={ this.onComboChange.bind(this, field.name) } />
            ); 
        } else if (field.type == 'DATE' || field.type == 'DATETIME') {
            let dateFormat = "DD/MM/YYYY";
            let timeFormat = field.isDate ? false : "HH:mm";
            let fieldValue = null;
            if(this.state.values[field.name]) {
                fieldValue = new Date(this.state.values[field.name]);
            }
            return  <DateTime 
                       value={fieldValue}
                       input={true}
                       dateFormat={dateFormat}
                       timeFormat={timeFormat}
                       onChange={this.onChangeDate.bind(this, field.name)}
                       className="form-control input-group"/>;
        } else if(field.isList) {
            return <ListOfInputs value={this.state.values[field.name]} 
                                 onChange={this.onChange.bind(this, field.name) }/>
        } else if(field.isBool) {

            return <input type="checkbox" 
                          checked={ this.state.values[field.name] } 
                          onChange={this.onCheckboxChange.bind(this, field)}/>
        } else if(field.isMultiFieldText) {
            return <textarea type="text" className="form-control" 
                             defaultValue={this.getMultiFieldValue(field.name)}
                             onChange={this.onMultiFieldChange.bind(this, field.name)}/>
        } else if(field.type.indexOf('TEXT') > -1 || field.isTextArea ) {
            return <textarea type="text" className="form-control" 
                             defaultValue={this.state.values[field.name]}
                             onChange={this.onChange.bind(this, field.name)}/>
        } else if(field.enumValues) {
            var options = field.enumValues.map((enumValue, index) => {
                return <option value={enumValue} key={'enum' + index}>{enumValue}</option>
            });
            return (
                <select className="form-control" 
                        defaultValue={this.state.values[field.name]} 
                        onChange={this.onChange.bind(this, field.name)}>
                    {options}
                </select>
            );
        }  else if(field.isManyToMany) {
            return <ManyToMany comboSource={field.comboSource} 
                               value={this.state.values[field.name]}
                               onChange={this.onChange.bind(this, field.name)}/>
        } else if(field.isPhoto) {
            return <ImageShow onChange={this.onChange.bind(this, field.name)}/>
        } else if(field.isProjectList) {
            return <ListOfProjects value={this.state.values[field.name]} 
                                   onChange={this.onChange.bind(this, field.name)}/>
        } else {
            return <input type="text" className="form-control" 
                          defaultValue={ this.state.values[field.name] } 
                          onChange={this.onChange.bind(this, field.name)}/>
        }
    }
    
    public render(): React.ReactElement<any> {
        var fieldsHTML = this.props.fields.map((field, index) => {
            return editLineHTML(this.fieldHTML(field), field.label, 'r' + index);
        });

        return (
            <div>
                { fieldsHTML }
            </div>
        );
    }
}