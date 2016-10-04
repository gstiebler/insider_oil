import * as React from 'react';
import * as Modal from 'react-modal';
import { postP } from './lib/Server';
import * as showError from './lib/ShowError';
import * as Flash from './Flash'
import { SendErrorReport } from '../../common/NetworkInterfaces'

interface IAppProps {
    objectLabel: string;
    location?: any;
    url: string;
}

interface IAppState {
    modalIsOpen: boolean;
    description: string;
}

export class ErrorReport extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            modalIsOpen: false,
            description: ''
        };
    }

    private closeModal() {
        this.state.modalIsOpen = false;
        this.setState(this.state);
    }

    private openModal() {
        this.state.modalIsOpen = true;
        this.setState(this.state);
    }

    private sendReport() {
        const report:SendErrorReport.req = { 
            url: this.props.url,
            description: this.state.description 
        };
        postP('/send_error_report', report)
            .then(this.onReportSent.bind(this))
            .catch(showError.show);

        this.state.modalIsOpen = false;
        this.setState(this.state);
    }

    private onReportSent(res: SendErrorReport.res) {
        Flash.create('success', 'Erro enviado com sucesso' );
    }

    public render(): React.ReactElement<any> {
        return (
            <div>
                <button className="btn btn-default" 
                        onClick={this.openModal.bind(this) }>Reportar erro</button>
                <Modal
                    className="Modal__Bootstrap modal-dialog"
                    closeTimeoutMS={150}
                    isOpen={this.state.modalIsOpen}
                    >
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this.closeModal.bind(this)}>
                                <span aria-hidden="true">&times; </span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h4 className="modal-title">Reportar erro</h4>
                        </div>
                        <div className="modal-body">
                            <h4>Objeto: <b>{this.props.objectLabel}</b></h4><hr/>
                            Descrição:
                            <textarea type="text" rows={8} className="form-control"
                                      onChange={(e:any) => { this.state.description = e.target.value; }} /> 
                        </div>
                        <div className="modal-footer">
                            <button type="button" 
                                    className="btn btn-default" 
                                    onClick={this.closeModal.bind(this)} >Fechar</button>
                            <button type="button" 
                                    className="btn btn-primary"
                                    onClick={this.sendReport.bind(this)} >Enviar</button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}