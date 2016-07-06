import * as React from 'react';

interface IAppProps {
    onChange: any;
}

interface IAppState {
    imagePreviewUrl: any;
    file: string;
}

export class ImageUpload extends React.Component<IAppProps, IAppState> {
    constructor(props) {
        super(props);

        this.state = {
            file: '',
            imagePreviewUrl: ''
        };
    }

    private handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = this.onFileLoad.bind(this, reader, file);
        reader.readAsDataURL(file)
    }

    private onFileLoad(reader, file) {
        this.setState({
            file: file,
            imagePreviewUrl: reader.result
        });
        this.props.onChange(reader.result);
    }

    public render() {
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} />);
        }

        return (
            <div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input type="file" onChange={this.handleImageChange.bind(this)} />
                </form>
                {$imagePreview}
            </div>
        )
    }

}