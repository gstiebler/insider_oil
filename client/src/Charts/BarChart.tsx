import * as React from 'react';
import { NSAnalytics } from '../../../common/Interfaces';
import { DiscreteChart } from './DiscreteChart'
import { googleRef } from '../lib/Google';

interface IAppProps {
    analyticsData: NSAnalytics.IResult;
    axisName?: string;
}

interface IAppState {
}

export class BarChart extends React.Component<IAppProps, IAppState> {

    public render(): React.ReactElement<any> {
        const chartOptions = {
            chartArea: {width: '50%'},
            height: 500,
            animation:{
                duration: 500,
                easing: 'inAndOut',
            },
            hAxis: {
                title: 'Quantidade',
                minValue: 0
            },
            vAxis: {
                title: this.props.axisName
            }
        };   
        return (
            <DiscreteChart 
                analyticsData={this.props.analyticsData}
                gConstrutorFunctionName={'BarChart'}
                chartOptions={chartOptions}>
            </DiscreteChart>
        );
    }
}