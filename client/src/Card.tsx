import * as React from 'react';

interface IAppProps {
}

interface IAppState {
}

export class Card extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
    }

    public render(): React.ReactElement<any> {		
		return (
            <div data-card="operador" className="col-xs-18 col-sm-6 col-md-4 padding-tb-15">
                <div className="card-body">
                    <h2>BM-BAR-1</h2>
                    <img src="http://placehold.it/500x250/EEE"/>
                    <ul>
                        <li>
                            <div className="col-md-6 col-no-padding">
                                Bacia
                            </div>
                            <div className="col-md-6 col-no-padding">
                                Barreirinhas
                            </div>
                        </li>
                        <li>
                            <div className="col-md-6 col-no-padding">
                                Bloco
                            </div>
                            <div className="col-md-6 col-no-padding">
                                BM-BAR-1
                            </div>
                        </li>
                        <li>
                            <div className="col-md-6 col-no-padding">
                                Operador
                            </div>
                            <div className="col-md-6 col-no-padding">
                                Petrobras
                            </div>
                        </li>
                        <li>
                            <div className="col-md-6 col-no-padding">
                                Status
                            </div>
                            <div className="col-md-6 col-no-padding">
                                Suspenso
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
		);
    }
}