import * as DateService from './DateUtils'

export var datatablesPtBrTranslation = {
    "sEmptyTable": "Nenhum registro encontrado",
    "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
    "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
    "sInfoFiltered": "(Filtrados de _MAX_ registros)",
    "sInfoPostFix": "",
    "sInfoThousands": ".",
    "sLengthMenu": "_MENU_ resultados por página",
    "sLoadingRecords": "Carregando...",
    "sProcessing": "Processando...",
    "sZeroRecords": "Nenhum registro encontrado",
    "sSearch": "Pesquisar",
    "oPaginate": {
        "sNext": "Próximo",
        "sPrevious": "Anterior",
        "sFirst": "Primeiro",
        "sLast": "Último"
    },
    "oAria": {
        "sSortAscending": ": Ordenar colunas de forma ascendente",
        "sSortDescending": ": Ordenar colunas de forma descendente"
    }
}


export function formatExcelUploadResult(response) {
    var statusStr = response.status.replace(/\n/g, '<br>');
    if(response.recordsStatus) {
        for( var i = 0; i < response.recordsStatus.length; i++ ) {
            statusStr += '<br>' + response.recordsStatus[i];
        }
    }       
    return statusStr;
}

export function getColumns(viewParams, types) {
    var columns = [];
    for( var i = 0; i < viewParams.gridFields.length; i++) {
        var fieldName = viewParams.gridFields[i];
        if(fieldName == 'id') continue;
        var fieldLabel = viewParams.fields[fieldName].label;
        var columnObj:any = { 
            title: fieldLabel,
            data: fieldName
        };
        if(types[fieldName] == "DATE")
            columnObj.render = { display: DateService.dateFormat };
            
        columns.push(columnObj);
    }        
    return columns;
}


export function formatCurrency(value) {
    if(!value)
        return '';

    var opts = {
            style: 'decimal', 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
    };
    return value.toLocaleString('pt-BR', opts);
}

export function formatNumber(value) {
    if(!value)
        return '';

    var opts = {
            style: 'decimal', 
            maximumFractionDigits: 2 
    };
    return value.toLocaleString('pt-BR', opts);
}

/**
 * Format function by type of the field
 */
export function formatFnByType(field) {
    if(!field)
        return function(value) { return ''; };
        
    if(field.type == 'DATE') {
        return DateService.dateFormat;
    } else if(field.type == 'DATETIME') {
        return DateService.dateTimeFormat;
    } else if (field.isCurrency || field.type == 'CURRENCY') {
        return formatCurrency;
    } else if (field.type == 'FLOAT' || field.type == 'DOUBLE') {
        return formatNumber;
    } else {
        return function(value) { return value; }; 
    }    
}

/**
 * Apply the format function to the field's value
 */
export function formatByType(field) {
    var fn = formatFnByType(field); 
    return fn(field.value);
}