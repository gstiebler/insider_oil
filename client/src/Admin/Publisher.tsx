import * as React from 'react';
import { IInsight } from '../../../common/Interfaces';
import { Link } from 'react-router';
import { ReorderableList } from './ReorderableList';

interface IAppProps {
}

interface IAppState {
}

export class Publisher extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
        };
    }

    public render(): React.ReactElement<any> {
        const data = [
            'Primeiro',
            'Segundo',
            'Terceiro',
        ];

		return (
            <div>
                FlexList
                <ReorderableList data={data}/>
                Section1
                <ReorderableList data={data}/>
                Carroussel
                <ReorderableList data={data}/>
            </div>);
    }
}