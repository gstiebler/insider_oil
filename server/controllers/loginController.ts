import * as session from '../lib/session';
   
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


export function makeLogin(req, res, next) {
    session.login( req.body.username, req.body.password, 
            loginOk.bind(this, res), loginError );
    
    function loginError(errorMsg) {
        res.render('login', { title: 'Login', errorMsg: errorMsg });
    }
};


export function makeLoginREST(req, res, next) {
    session.login( req.body.username, req.body.password, loginOk, loginError );
    
    function loginOk(token) {
        res.json( { token: token } );
    }
    
    function loginError() {
        res.status(404).json( { msg: 'Erro no login' } );
    }
};


export function logout(req, res, next) {
    session.logout(req.user);
    res.json( { msg: 'Usuário deslogado.' } );
}