import * as React from 'react';
import { Link } from 'react-router';

interface IAppProps {
}

interface IAppState {
}

export class DataList extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
    }

    public render(): React.ReactElement<any> {
        const exploration = (
            <div className="col-md-6">
                <span className="col-md-2">Exploração</span>
                <div className="col-md-10">
                    <div className="row">
                        <div className="col-md-6">
                            <Link to="/app/paginated_table_view?source=Blocks"
                                className="button">Blocos</Link>
                        </div>
                        <div className="col-md-6">
                            <Link to="/app/paginated_table_view?source=DrillingRigs"
                                className="button">Sondas</Link>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-6">
                            <Link to="/app/paginated_table_view?source=Wells"
                                className="button">Poços</Link>
                        </div>
                        <div className="col-md-6">
                            <Link to="/app/paginated_table_view?source=Seismics"
                                className="button">Sísmica</Link>
                        </div>
                    </div>
                </div>
                <hr/>
            </div>
        );

        const production = (
            <div className="col-md-6">
                <span className="col-md-2">Produção</span>
                <div className="col-md-10">
                    <div className="row">
                        <div className="col-md-4">
                            <Link to="/app/paginated_table_view?source=FPSOs"
                                className="button">FPSOs</Link>
                        </div>
                        <div className="col-md-4">
                            <Link to="/app/paginated_table_view?source=FixedProductionUnits"
                                className="button">UPEs Fixas</Link>
                        </div>
                        <div className="col-md-4">
                            <Link to="/app/paginated_table_view?source=SemiSubmersibleProductionUnits"
                                className="button">UPEs FPSOs Semi</Link>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-6">
                            <Link to="/app/paginated_table_view?source=oilFielsdProduction"
                                className="button">Campos em Produção</Link>
                        </div>
                        <div className="col-md-6">
                            <Link to="/app/paginated_table_view?source=oilFieldsDevelopment"
                                className="button">Campos em desenvolvimento</Link>
                        </div>
                    </div>
                </div>
                <hr/>
            </div>
        );

        return (
            <div className="data-list">
                <div className="row">
                    { exploration }
                    { production }
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-1"/>
                    <div className="col-md-5">
                        <Link to="/app/paginated_table_view?source=Bids"
                            className="button">Licitações</Link>
                    </div>
                    <div className="col-md-1"/>
                    <div className="col-md-5">
                        <Link to="/app/paginated_table_view?source=Contracts"
                            className="button">Contratos</Link>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-1"/>
                    <div className="col-md-5">
                        <Link to="/app/paginated_table_view?source=Companies"
                            className="button">Empresas</Link>
                    </div>
                    <div className="col-md-1"/>
                    <div className="col-md-5">
                        <Link to="/app/paginated_table_view?source=Persons"
                            className="button">Pessoas</Link>
                    </div>
                </div>
            </div>
        );
    }
}