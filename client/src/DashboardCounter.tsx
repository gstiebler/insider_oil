import * as React from 'react';

interface IAppProps {
    count: number;
}

interface IAppState {
}

export class DashboardCounter extends React.Component<IAppProps, IAppState> {

    private componentDidUpdate() {
        const countRef = this.refs['countRef'];
        const this_ = $(countRef);
        this_.prop('Counter', 0).animate({
            Counter: this_.text()
        }, {
            duration: 2000,
            easing: 'swing',
            step: function (now) {
                this_.text(Math.ceil(now));
            }
        });
    }

    public render(): React.ReactElement<any> {
        return <span className="count" ref="countRef" >{this.props.count}</span>
    }
}