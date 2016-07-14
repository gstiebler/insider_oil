import * as React from 'react';
import * as showError from '../lib/ShowError';
import { postP } from '../lib/Server';
import { ReadFileToBase64Str } from '../lib/BytesUtils';


interface IAppProps {
    onFileLoad: any;
}

interface IAppState {
}

export class ButtonUploadFile extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
        };
    }

    private onFileSelected(event) {
        let file = event.target.files[0];
        ReadFileToBase64Str(file)
            .then(this.props.onFileLoad)
            .catch(showError.show);
    }

    public render(): React.ReactElement<any> {
        return ( 
            <div className="highlight" >
                <input type="file" onChange={this.onFileSelected.bind(this)} />
            </div>  
        );
    }
}