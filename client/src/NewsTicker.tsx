import * as React from 'react';
import { Link } from 'react-router';

const TIME_INTERVAL = 40;
const DX_ON_EACH_EVENT = 2;
const MAX_OFFSET = 4500;

interface IAppProps {
    username: string;
}

interface IAppState {
    offset: number;
}

export class NewsTicker extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);
        this.state = {
            offset: 0
        };
    }

    private componentDidMount() {
        setInterval(this.updateTicker.bind(this), TIME_INTERVAL);
    }

    private updateTicker() {
        this.state.offset -= DX_ON_EACH_EVENT;
        if(this.state.offset < MAX_OFFSET) {
            this.state.offset = 0;
        }
        this.setState(this.state);
    }

    public render(): React.ReactElement<any> {
        const categories = [
            'E&P',
            'Empresas',
            'Dados',
            'E&P',
            'Empresas',
            'Dados',
            'E&P',
            'Empresas',
            'Dados',
            'E&P',
            'Empresas',
            'Dados',
        ];
        const content = categories.map((item, index) => {
            return (
                <div className="ti_news" key={index}>
                    <a href="" className="all">
                        <span>{ item }</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                    </a>
                </div>
            );
        });

        const style = {
            width: 4646, 
            marginLeft: this.state.offset
        };
        return (
            <div className="hotnews">
                <span className="blockname">Hotnews</span>
                <div className="TickerNews default_theme" id="T2">
                    <div className="ti_wrapper">
                        <div className="ti_slide">
                            <div className="ti_content" style={style}>
                                { content }
                            </div><div className="ti_content ti_clone" style={{width: 4646, marginLeft: 0}}>
                                { content }
                            </div><div className="ti_content ti_clone" style={{width: 4646, marginLeft: 0}}>
                                { content }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}