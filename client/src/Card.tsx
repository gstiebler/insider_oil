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
        var url = paths.baseImg + 'Person/img_' + data.person_id + '_original.jpg';
		return (
            <div data-card="operador" className="col-xs-18 col-sm-6 col-md-4 padding-tb-15">
                <div className="card-body">
                    <h2>{ data.company_name }</h2>
                    <img src={url}/>
                    <ul>
                        <li>
                            <div className="col-md-6 col-no-padding">
                                { data.person_name }
                            </div>
                        </li>
                        <li>
                            <div className="col-md-6 col-no-padding">
                                { data.position }
                            </div>
                        </li>
                        <li>
                            <div className="col-md-6 col-no-padding">
                                <Link to={"/app/view_record?source=Company&id=" + data.company_id}>Todas as pessoas</Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
		);
    }
}