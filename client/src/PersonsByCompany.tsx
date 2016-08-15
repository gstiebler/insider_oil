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
                <Card> </Card>
            );
        }

		return (
            <div>
            { cards }
            </div>
		);
    }
}