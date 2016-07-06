import * as Flash from '../Flash'

export function show(err) {
    err = JSON.parse(err.responseText);
    var errorStr = err.errorMsg;
    console.log(err);
    if(err.errors) {
        for( var i = 0; i < err.errors.length; i++ )
            errorStr += '<br>' + err.errors[i].message;
    }
    Flash.create('danger', errorStr);
}