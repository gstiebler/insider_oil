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

    private queryDataIncrementalLoading: QueryDataIncrementalLoading;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            records: []
        };
    }

    public componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.queryDataIncrementalLoading = new QueryDataIncrementalLoading('companyCards', 12);
        this.queryDataIncrementalLoading.getData()
            .then(this.onData.bind(this))
            .catch(showError.show);
    }

    private handleScroll(event) {
        const heightTreshold = 1000;
        const diff = event.srcElement.body.scrollHeight - 
            (event.srcElement.body.scrollTop + window.innerHeight);
        if(diff < heightTreshold) {
            this.queryDataIncrementalLoading.getData()
                .then(this.onData.bind(this))
                .catch(showError.show);
        }
    }

    public onData(data:ni.GetTableQueryData.res) {
        this.state.records = this.state.records.concat(data.records);
        this.setState(this.state);
    }

    private searchTextChanged(event) {
        console.log(event.target.value);
    }

    public render(): React.ReactElement<any> {	
        const header = (
            <div className="table-options">
                <div className="col-md-4 col-sm-6">
                    <div className="table-options-name">
                        <h1>Empresas</h1>
                    </div>
                </div>
                <div className="col-md-8 col-sm-6">
                    <div className="table-options-pages">
                        Busca:
                        <input className="header-input" type="text" 
                            onChange={ this.searchTextChanged.bind(this) }
                            style={{ marginLeft: 15 }} ></input>
                    </div>
                </div>
            </div>
        );

        const cards = this.state.records.map((item, index) => {
            return <Card key={index} data={item}> </Card>
        });

		return (
            <div className="main-grid default-options">
                { header }
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
            </div>
		);
    }
}