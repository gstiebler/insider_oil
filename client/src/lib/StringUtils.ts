export function format(...args: any[]):string { 
    var num = arguments.length; 
    var oStr = arguments[0];   
    for (var i = 1; i < num; i++) { 
        var pattern = "\\{" + (i-1) + "\\}"; 
        var re = new RegExp(pattern, "g"); 
        oStr = oStr.replace(re, arguments[i]); 
    } 
    return oStr; 
}

export function strContains(input, substr) {
    return input.indexOf(substr) > -1;
}

export function formatUrlParams(params) {
    var result = '?';
    for(var key in params) {
        result += key + '=' + params[key] + '&';
    }
    result = result.substr(0, result.length - 1);
    return result;
}