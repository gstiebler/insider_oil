import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
var DateTimeField = require('react-bootstrap-datetimepicker');
import * as moment from 'moment';
import { ListOfInputs } from './ListOfInputs';
import { ListOfProjects } from './ListOfProjects';

interface IAppProps {
    fields: any[];
    values: any;
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

    private componentWillReceiveProps(nextProps) {
        this.buildValues(nextProps);
    }

    private buildValues(props) {
        for( var i = 0; i < props.fields.length; i++ ) {
            var field = props.fields[i];
            field.hasRef = field.type == 'ref';
            field.isDate = field.type == 'DATE';
            field.isDateTime = field.type == 'DATETIME';
            field.isBool = field.type == 'TINYINT(1)';
            if( field.hasRef ) {
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

    private fieldHTML(field): React.ReactElement<any> {

        function optionsInCombo(values: any[]): React.ReactElement<any>[] {
            if(!values)
                return [];
            return values.map((value, index) => {
                return <option value={value.id} key={'c' + index}>{value.label}</option>;
            });
        }

        if(field.hasRef) {
            return (
                <select className="form-control" value={ this.state.values[field.name] } >
                    { optionsInCombo(this.state.comboValues[field.name]) }
                </select>
            ); 
        } else if (field.isDate || field.isDateTime) {
            var format = field.isDate ? "DD/MM/YYYY" : "DD/MM/YYY HH:mm";
            var dateStr = moment(this.state.values[field.name]).format(format);
            console.log(dateStr);
            return  <DateTimeField 
                       mode={'date'}
                       inputFormat={format}
                       dateTime={dateStr}
                       format={format}
                       className="form-control input-group"/>;
        } else if(field.isList) {
            return <ListOfInputs value={this.state.values[field.name]} onChange={(value) => {console.log(value)} }/>
        } else if(field.isBool) {
            return <input type="checkbox" checked={ this.state.values[field.name] } >Checado</input>
        } else if(field.isMultiFieldText) {
            return <textarea type="text" className="form-control" value={this.state.values[field.name]}/>
        } else if(field.isProjectList) {
            return <ListOfProjects value={this.state.values[field.name]} onChange={(value) => {console.log(value)} }/>
        } else {
            return <input type="text" className="form-control" id={field.htmlId} value={ this.state.values[field.name] }/>
        }
        /*} else if(field.isPhoto) {
            return (
                <photo-bytes-array id="{{field.htmlId}}" ds-bytes-array="values[field.name]"></photo-bytes-array>
            );
        
        }  else if(field.isManyToMany) {
            return (
                <many-to-many id="{{field.htmlId}}" ng-model="values[field.name]" ng-combo-source="field.comboSource" on-error="onError"></many-to-many><br>
            );
        } else if(field.enumValues) {
            return (
                <select className="form-control" ng-model="values[field.name]" id="{{field.htmlId}}"  >
                    <option ng-repeat="enumValue in field.enumValues track by $index" value="{{enumValue}}" >{{enumValue}}</option>
                </select>
            );*/
        
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