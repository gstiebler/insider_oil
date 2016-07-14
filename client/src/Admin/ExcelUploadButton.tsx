import * as React from 'react';
import * as Flash from '../Flash'
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { postP } from '../lib/Server';
import { ButtonUploadFileAsArray } from './ButtonUploadFileAsArray';
import { formatExcelUploadResult } from '../lib/ModelViewUtils';


interface IAppProps {
    modelName: string;
}

interface IAppState {}

export class ExcelUploadButton extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);
    }
    
    private onFileLoad(array: number[]) {
        Flash.create('success', 'Arquivo pronto para ser enviado');
        var params = {
             data: JSON.stringify(array),
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
                <ButtonUploadFileAsArray onFileLoad={this.onFileLoad.bind(this)} />
            </div>  
        );
    }
}