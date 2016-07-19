import * as React from 'react';
import * as Modal from 'react-modal';

interface IAppProps {
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
        this.setState({modalIsOpen: false});
    }

    
    private openModal() {
        this.setState({modalIsOpen: true});
    }

    public render(): React.ReactElement<any> {
        return (
            <div>
                <button onClick={this.openModal.bind(this)}>Open Modal</button>
                <Modal
                    isOpen={this.state.modalIsOpen}>

                    <h2 ref="subtitle">Hello</h2>
                    <button onClick={this.closeModal.bind(this)}>close</button>
                    <div>I am a modal</div>
                    <form>
                        <input />
                        <button>tab navigation</button>
                        <button>stays</button>
                        <button>inside</button>
                        <button>the modal</button>
                    </form>
                </Modal>
            </div>
        );
    }
}