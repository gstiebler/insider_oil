import * as React from 'react';

function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

function base64ToArray( base64 ) {
    var base64str = atob(base64);
    var bytes = new Array( base64str.length );
    for(var i = 0; i < base64str.length; i++) {
        bytes[i] = base64str.charCodeAt(i);
    }
    return bytes;
}

interface IAppProps {
    value: any;
    onChange: any;
}

interface IAppState {
    imageBase64: any;
    file: string;
}

export class ImageUpload extends React.Component<IAppProps, IAppState> {
    constructor(props) {
        super(props);

        this.state = {
            file: '',
            imageBase64: ''
        };
    }

    private componentWillReceiveProps(nextProps:IAppProps) {
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
        var trimmedBase64 = dsBase64.substring(dsBase64.search(';base64,') + 8, dsBase64.length);
        this.props.onChange(base64ToArray(trimmedBase64));
    }

    public render() {
        let {imageBase64} = this.state;
        let imagePreview = null;
        if (imageBase64) {
            imagePreview = (<img src={imageBase64} />);
        }

        return (
            <div>
                <input type="file" onChange={this.handleImageChange.bind(this)} />
                {imagePreview}
            </div>
        )
    }

}