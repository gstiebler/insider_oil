import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ni from '../../../common/NetworkInterfaces';
import { Link } from 'react-router';
import { DashboardCounter } from '../Components/DashboardCounter';

interface IAppProps {
}

interface IAppState {
    dashboardData: ni.GetDashboardData.res;
}

export class Dashboard extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            dashboardData: {
                numBids: 0,
                numContracts: 0,
                numPersons: 0,
                numProjects: 0
            }
        };
    }

    private componentDidMount() {
        server.getP('/dashboard_data', {})
            .then(this.onDashboardData.bind(this))
            .catch(showError.show);
    }

    private onDashboardData(res:ni.GetDashboardData.res) {
        this.state.dashboardData = res;
        this.setState(this.state);
    }

    public render(): React.ReactElement<any> {
        const projects = (
            <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 text-center">
                <img src="images/icon_fabric.png" alt=""/>
                <h3>
                    <DashboardCounter count={this.state.dashboardData.numProjects} />
                    <span>PROJETOS</span>
                </h3>
                <h4>Projetos ativos</h4>
                <Link className="button" to="/app/paginated_table_view?source=Projects">Explore</Link>
            </div>
        );

        const bids = (
            <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 text-center">
                <img src="images/icon_dashboard_2.png" alt=""/>
                <h3>
                    <DashboardCounter count={this.state.dashboardData.numBids} />
                    <span>SERVIÇOS</span>
                </h3>
                <h4>Licitações</h4>
                <Link className="button" to="/app/paginated_table_view?source=Bids">Explore</Link>
            </div>
        );

        const contracts = (
            <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 text-center">
                <img src="images/icon_dashboard_3.png" alt=""/>
                <h3>
                    <DashboardCounter count={this.state.dashboardData.numContracts} />
                    <span>E&P</span>
                </h3>
                <h4>Contratos</h4>
                <Link className="button" to="/app/paginated_table_view?source=Contracts">Explore</Link>
            </div>
        );

        const persons = (
            <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 text-center">
                <img src="images/icon_dashboard_4.png" alt=""/>
                <h3>
                    <DashboardCounter count={this.state.dashboardData.numPersons} />
                    <span>CONTATOS</span>
                </h3>
                <h4>Pessoas</h4>
                <Link className="button" to="/app/paginated_table_view?source=Persons">Explore</Link>
            </div>
        );

        const overview = (
            <div className="row">
                { projects }
                { bids }
                { contracts }
                { persons }
            </div>
        );

        return (
            <div className="container">
                <div className="main-charts">                
                    <div className="page-header">
                        <h2>Overview</h2>
                    </div>
                    { overview }
                </div>
            </div>
        );
    }
}