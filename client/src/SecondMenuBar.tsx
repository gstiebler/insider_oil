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

  public render(): React.ReactElement<any> {
    var adminLink = <li className="nav-item" >
      <Link to="/app/admin"><b>Admin</b></Link>
    </li>;

    var logo = (
      <div className="col-md-3">
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
      <div className="col-no-padding col-md-9">
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-nav-full">
            <li className="nav-item">
              <Link to="/app/insights">Insights</Link>
            </li>
            <li className="nav-item dropdown">
              <a aria-haspopup="true" aria-expanded="false">Exploração<span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><Link to="/app/paginated_table_view?source=Wells">Poços</Link></li>
                <li><Link to="/app/paginated_table_view?source=DrillingRigs">Sondas</Link></li>
                <li><Link to="/app/paginated_table_view?source=Blocks">Blocos</Link></li>
                <li><Link to="/app/paginated_table_view?source=Seismics">Sísmica</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a aria-haspopup="true" aria-expanded="false">Produção<span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><Link to="/app/paginated_table_view?source=FPSOs">FPSOs</Link></li>
                <li><Link to="/app/paginated_table_view?source=FixedProductionUnits">Plataformas Fixas</Link></li>
                <li><Link to="/app/paginated_table_view?source=SemiSubmersibleProductionUnits">Semi-submersíveis </Link></li>
                <li><Link to="/app/paginated_table_view?source=oilFielsdProduction">Campos em Produção</Link></li>
                <li><Link to="/app/paginated_table_view?source=oilFieldsDevelopment">Campos em Desenvolvimento</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link to="/app/persons">Empresas</Link>
            </li>
            <li className="nav-item dropdown">
              <a aria-haspopup="true" aria-expanded="false">Oportunidades<span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><Link to="/app/paginated_table_view?source=Contracts">Contratos</Link></li>
                <li><Link to="/app/paginated_table_view?source=Bids">Licitações</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link to="/app/maps_all">Mapas</Link>
            </li>
            <li className="nav-item dropdown">
              <a aria-haspopup="true" aria-expanded="false">Observatório<span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><Link to="/app/observatory?id=investments">Investimentos</Link></li>
                <li><Link to="/app/observatory?id=wells">Poços</Link></li>
              </ul>
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
