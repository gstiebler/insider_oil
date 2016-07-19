import * as React from 'react';
import * as Modal from 'react-modal';

interface IAppProps {
    objectLabel: string;
    location: any;
    url: string;
}

interface IAppState {
    modalIsOpen: boolean;
}

export class ErrorReport extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            modalIsOpen: false
        };
    }

    private closeModal() {
        this.setState({ modalIsOpen: false });
    }

    private openModal() {
        this.setState({ modalIsOpen: true });
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
                            <textarea type="text" rows={8} className="form-control" /> 
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" onClick={this.closeModal.bind(this)} >Fechar</button>
                            <button type="button" className="btn btn-primary" >Enviar</button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}