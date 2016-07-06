import * as React from 'react';
import * as Flash from '../Flash'
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { postP } from '../lib/Server';
import { base64ToArray, removeBase64Header } from '../lib/BytesUtils';
import { formatExcelUploadResult } from '../lib/ModelViewUtils';


interface IAppProps {
    modelName: string;
}

interface IAppState {
}

export class ExcelUploadButton extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
        };
    }

    private onFileSelected(event) {
        let file = event.target.files[0];

        let reader = new FileReader();
        reader.onloadend = this.onFileLoad.bind(this, reader, file);
        // TODO read as byte array and avoid base64 conversion
        reader.readAsDataURL(file)
    }

    private onFileLoad(reader, file) {
        Flash.create('success', 'Arquivo carregado');
        var dsBase64 = reader.result;
        var trimmedBase64 = removeBase64Header(dsBase64);
        var convertedArray = base64ToArray(trimmedBase64);
        var params = {
             data: JSON.stringify(convertedArray),
             model: this.props.modelName
        }
        postP('/db_server/upload_file', params)
            .then(this.onUpload.bind(this))
            .catch(showError.show);
    }

    private onUpload(result) {
        Flash.create('success', formatExcelUploadResult(result));
    }

    public render(): React.ReactElement<any> {
        return ( 
            <div className="highlight" >
                <h4>Enviar arquivo Excel</h4>
                <input type="file" onChange={this.onFileSelected.bind(this)} />
            </div>  
        );
    }
}