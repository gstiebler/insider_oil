import * as Flash from '../Components/Flash'

export function show(err) {
    console.log(err);
    err = JSON.parse(err.responseText);
    var errorStr = err.errorMsg;
    if(err.errors) {
        for( var i = 0; i < err.errors.length; i++ )
            errorStr += '<br>' + err.errors[i].message;
    }
    Flash.create('danger', errorStr);
}