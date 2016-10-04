import * as React from 'react';
import * as Flash from './Flash'
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import { browserHistory } from 'react-router';

interface IAppProps {
}

interface IAppState {
    currentPassword: string;
    newPassword1: string;
    newPassword2: string;
}

export class ChangePassword extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            currentPassword: '',
            newPassword1: '',
            newPassword2: ''
        };
    }

    private changePassword() {
        var { currentPassword, newPassword1, newPassword2 } = this.state;
        if(newPassword1 != newPassword2) {
            Flash.create('warning', 'As novas senhas diferem.');
            return;
        }
        
        server.changePassword(currentPassword, newPassword1)
            .then(this.onChangeSuccess.bind(this))
            .catch(showError.show);
    }

    private onChangeSuccess(result) {
        if(result.msg == 'OK') {
            Flash.create('success', 'A senha foi modificada com sucesso.' );
            browserHistory.push('/app/');
        } else if (result.errorMsg) {
            Flash.create('danger', result.errorMsg);
        }
    }

    public render(): React.ReactElement<any> {
        return ( 
            <div className="row">   
                <div className="form-horizontal" >
                    <div className="form-group">
                        <label className="control-label col-sm-2" for="current_password">Senha atual:</label>
                        <input className="col-sm-10 form-control" type="password" 
                            value={this.state.currentPassword}
                            onChange={(e:any) => {this.state.currentPassword = e.target.value; this.setState(this.state)}} />
                    </div>
                    
                    <div className="form-group">
                        <label className="control-label col-sm-2" for="new_password1">Nova senha:</label>
                        <input className="col-sm-10 form-control" type="password" value={this.state.newPassword1}
                            onChange={(e:any) => {this.state.newPassword1 = e.target.value; this.setState(this.state)}}/>
                    </div>
                        
                    <div className="form-group">
                        <label className="control-label col-sm-2" for="new_password2">Repita a nova senha:</label>
                        <input className="col-sm-10 form-control" type="password" value={this.state.newPassword2}
                            onChange={(e:any) => {this.state.newPassword2 = e. target.value; this.setState(this.state)}} />
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button className="btn btn-default" onClick={this.changePassword.bind(this)} >Mudar senha</button>
                        </div>
                    </div>
                </div>
            </div>    
        );
    }
}