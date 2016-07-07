import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import * as server from './lib/Server';
import * as session from './lib/session';
import { TopMenu } from './TopMenu'
import { AdminList } from './Admin/AdminList';
import { AdminGrid } from './Admin/AdminGrid';
import { AdminEdit } from './Admin/AdminEdit';
import { NewsEdit } from './Admin/NewsEdit';
import { AdminCreate } from './Admin/AdminCreate';
import { Tree } from './Tree';
import { ViewRecord } from './ViewRecord';
import { OilFieldView } from './OilFieldView';
import { Flash } from './Flash';
import { ChangePassword } from './ChangePassword';

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
        isAdmin: false,
        username: ''
    };

    var token = props.location.query.token;
    if( token ) {
        session.login( token );
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

    var url = props.location.query.url;
    if( url ) {
        browserHistory.push(url);
    }
  }

  public render():React.ReactElement<any> {
    var adminLink = <li className="nav-item" >
                      <Link to="/app/admin"><b>Admin</b></Link>
                    </li>;


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
                <Link to="/app/tree?nodeId=1">Dados</Link>
              </li>
              <li className="nav-item">
                <Link to="/app/tree?nodeLabel=Pessoas">Pessoas</Link>
              </li>
              <li className="nav-item">
                <Link to="/app/tree?nodeLabel=Empresas">Empresas</Link>
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
          <TopMenu username={this.state.username} ></TopMenu>
          { navBar }
        </div>
        <div className="container-1450">
          <Flash timeout={5000}/>
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
      <Route path="model_view" component={AdminGrid}/>
      <Route path="edit_item" component={AdminEdit}/>
      <Route path="create_news" component={NewsEdit}/>
      <Route path="create_item" component={AdminCreate}/>
      <Route path="tree" component={Tree}/>
      <Route path="view_record" component={ViewRecord}/>
      <Route path="oil_field" component={OilFieldView}/>
      <Route path="change_password" component={ChangePassword}/>
    </Route>
    <Route path="/app/index.html" component={InsiderOilApp}/>
  </Router>,
  document.getElementById('insideroilapp')
);
