import * as ModelViewService from './ModelViewUtils';
import { FilterField } from '../PaginatedTableHeader';
import * as StringUtils from './StringUtils'; 

export function genColumns(tableParams) {
    var columns:FilterField[] = [];
    var currencyColumnsIndexes = [];
    for(var i = 0; i < tableParams.fields.length; i++) {
        var field = tableParams.fields[i];
        var columnObj:FilterField = {
                title: field.label,
                data: '',
                render: {} 
        };
        if(field.ref) {
            columnObj.data = field.ref.valueField,
            columnObj.render = { display: this.getFormatLinkFn(field) };
        } else {
            columnObj.data = field.fieldName;
            columnObj.render = { display: ModelViewService.formatFnByType(field) };
            if(field.type == 'CURRENCY') {
                currencyColumnsIndexes.push(i);
            }
        }
        columns.push(columnObj);
    }
    return {columns, currencyColumnsIndexes};
}

export function getFormatLinkFn(column) {
    return function(value, type, row) {
        if(!value)
            return ''
        var paramsStr = StringUtils.format("'{0}', {1}", row[column.ref.modelField], row[column.ref.idField]);
        var linkStr = '<a href="" onclick="window.paginatedTableRef.followLink(' + 
                paramsStr + '); return false;">' + value + '</a>';
        return linkStr;
    }
}