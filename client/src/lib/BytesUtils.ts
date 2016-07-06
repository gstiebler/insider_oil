export function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

export function base64ToArray( base64 ) {
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