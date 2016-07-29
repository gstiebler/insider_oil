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
                <span className="col-md-4">Exploração</span>
                <div className="col-md-8">
                    <div className="row">
                        <Link to="/app/paginated_table_view?source=Blocks" 
                            className="col-md-6">Blocos</Link>
                        <Link to="/app/paginated_table_view?source=DrillingRigs" 
                            className="col-md-6">Sondas</Link>
                    </div>
                    <div className="row">
                        <Link to="/app/paginated_table_view?source=Wells" 
                            className="col-md-6">Poços</Link>
                        <Link to="/app/paginated_table_view?source=Seismics" 
                            className="col-md-6">Sísmica</Link>
                    </div>
                </div>
                <hr/>
            </div>
        );

        const production = (            
            <div className="col-md-6">
                <span className="col-md-4">Produção</span>
                <div className="col-md-8">
                    <div className="row">
                        <Link to="/app/paginated_table_view?source=FPSOs" 
                            className="col-md-4">FPSOs</Link>
                        <Link to="/app/paginated_table_view?source=FixedProductionUnits" 
                            className="col-md-4">UPEs Fixas</Link>
                        <Link to="/app/paginated_table_view?source=SemiSubmersibleProductionUnits" 
                            className="col-md-4">UPEs FPSOs Semi</Link>
                    </div>
                    <div className="row">
                        <Link to="/app/paginated_table_view?source=oilFielsdProduction" 
                            className="col-md-6">Campos em Produção</Link>
                        <Link to="/app/paginated_table_view?source=oilFieldsDevelopment" 
                            className="col-md-6">Campos em desenvolvimento</Link>
                    </div>
                </div>
                <hr/>
            </div>
        );

        return (
            <div>
                <div className="row">
                    { exploration }
                    { production }
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <Link to="/app/paginated_table_view?source=Bids" 
                            className="col-md-4">Licitações</Link>
                    </div>
                    <div className="col-md-6">
                        <Link to="/app/paginated_table_view?source=Contracts" 
                            className="col-md-4">Contratos</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <Link to="/app/paginated_table_view?source=Companies" 
                            className="col-md-4">Empresas</Link>
                    </div>
                    <div className="col-md-6">
                        <Link to="/app/paginated_table_view?source=Persons" 
                            className="col-md-4">Pessoas</Link>
                    </div>
                </div>
            </div>
        );
    }
}