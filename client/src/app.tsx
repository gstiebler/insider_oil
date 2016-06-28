/// <reference path="../typings/browser.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import * as session from './session';
import * as server from './Server';
import { AdminList } from './AdminList';

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

  public render():JSX.Element {
    var adminLink = <li className="nav-item" >
                      <Link to="/app/admin"><b>Admin</b></Link>
                    </li>;

    var userNameMenuItem = (
        <div className="col-md-3 col-no-padding">
          <div className="user-name">
            Olá 
            <span> {this.state.username} | </span>
            <a href="#" onClick={ session.logout }>sair</a>
          </div>
        </div>
    );

    var myDashboardMenuItem = (
      <div className="col-md-3 col-no-padding">
        <div className="top-menu-item">
          <div className="top-menu-icon window"></div>
          Meu Dashboard
        </div>
      </div>
    );

    var myAccountMenuItem = (
      <div className="col-md-3 col-no-padding">
        <div className="top-menu-item">
          <div className="top-menu-icon user"></div>
          <a href="/app/change_password">Minha Conta</a>
        </div>
      </div>
    );

    var sacMenuItem = (      
        <div className="col-md-3 col-no-padding">
          <div className="top-menu-item">
            <div className="top-menu-icon question"></div>
            SAC
          </div>
        </div>
    );

    var menu = (
      <div className="top-menu">
          <div className="container-fluid">
              <div className="row">
                  <div className="col-md-4 col-hidden"></div>
                  <div className="col-no-padding col-md-8">
                    { userNameMenuItem }
                    { myDashboardMenuItem }
                    { myAccountMenuItem }
                    { sacMenuItem }
                  </div>
              </div>
          </div>
      </div>
    );

    var logo = (
      <div className="col-md-4">
        <div className="navbar-header navbar-brand-container">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand logo-topo" href="/app/" id="homeLink"></a>
        </div>
      </div>
    );

    var navBarItems = (
        <div className="col-no-padding col-md-8">
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-nav-full">
              <li className="active nav-item">
                <a href="/app/tree?nodeId=1">Dados</a>
              </li>
              <li className="nav-item">
                <a href="/app/tree?nodeLabel=Pessoas">Pessoas</a>
              </li>
              <li className="nav-item">
                <a href="/app/tree?nodeLabel=Empresas">Empresas</a>
              </li>
              { this.state.isAdmin ? adminLink : '' }
            </ul>
          </div>
        </div>
    );

    var navBar = (
      <nav className="navbar navbar-default navbar-border-none" role="navigation">
          <div className="container-fluid padding-lr-20">
            <div className="row">
              { logo }
              { navBarItems }
            </div>
          </div>
        </nav>
    );

    return (
      <div>
        <div className="container-1450">
          { menu }
          { navBar }
        </div>
        <div className="container-1450">
          {this.props.children}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={InsiderOilApp}/>
    <Route path="/app/" component={InsiderOilApp}>
      <Route path="admin" component={AdminList}/>
    </Route>
    <Route path="/app/index.html" component={InsiderOilApp}/>
  </Router>,
  document.getElementById('insideroilapp')
);
