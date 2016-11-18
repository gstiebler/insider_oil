import * as session from '../lib/session';
import * as express from "express";
   
function loginOk(res, token) {
    res.redirect('/app/index.html?token=' + token);
}

export function loginPage(req, res, next) {
    const token = req.cookies.token;
    session.userFromToken( token )
        .then(user => {
            if(user) {
                loginOk(res, token);
            } else {
                res.render('login', { title: 'Login'} );
            }
        })
        .catch(err => {
            res.render('login', { title: 'Login'} );
        });
};


export async function makeLogin(req, res, next) {
    try {
        let token = await session.login(req.body.username, req.body.password);
        loginOk(res, token);
    } catch(err) {
        res.render('login', { title: 'Login', errorMsg: err });
    }
};


export async function makeLoginREST(req: express.Request, res: express.Response) {
    try {
        let token = await session.login(req.body.username, req.body.password);
        res.json( { token: token } );
    } catch(err) {
        res.status(404).json( { msg: 'Erro no login' } );
    }
};


export function logout(req, res, next) {
    session.logout(req.user);
    res.json( { msg: 'Usuário deslogado.' } );
}