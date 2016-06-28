import * as React from 'react';
import * as server from './lib/Server';

var dateFormat = 'dd/MM/yyyy';
var dateTimeFormat = 'dd/MM/yyyy HH:mm';

interface IAppProps {
    fields: any[];
    values: any;
    onError: any;
}

interface IAppState {
    values: any;
}

export class AdminRecordFields extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            values: {}
        };

        for( var i = 0; i < this.props.fields.length; i++ ) {
            var field = this.props.fields[i];
            field.htmlId = this.getHtmlId(field);
            field.hasRef = field.type == 'ref';
            field.isDate = field.type == 'DATE';
            field.isDateTime = field.type == 'DATETIME';
            field.isBool = field.type == 'TINYINT(1)';
            if( field.hasRef ) {
                this.state.values[field.name] = this.props.values[field.name].toString();
                server.getComboValues( field.model, this.getOnComboValuesFn(field), this.props.onError );
            }
            if(field.isDate) {
                var dateStr = this.props.values[field.name];
                if(dateStr) {
                    var date = new Date(dateStr);
                    // TODO use moment.js
                    date.setTime( date.getTime() + date.getTimezoneOffset()*60*1000 ); // correction for timezone
                    this.state.values[field.name] = date;
                }
            }
            if(field.isPhoto) {
                var fieldValues = this.props.values[field.name];
                if(fieldValues && fieldValues.data) {
                    this.state.values[field.name] = fieldValues.data;
                }
            }
        }
    }

    private getOnComboValuesFn(field) {
    
        function onComboValues(values) {
            field.values = values;
        }
        
        return onComboValues;
    }

    private getHtmlId(field) {
        return "html_id_" + field.name;
    }

    private fieldHTML(field): JSX.Element {

        function optionsInCombo(values: any[]) {
            var options = [];
            for(var value of values) {
                options.push(
                    <option value={value.id} >{value.label}</option>
                );
            }
        }

        if(field.hasRef) {
            return (
                <select className="form-control" ng-model={ this.state.values[field.name] } id={field.htmlId} >
                    { optionsInCombo(this.state.values) }
                </select>
            ); 
        } else if (field.isDate) {
            return (
                <p className="input-group" >
                    <input type="text" className="form-control" uib-datepicker-popup={dateFormat} id={field.htmlId} ng-model="values[field.name]" is-open="id_opened" />
                    <span className="input-group-btn">
                        <button type="button" className="btn btn-default" ng-click="id_opened=true"><i className="glyphicon glyphicon-calendar"></i></button>
                    </span>
                </p>   
            );
        } else if(field.isDateTime) {
            return (
                <p className="input-group" >
                    <input type="text" className="form-control" uib-datepicker-popup={dateTimeFormat} id={field.htmlId} value={this.state.values[field.name]} is-open="id_opened" />
                    <span className="input-group-btn">
                        <button type="button" className="btn btn-default" ng-click="id_opened=true"><i className="glyphicon glyphicon-calendar"></i></button>
                    </span>
                </p>   
            );
        /*} else if(field.isPhoto) {
            return (
                <photo-bytes-array id="{{field.htmlId}}" ds-bytes-array="values[field.name]"></photo-bytes-array>
            );
        } else if(field.isList) {
            return (
                <list-of-inputs id="{{field.htmlId}}" ng-model="values[field.name]"></list-of-inputs><br>
            );
        } else if(field.isProjectList) {
            return (
                <list-of-projects id="{{field.htmlId}}" ng-model="values[field.name]"></list-of-projects><br>
            );
        } else if(field.isManyToMany) {
            return (
                <many-to-many id="{{field.htmlId}}" ng-model="values[field.name]" ng-combo-source="field.comboSource" on-error="onError"></many-to-many><br>
            );
        } else if(field.isMultiFieldText) {
            return (
                <textarea type="text" className="form-control" id="{{field.htmlId}}" ng-model="values[field.name]"></textarea>
            );
        } else if(field.enumValues) {
            return (
                <select className="form-control" ng-model="values[field.name]" id="{{field.htmlId}}"  >
                    <option ng-repeat="enumValue in field.enumValues track by $index" value="{{enumValue}}" >{{enumValue}}</option>
                </select>
            );*/
        } else if(field.isBool) {
            return (
                <input type="checkbox"  ng-model="values[field.name]" id="{{field.htmlId}}" >Checado</input>
            );
        } else {
            return (
                <input type="text" className="form-control" id={field.htmlId} ng-model="values[field.name]"></input>
            );
        }
    }
    
    public render(): JSX.Element {
        var fieldsHTML = [];
        for(var field of this.props.fields) {
            fieldsHTML.push(
                <div className="form-group" >
                    <label classNameName="control-label col-sm-2" for={field.htmlId}>{field.label}:</label>
                    <div className="col-sm-10">
                        { this.fieldHTML(field) }
                    </div>
                </div>
            );
        }

        return (
            <div>
                { fieldsHTML }
            </div>
        );
    }
}