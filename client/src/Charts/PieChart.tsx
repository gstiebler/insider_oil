import * as React from 'react';
import { NSAnalytics } from '../../../common/Interfaces';
import { DiscreteChart } from './DiscreteChart'
import { googleRef } from '../lib/Google';

interface IAppProps {
    analyticsData: NSAnalytics.IResult;
}

interface IAppState {
}

export class PieChart extends React.Component<IAppProps, IAppState> {

    public render(): React.ReactElement<any> {
        if(!googleRef.visualization) return <div/>

        const chartOptions = {
            chartArea: {width: '50%'},
            height: 500,
            pieSliceText: 'value-and-percentage'
        }        
        return (
            <DiscreteChart 
                analyticsData={this.props.analyticsData}
                gConstrutorFunctionName={'PieChart'}
                chartOptions={chartOptions}>
            </DiscreteChart>
        );
    }
}