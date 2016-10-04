import * as React from 'react';
import { Link } from 'react-router';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import * as ni from '../../common/NetworkInterfaces';

const FIRST_OFFSET = 120;
const TIME_INTERVAL = 40;
const DX_ON_EACH_EVENT = 2;

interface IAppProps {
}

interface IAppState {
    offset: number;
    items: ni.TickerUpdates.ITickerItem[];
    tickerWidth: number;
}

export class NewsTicker extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);
        this.state = {
            offset: FIRST_OFFSET,
            items: [],
            tickerWidth: -1
        };
    }

    private componentDidMount() {
        const req:ni.TickerUpdates.req = {}
        server.getP('/ticker_updates', req)
            .then(this.onData.bind(this))
            .catch(showError.show);
    }

    private onData(res:ni.TickerUpdates.res) {
        this.state.items = res.items;
        setInterval(this.updateTicker.bind(this), TIME_INTERVAL);
        this.calculateTotalWidth();
    }

    private calculateTotalWidth() {
        // the update is set here only to calculate total width
        this.setState(this.state);
        const tiContentDiv:any = this.refs['tiContentRef'];
        this.state.tickerWidth = 0;
        for(let child of tiContentDiv.children) {
            this.state.tickerWidth += child.clientWidth;
        }
    }

    private updateTicker() {
        this.state.offset -= DX_ON_EACH_EVENT;
        if(this.state.offset < -(this.state.tickerWidth - FIRST_OFFSET)) {
            this.state.offset = FIRST_OFFSET;
        }
        this.setState(this.state);
    }

    public render(): React.ReactElement<any> {
        const content = this.state.items.map((item, index) => {
            const className = item.category == 'Insight' ? 'data' : 'all';
            return (
                <div className="ti_news" key={index}>
                    <Link to={item.link} className={ className }>
                        <span>{ item.category }</span> { item.title }
                    </Link>
                </div>
            );
        });

        const style = {
            width: this.state.tickerWidth,
            marginLeft: this.state.offset
        };
        return (
            <div className="hotnews">
                <span className="blockname">Novo</span>
                <div className="TickerNews default_theme" id="T2">
                    <div className="ti_wrapper">
                        <div className="ti_slide">
                            <div className="ti_content" ref="tiContentRef" style={style}>
                                { content }
                            </div>
                            <div className="ti_content ti_clone" style={{marginLeft: 0}}>
                                { content }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}