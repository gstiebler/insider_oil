import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
var DateTimeField = require('react-bootstrap-datetimepicker');
import * as moment from 'moment';
import { ListOfInputs } from './ListOfInputs';
import { ListOfProjects } from './ListOfProjects';
import { ManyToMany } from './ManyToMany';
import { ImageUpload } from './ImageUpload';
import { IField } from '../../../common/Interfaces';

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
    comboValues: any;
}

export class AdminRecordFields extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            values: {},
            comboValues: {}
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
                if(props.values[field.name])
                    this.state.values[field.name] = props.values[field.name].toString();
                server.getComboValues( field.model, this.onComboValues.bind(this, field.name), showError.show );
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

    private onComboValues(fieldName, values) {
        this.state.comboValues[fieldName] = values;
        this.setState(this.state);
    }

    private onChange(fieldName, event) {
        var value = event;
        if(event.target)
            value = event.target.value;
        this.state.values[fieldName] = value;
        this.props.onChange( this.state.values ); 
        this.setState(this.state);
    }

    private fieldHTML(field:IARField): React.ReactElement<any> {

        function optionsInCombo(values: any[]): React.ReactElement<any>[] {
            if(!values)
                return [];
            return values.map((value, index) => {
                return <option value={value.id} key={'c' + index}>{value.label}</option>;
            });
        }

        if(field.type == 'ref') {
            return (
                <select className="form-control" 
                        value={ this.state.values[field.name] }
                        onChange={this.onChange.bind(this, field.name)} >
                    { optionsInCombo(this.state.comboValues[field.name]) }
                </select>
            ); 
        } else if (field.type == 'DATE' || field.type == 'DATETIME') {
            var format = field.isDate ? "DD/MM/YYYY" : "DD/MM/YYY HH:mm";
            var dateStr = moment(this.state.values[field.name]).format(format);
            return  <DateTimeField 
                       mode={'date'}
                       inputFormat={format}
                       dateTime={dateStr}
                       format={format}
                       onChange={this.onChange.bind(this, field.name)}
                       className="form-control input-group"/>;
        } else if(field.isList) {
            return <ListOfInputs value={this.state.values[field.name]} 
                                 onChange={this.onChange.bind(this, field.name) }/>
        } else if(field.isBool) {
            return <input type="checkbox" 
                          checked={ this.state.values[field.name] } 
                          onChange={this.onChange.bind(this, field.name)}>Checado</input>
        } else if(field.isMultiFieldText) {
            return <textarea type="text" className="form-control" 
                             value={this.state.values[field.name]}
                             onChange={this.onChange.bind(this, field.name)}/>
        } else if(field.enumValues) {
            var options = field.enumValues.map((enumValue, index) => {
                return <option value={enumValue} >{enumValue}</option>
            });
            return (
                <select className="form-control" 
                        value={this.state.values[field.name]} 
                        onChange={this.onChange.bind(this, field.name)}>
                    {options}
                </select>
            );
        }  else if(field.isManyToMany) {
            return <ManyToMany comboSource={field.comboSource} 
                               value={this.state.values[field.name]}
                               onChange={this.onChange.bind(this, field.name)}/>
        } else if(field.isPhoto) {
            return <ImageUpload value={ this.state.values[field.name]} 
                                onChange={this.onChange.bind(this, field.name)}/>
        } else if(field.isProjectList) {
            return <ListOfProjects value={this.state.values[field.name]} 
                                   onChange={this.onChange.bind(this, field.name)}/>
        } else {
            return <input type="text" className="form-control" 
                          value={ this.state.values[field.name] } 
                          onChange={this.onChange.bind(this, field.name)}/>
        }
    }
    
    public render(): React.ReactElement<any> {
        var fieldsHTML = this.props.fields.map((field, index) => {
            return <div className="form-group" key={ 'fh' + index }>
                    <label className="control-label col-sm-2" for={field.htmlId}>{field.label}:</label>
                    <div className="col-sm-10">
                        { this.fieldHTML(field) }
                    </div>
                </div>
        });

        return (
            <div>
                { fieldsHTML }
            </div>
        );
    }
}