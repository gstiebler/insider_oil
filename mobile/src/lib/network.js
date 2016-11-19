import { getToken } from './session';

export async function postJson(url, params) {
    let opts = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    };
    let response = await fetch(url, opts);
    return await response.json();
}
 
export async function getJson(url, queryParams) {
    queryParams['token'] = getToken();
    const queryStrs = [];

    for(let queryParam in queryParams) {
        queryStrs.push(queryParam + '=' + queryParams[queryParam]);
    }
    let completeUrl = url;
    
    const queryStr = queryStrs.join('&');
    completeUrl += '?' + queryStr;

    console.log('complete url: ' + completeUrl);
    let response = await fetch(completeUrl);
    return await response.json();
}