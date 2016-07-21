import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import * as ni from '../../common/NetworkInterfaces';
import { Link } from 'react-router';

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
                numPersons: 0
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
        const barrels = (
            <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 text-center">
                <img src="images/icon_dashboard_1.png" alt=""/>
                <h3><span className="count">69</span><span>BARRIL</span></h3>
                <h4>Produção de óleo / dia</h4>
                <a className="button" href="javascript:void(0);">Explore</a>
            </div>
        );

        const bids = (
            <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 text-center">
                <img src="images/icon_dashboard_2.png" alt=""/>
                <h3><span className="count">{this.state.dashboardData.numBids}</span><span>BIDs</span></h3>
                <h4>Licitações</h4>
                <Link className="button" to="/app/tree?nodeLabel=Licitações">Explore</Link>
            </div>
        );

        const contracts = (
            <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 text-center">
                <img src="images/icon_dashboard_3.png" alt=""/>
                <h3><span className="count">{this.state.dashboardData.numContracts}</span><span>E&P</span></h3>
                <h4>Contratos</h4>
                <Link className="button" to="/app/tree?nodeLabel=Contratos">Explore</Link>
            </div>
        );

        const persons = (
            <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 text-center">
                <img src="images/icon_dashboard_4.png" alt=""/>
                <h3><span className="count">{this.state.dashboardData.numPersons}</span><span>PESSOAS-CHAVE</span></h3>
                <h4>Pessoas</h4>
                <Link className="button" to="/app/tree?nodeLabel=Pessoas">Explore</Link>
            </div>
        );

        const overview = (
            <div className="row">
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