import { postJson } from './network'

let token = '';

export async function login(username, password) {
    let opts = { username, password };
    let responseJson = await postJson('http://app.insideroil.com/login_rest', opts);
    token = responseJson.token;
}

export function getToken() {
    return token;
}