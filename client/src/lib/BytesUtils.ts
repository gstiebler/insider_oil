import * as Promise from 'bluebird';

export function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

export function base64ToArray( base64 ):number[] {
    var base64str = atob(base64);
    var bytes = new Array( base64str.length );
    for(var i = 0; i < base64str.length; i++) {
        bytes[i] = base64str.charCodeAt(i);
    }
    return bytes;
}

export function removeBase64Header(dsBase64) {
    return dsBase64.substring(dsBase64.search(';base64,') + 8, dsBase64.length);
}

export function StrToByteArray(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

export function ReadFileToBase64Str(file: Blob):Promise<string> {

    function onFileLoad(reader, resolve) {
        var dsBase64 = reader.result;
        var trimmedBase64 = removeBase64Header(dsBase64);
        resolve(trimmedBase64);
        return null;
    }

    return new Promise<any>( function(resolve, reject) {
        let reader = new FileReader();
        reader.onloadend = onFileLoad.bind(this, reader, resolve);
        // TODO read as byte array and avoid base64 conversion
        reader.readAsDataURL(file);
        return null;
    });
}