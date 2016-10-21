import * as React from 'react';
import { Link } from 'react-router';
import { paths } from './lib/Server';

interface ICompanyCard {
    company_name: string;
    company_id: number;
    person_name: string;
    person_id: number;
    position: string;
}

interface IAppProps {
    data: ICompanyCard;
}

interface IAppState {
}

export class Card extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
    }

    public render(): React.ReactElement<any> {	
        const data = this.props.data;
        var url = paths.baseImg + 'Company/img_' + data.company_id + '_original.jpg';
		return (
            <div data-card="operador" className="col-xs-18 col-sm-4 col-md-3 padding-tb-15">
                <div className="card-body">
                    <h2>{ data.company_name }</h2>
                    <img src={url} style={{width: 300, height: 180}}/>
                    <ul>
                        <li>
                            <div className="col-no-padding">
                                <Link to={"/app/view_record?source=Company&id=" + data.company_id}>Detalhes da empresa</Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
		);
    }
}