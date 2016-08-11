import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import * as moment from 'moment';
import * as ni from '../../common/NetworkInterfaces';
import * as DateUtils from './lib/DateUtils';
import { Tableau } from './Tableau'; 

interface IAppProps {
    location: any;
}

interface IAppState {
    record: any;
}

export class NewsSingle extends React.Component<IAppProps, IAppState> {

    private id: number;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            record: { author: {} }
        };
        this.id = props.location.query.id;
    }

    private componentDidMount() {
        this.getNews();
    }

    private componentWillReceiveProps(nextProps:IAppProps) {
        this.id = nextProps.location.query.id;
        this.getNews();
    }

    private getNews() {
        const req:ni.GetRecord.req = {
            optionsName: 'SingleNews',
            id: this.id
        }
        server.getP('/get_record', req)
            .then(this.onNewsData.bind(this))
            .catch(showError.show);
    }

    private onNewsData(newsData: ni.GetRecord.res) {
        this.state.record = newsData.record;
        this.setState(this.state);
    }

    public render(): React.ReactElement<any> {
        const record = this.state.record;

        var tableauHTML = null;
        if(record.tableau_url) {
            tableauHTML = (
                <div>
                    <Tableau vizUrl={record.tableau_url}/>
                    <br/>
                </div>
            );
        }

        return (
            <div className="news-single">
                <h3>{record.title}</h3>
                <div className="content"
                    dangerouslySetInnerHTML={ {__html: record.content } } ></div>
                { tableauHTML }
                <div className="col-md-12 col-no-padding">
                    <div className="col-md-6 col-no-padding">
                        <div className="item-related">
                            Posted:<span>{DateUtils.dateFormat(record.created_at)}</span>
                        </div>
                        <div className="item-related">
                            Por:<span>{record.author.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}