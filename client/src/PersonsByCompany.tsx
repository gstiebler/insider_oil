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

    private itemsPerPage: number;
    private lastItem: number;
    private waitingData: boolean;
    private count: number;

    constructor(props: IAppProps) {
        super(props);
        this.itemsPerPage = 12;
        this.lastItem = 0;
        this.waitingData = false;
        this.count = 9999999;
        this.state = {
            records: []
        };
    }

    public componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.getData();
    }

    private getData() {
        if(this.waitingData || (this.lastItem >= this.count)) {
            return;
        }
        const req: ni.GetTableQueryData.req = {
            queryName: 'companyCards',
            queryParams: {
                order: [], 
                filters: [],
                pagination: {
                    first: this.lastItem,
                    itemsPerPage: this.itemsPerPage
                }
            }
        }
        this.waitingData = true;
        getP('/get_table_data', req)
            .then(this.onData.bind(this))
            .catch(showError.show);
    }

    private handleScroll(event) {
        const heightTreshold = 1000;
        const diff = event.srcElement.body.scrollHeight - 
            (event.srcElement.body.scrollTop + window.innerHeight);
        if(diff < heightTreshold) {
            this.getData();
        }
    }

    public onData(data:ni.GetTableQueryData.res) {
        this.state.records = this.state.records.concat(data.records);
        this.count = data.count;
        this.setState(this.state);
        this.lastItem = this.state.records.length;
        this.waitingData = false;
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