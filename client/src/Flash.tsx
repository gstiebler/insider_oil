import * as React from 'react';

var self:Flash = null

export function create(className:string, message:string) {
    self.setMessage(className, message);
}

interface IAppProps {
    timeout: number;
}

interface IAppState {
    message: string;
    className: string;
}

export class Flash extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            message: '',
            className: 'success'
        };
        self = this;
    }

    public setMessage(className:string, message:string) {
        this.setState({ className, message });
        setTimeout(this.cleanMessage.bind(this), this.props.timeout);
    }

    private cleanMessage() {
        this.setState({ message: '', className: '' });
    }

    public render(): React.ReactElement<any> {
        var { message } = this.state;
        var className = "alert alert-" + this.state.className;
        var result = null;
        if(message && message != '') {
            result = <div className={className} role="alert"
                        dangerouslySetInnerHTML={ {__html: message } }></div>
        }
        return result;
    }
}