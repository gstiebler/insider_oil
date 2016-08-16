import * as React from 'react';
import { Card } from './Card'
import { getP } from './lib/Server';
import * as ni from '../../common/NetworkInterfaces';
import * as showError from './lib/ShowError';

interface IAppProps {
}

interface IAppState {
    records: any[];
}

export class PersonsByCompany extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            records: []
        };
    }

    public componentDidMount() {
        const req: ni.GetTableQueryData.req = {
            queryName: 'companyCards',
            queryParams: {
                order: [], 
                filters: [],
                pagination: {
                    first: 0,
                    itemsPerPage: 999
                }
            }
        }
        getP('/get_table_data', req)
            .then(this.onData.bind(this))
            .catch(showError.show);
    }

    public onData(data:ni.GetTableQueryData.res) {
        this.state.records = data.records;
        this.setState(this.state);
        return null;
    }

    public render(): React.ReactElement<any> {		
        const cards = this.state.records.map((item, index) => {
            return <Card key={index} data={item}> </Card>
        });

		return (
            <div className="cards">
                <div id="carousel">
                    <div className="row">
                        <div className="carousel slide fade-quote-carousel" data-ride="carousel" data-interval="100000">
                            <div className="carousel-inner">
                                <div className="active item">
                                    <div className="row">
                                    { cards }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		);
    }
}