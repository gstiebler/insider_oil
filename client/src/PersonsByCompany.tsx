import * as React from 'react';
import { Card } from './Card'
import { QueryDataIncrementalLoading } from './lib/QueryDataIncrementalLoading';
import * as ni from '../../common/NetworkInterfaces';
import * as showError from './lib/ShowError';

interface IAppProps {
}

interface IAppState {
    records: any[];
}

export class PersonsByCompany extends React.Component<IAppProps, IAppState> {

    private queryDataLazyLoading: QueryDataIncrementalLoading;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            records: []
        };
    }

    public componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.queryDataLazyLoading = new QueryDataIncrementalLoading('companyCards', 12);
        this.queryDataLazyLoading.getData()
            .then(this.onData.bind(this))
            .catch(showError.show);
    }

    private handleScroll(event) {
        const heightTreshold = 1000;
        const diff = event.srcElement.body.scrollHeight - 
            (event.srcElement.body.scrollTop + window.innerHeight);
        if(diff < heightTreshold) {
            this.queryDataLazyLoading.getData()
                .then(this.onData.bind(this))
                .catch(showError.show);
        }
    }

    public onData(data:ni.GetTableQueryData.res) {
        this.state.records = this.state.records.concat(data.records);
        this.setState(this.state);
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