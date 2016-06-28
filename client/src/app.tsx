/// <reference path="../typings/browser.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import * as session from './session';

interface IAppProps {
  model: string;
  location: any;
}

interface IAppState {
  editing?: string;
  nowShowing?: string
}


class InsiderOilApp extends React.Component<IAppProps, IAppState> {

  public state: IAppState;
  private username: string;
  private isAdmin: boolean;

  constructor(props: IAppProps) {
    super(props);

    var token = props.location.query.token;
    if( token )
        session.login( token );
    else
        token = session.getToken();    
    

    this.state = { 
      editing: 'teste' 
    };


  }

  public componentDidMount() {
    var setState = this.setState;
/*
    var url = $location.search().url;
    if( url ) {
        var decodedURL = decodeURIComponent(url);
        $location.url(decodedURL);
    }
    
    server.getUserDetails(function(response) {
        $scope.username = response.login;
        $scope.isAdmin = response.admin;
    }, function(result) {
        if(result.status == 401) {
            $window.location.href = '/';
        }
    });       
            
    $scope.logout = session.logout; // functions
    
    $scope.showError = showError.show;
    $scope.onProjectSelected = function(selectedItem) {
    	var searchParams = {
    		source: selectedItem.model,
    		id: selectedItem.id
    	};
        $location.path("/app/view_record").search(searchParams);
    }*/
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
                    <span>{this.username} | </span>
                    <a href="#" onClick={ session.logout() }>sair</a>
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
                    { this.isAdmin ? adminLink : '' }
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
