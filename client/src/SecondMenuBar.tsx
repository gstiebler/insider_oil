import * as React from 'react';
import { Link } from 'react-router';

interface IAppProps {
    isAdmin: boolean;
}

interface IAppState {
}


export class SecondMenuBar extends React.Component<IAppProps, IAppState> {

    public state: IAppState;     

  constructor(props: IAppProps) {
    super(props);

    this.state = {
    };
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
                <Link to="/app/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/app/data_list">Dados</Link>
              </li>
              <li className="nav-item">
                <Link to="/app/paginated_table_view?source=Persons">Pessoas</Link>
              </li>
              <li className="nav-item">
                <Link to="/app/paginated_table_view?source=Companies">Empresas</Link>
              </li>
              <li className="nav-item">
                <Link to="/app/maps_all">Mapas</Link>
              </li>
              <li className="nav-item">
                <Link to="/app/paginated_table_view?source=News">Notícias</Link>
              </li>
              { this.props.isAdmin ? adminLink : '' }
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

    return navBar;
  }
}
