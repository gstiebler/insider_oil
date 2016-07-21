import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';

interface IAppProps {
}

interface IAppState {
}

export class Dashboard extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
    }

    private componentDidMount() {

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
                <h3><span className="count">67</span><span>BIDs</span></h3>
                <h4>Licitações</h4>
                <a className="button" href="javascript:void(0);">Explore</a>
            </div>
        );

        const contracts = (
            <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 text-center">
                <img src="images/icon_dashboard_3.png" alt=""/>
                <h3><span className="count">1367</span><span>E&P</span></h3>
                <h4>Contratos</h4>
                <a className="button" href="javascript:void(0);">Explore</a>
            </div>
        );

        const persons = (
            <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 text-center">
                <img src="images/icon_dashboard_4.png" alt=""/>
                <h3><span className="count">14367</span><span>PESSOAS-CHAVE</span></h3>
                <h4>Pessoas</h4>
                <a className="button" href="javascript:void(0);">Explore</a>
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