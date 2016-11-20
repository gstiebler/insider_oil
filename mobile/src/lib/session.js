import { postJson } from './network'

let token = '';

export async function login(username, password) {
    let opts = { username, password };
    let responseJson = await postJson('http://app.insideroil.com/login_rest', opts);
    if(responseJson.token) {
        token = responseJson.token;
    } else {
        throw responseJson.msg;
    }
}

export function getToken() {
    return token;
}