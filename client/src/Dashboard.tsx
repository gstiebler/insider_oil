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
        return (
            <div className="container">
                <div className="main-charts">
                    <div className="page-header">
                        <h2>Overview</h2>
                    </div>
                    <div className="row">
                        <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 text-center">
                            <img src="images/icon_dashboard_1.png" alt=""/>
                            <h3><span className="count">69</span><span>BARRIL</span></h3>
                            <h4>Produção de óleo / dia</h4>
                            <a className="button" href="javascript:void(0);">Explore</a>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 text-center">
                            <img src="images/icon_dashboard_2.png" alt=""/>
                            <h3><span className="count">67</span><span>BIDs</span></h3>
                            <h4>Licitações</h4>
                            <a className="button" href="javascript:void(0);">Explore</a>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 text-center">
                            <img src="images/icon_dashboard_3.png" alt=""/>
                            <h3><span className="count">1367</span><span>E&P</span></h3>
                            <h4>Contratos</h4>
                            <a className="button" href="javascript:void(0);">Explore</a>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 text-center">
                            <img src="images/icon_dashboard_4.png" alt=""/>
                            <h3><span className="count">14367</span><span>PESSOAS-CHAVE</span></h3>
                            <h4>Pessoas</h4>
                            <a className="button" href="javascript:void(0);">Explore</a>
                        </div>
                    </div>
                    <hr/>
                    <div>
                        <div className="row" id="charts">
                            <div className="page-header">
                                <h2>Dashboard</h2>
                            </div>
                            <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <h5>Produção de óleo / dia</h5>
                                <div className="wrapper-chart">
                                    <div className="chart" id="p1">
                                        <canvas id="chart1"></canvas>
                                    </div>
                                </div>
                                <a className="button" href="javascript:void(0);">Exportar</a>
                            </div>
                            <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <h5>Produção de óleo / dia</h5>
                                <div className="wrapper-chart">
                                    <div id="chart2">
                                        <ul id="numbers">
                                            <li><span>100%</span></li>
                                            <li><span>90%</span></li>
                                            <li><span>80%</span></li>
                                            <li><span>70%</span></li>
                                            <li><span>60%</span></li>
                                            <li><span>50%</span></li>
                                            <li><span>40%</span></li>
                                            <li><span>30%</span></li>
                                            <li><span>20%</span></li>
                                            <li><span>10%</span></li>
                                            <li><span>0%</span></li>
                                        </ul>

                                        <ul id="bars">
                                            <li><div data-percentage="56" className="bar"></div></li>
                                            <li><div data-percentage="33" className="bar"></div></li>
                                            <li><div data-percentage="54" className="bar"></div></li>
                                            <li><div data-percentage="94" className="bar"></div></li>
                                            <li><div data-percentage="44" className="bar"></div></li>
                                            <li><div data-percentage="23" className="bar"></div></li>
                                        </ul>
                                    </div>
                                </div>
                                <a className="button" href="javascript:void(0);">Exportar</a>
                            </div>

                            <br style={{clear: "both"}}/>

                            <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <h5>Projetos concluídos 2015</h5>
                                <div className="wrapper-chart">
                                    <div id="chart3"></div>
                                </div>
                                <a className="button" href="javascript:void(0);">Exportar</a>
                            </div>
                            <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <h5>Projetos concluídos 2015</h5>
                                <div className="wrapper-chart">
                                    <div id="chart4"></div>
                                </div>
                                <a className="button" href="javascript:void(0);">Exportar</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}