import * as React from 'react';
import * as Flash from '../Components/Flash'
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { postP } from '../lib/Server';
import { ButtonUploadFile } from './ButtonUploadFile';
import { formatExcelUploadResult } from '../lib/ModelViewUtils';
import { base64ToArray } from '../lib/BytesUtils';

interface IAppProps {
    modelName: string;
}

interface IAppState {}

export class ExcelUploadButton extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);
    }
    
    private onFileLoad(base64Str: string) {
        var convertedArray = base64ToArray(base64Str);
        Flash.create('success', 'Arquivo pronto para ser enviado');
        var params = {
             data: JSON.stringify(convertedArray),
             model: this.props.modelName
        }
        postP('/db_server/upload_file', params)
            .then(res => Flash.create('success', formatExcelUploadResult(res)))
            .catch(showError.show);
    }

    public render(): React.ReactElement<any> {
        return ( 
            <div className="highlight" >
                <h4>Enviar arquivo Excel</h4>
                <ButtonUploadFile onFileLoad={this.onFileLoad.bind(this)} />
            </div>  
        );
    }
}