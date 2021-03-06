import * as React from 'react';
import { arrayBufferToBase64, base64ToArray, removeBase64Header } from '../lib/BytesUtils';

interface IAppProps {
    onChange: any;
    value?: any;
    imgPath?: string;
}

interface IAppState {
    imageBase64: any;
    file: string;
}

export class ImageShow extends React.Component<IAppProps, IAppState> {
    constructor(props) {
        super(props);

        this.state = {
            file: '',
            imageBase64: null
        };
    }

    private componentWillReceiveProps(nextProps:IAppProps) {
        if(!nextProps.value)
            return;
            
        var contentType = 'image/JPEG';
        var base64Header = 'data:' + contentType + ';base64,';
        this.state.imageBase64 = base64Header + arrayBufferToBase64(nextProps.value);
        this.setState(this.state);
    }

    private handleImageChange(e) {
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = this.onFileLoad.bind(this, reader, file);
        reader.readAsDataURL(file)
    }

    private onFileLoad(reader, file) {
        this.setState({
            file: file,
            imageBase64: reader.result
        });

        var dsBase64 = reader.result;
        var trimmedBase64 = removeBase64Header(dsBase64);
        this.props.onChange(base64ToArray(trimmedBase64));
    }

    public render() {
        let {imageBase64} = this.state;
        let imagePreview = null;
        if (imageBase64) {
            imagePreview = (<img src={imageBase64} />);
        } else {
            imagePreview = (<img src={this.props.imgPath} />);
        }

        return (
            <div>
                <input type="file" onChange={this.handleImageChange.bind(this)} />
                {imagePreview}
            </div>
        )
    }

}