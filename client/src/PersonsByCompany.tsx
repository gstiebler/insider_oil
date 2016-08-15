import * as React from 'react';
import { Card } from './Card'

interface IAppProps {
}

interface IAppState {
}

export class PersonsByCompany extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
    }

    public render(): React.ReactElement<any> {		
        const cards: React.ReactElement<any>[] = [];
        for(var i = 0; i < 10; i++) {
            cards.push(
                <Card key={i}> </Card>
            );
        }

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