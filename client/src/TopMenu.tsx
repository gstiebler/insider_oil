import * as React from 'react';
import * as session from './lib/session';

interface IAppProps {
    username: string;
}

interface IAppState {
}

export class TopMenu extends React.Component<IAppProps, IAppState> {

    public render(): React.ReactElement<any> {

        var userNameMenuItem = (
            <div className="col-md-3 col-no-padding">
            <div className="user-name">
                Olá 
                <span> {this.props.username} | </span>
                <a href="#" onClick={ session.logout }>sair</a>
            </div>
            </div>
        );

        var myDashboardMenuItem = (
        <div className="col-md-3 col-no-padding">
            <div className="top-menu-item">
            <div className="top-menu-icon window"></div>
            Meu Dashboard
            </div>
        </div>
        );

        var myAccountMenuItem = (
        <div className="col-md-3 col-no-padding">
            <div className="top-menu-item">
            <div className="top-menu-icon user"></div>
            <a href="/app/change_password">Minha Conta</a>
            </div>
        </div>
        );

        var sacMenuItem = (      
            <div className="col-md-3 col-no-padding">
            <div className="top-menu-item">
                <div className="top-menu-icon question"></div>
                SAC
            </div>
            </div>
        );

        var menu = (
            <div className="top-menu">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-4 col-hidden"></div>
                        <div className="col-no-padding col-md-8">
                            { userNameMenuItem }
                            { myDashboardMenuItem }
                            { myAccountMenuItem }
                            { sacMenuItem }
                        </div>
                    </div>
                </div>
            </div>
        );

        return menu;
    }
}