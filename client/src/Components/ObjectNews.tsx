import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as StringUtils from '../lib/StringUtils';
import { Link } from 'react-router';
import * as DateUtils from '../lib/DateUtils';

interface IAppProps {
    location?: any;
    modelName: string;
    objId: number;
}

interface IAppState {
    newsData: any[];
}

export class ObjectNews extends React.Component<IAppProps, IAppState> {

    public state: IAppState;

    constructor(props: IAppProps) {
        super(props);

        this.state = { newsData: [] };
        this.getNews(this.props);
    }    

    private getNews(props: IAppProps) {
        var relateNewsQuery = {
            queryName: 'NewsByObject',
            title: 'Notícias',
            filters: {
                modelName: props.modelName,
                id: props.objId
            }
        }
        server.getQueryData(relateNewsQuery)
            .then(this.onNews.bind(this))
            .catch(showError.show);
    }
    
    private onNews(newsData) {
        this.state.newsData = newsData.records;
        this.setState(this.state);
    }

    private componentWillReceiveProps(props: IAppProps) {
        this.getNews(props);
    }
 
    public render(): React.ReactElement<any> {
        var newsItems = this.state.newsData.map((newsItem, index) => {
            var url = StringUtils.format("/app/view_new?id={0}", newsItem.id);
            return <li key={index}>
                <Link to={url}><h3>{newsItem.title}</h3></Link>
                <div className="col-md-12 col-no-padding">
                    <div className="col-md-6 col-no-padding">
                        <div className="item-related">
                            Posted:<span>{DateUtils.dateFormat(newsItem.created_at)}</span>
                        </div>
                        <div className="item-related">
                            Por:<span>{newsItem.author_name}</span>
                        </div>
                    </div>
                </div>
            </li>
        });
       
        var result = null;
        if(newsItems.length > 0) {
            result = (
                <div className="main-news">
                    <div className="page-header">
                        <h2>Noticias Relacionadas</h2>
                    </div>
                    <div id="carousel"/>
                    <div className="row">
                        <div className="carousel slide fade-quote-carousel">
                            <ol className="carousel-indicators">
                                <li data-target=".fade-quote-carousel" data-slide-to="0" className="active"></li>
                                <li data-target=".fade-quote-carousel" data-slide-to="1"></li>
                                <li data-target=".fade-quote-carousel" data-slide-to="2"></li>
                            </ol>
                            <div className="carousel-inner">
                                <div className="active item">
                                    <ul>
                                        {newsItems}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return result;
    }
}