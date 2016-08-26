import * as React from 'react';
import { Link } from 'react-router';

interface IAppProps {
    username: string;
}

interface IAppState {
}

export class NewsTicker extends React.Component<IAppProps, IAppState> {

    private offset: number;

    constructor(props: IAppProps) {
        super(props);
        this.state = {};
        this.offset = 0;
    }

    private componentDidMount() {
        
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
                    <a href="javascript:void(0);" className="all">
                        <span>{ item }</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                    </a>
                </div>
            );
        });

        return (
            <div className="hotnews">
                <span className="blockname">Hotnews</span>
                <div className="TickerNews default_theme" id="T2">
                    <div className="ti_wrapper">
                        <div className="ti_slide">
                            <div className="ti_content" style={{width: 4646, marginLeft: -1114.84}}>
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