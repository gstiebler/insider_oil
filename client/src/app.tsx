/// <reference path="../typings/browser.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import * as session from './session';
import * as server from './Server';

interface IAppProps {
  model: string;
  location: any;
}

interface IAppState {
  username: string;
  isAdmin: boolean;
}


class InsiderOilApp extends React.Component<IAppProps, IAppState> {

    public state: IAppState;     

  constructor(props: IAppProps) {
    super(props);

    this.state = {
        username: '',
        isAdmin: false
    };

    var token = props.location.query.token;
    if( token ) {
        session.login( token );
    } else {
        token = session.getToken();
    }    
  
    server.getUserDetails(function(response) {
       this.setState({
            username: response.login,
            isAdmin: response.admin
        });
    }.bind(this), function(result) {
        if(result.status == 401) {
          browserHistory.push('/');
        }
    });

    /*
    var url = $location.search().url;
    if( url ) {
        var decodedURL = decodeURIComponent(url);
        $location.url(decodedURL);
    }
    */
  }

  public render() {
    var adminLink = <li class="nav-item" >
                      <a href="/app/"><b>Admin</b></a>
                    </li>;

    return (
      <div class="container-1450">
        <div class="top-menu">
          <div class="container-fluid">
            <div class="row">
              <div class="col-md-4 col-hidden"></div>
              <div class="col-no-padding col-md-8">
                <div class="col-md-3 col-no-padding">
                  <div class="user-name">
                    Olá
                    <span>{this.state.username} | </span>
                    <a href="#" onClick={ session.logout }>sair</a>
                  </div>
                </div>
                <div class="col-md-3 col-no-padding">
                  <div class="top-menu-item">
                    <div class="top-menu-icon window"></div>
                    Meu Dashboard
                  </div>
                </div>
                <div class="col-md-3 col-no-padding">
                  <div class="top-menu-item">
                    <div class="top-menu-icon user"></div>
                    <a href="/app/change_password">Minha Conta</a>
                  </div>
                </div>
                <div class="col-md-3 col-no-padding">
                  <div class="top-menu-item">
                    <div class="top-menu-icon question"></div>
                    SAC
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav class="navbar navbar-default navbar-border-none" role="navigation">
          <div class="container-fluid padding-lr-20">
            <div class="row">
              <div class="col-md-4">
                <div class="navbar-header navbar-brand-container">
                  <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                  </button>
                  <a class="navbar-brand logo-topo" href="/app/" id="homeLink"></a>
                </div>
              </div>
              <div class="col-no-padding col-md-8">
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul class="nav navbar-nav navbar-nav-full">
                    <li class="active nav-item">
                      <a href="/app/tree?nodeId=1">Dados</a>
                    </li>
                    <li class="nav-item">
                      <a href="/app/tree?nodeLabel=Pessoas">Pessoas</a>
                    </li>
                    <li class="nav-item">
                      <a href="/app/tree?nodeLabel=Empresas">Empresas</a>
                    </li>
                    { this.state.isAdmin ? adminLink : '' }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={InsiderOilApp}/>
    <Route path="/app" component={InsiderOilApp}/>
    <Route path="/app/index.html" component={InsiderOilApp}/>
  </Router>,
  document.getElementById('insideroilapp')
);
