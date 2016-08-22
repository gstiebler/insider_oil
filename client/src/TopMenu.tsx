import * as React from 'react';
import * as session from './lib/session';
import { Link, browserHistory } from 'react-router';
import { ProjectSearch } from './ProjectSearch'
import { IFrontEndProject } from '../../common/Interfaces';

interface IAppProps {
    username: string;
}

interface IAppState {
}

export class TopMenu extends React.Component<IAppProps, IAppState> {    
    
    private onProjectSelected(selectedItem:IFrontEndProject) {
        const url = '/app/view_record?source=' + selectedItem.model + '&id=' + selectedItem.id;
        browserHistory.push(url);
    };

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

        var myAccountMenuItem = (
            <div className="col-md-3 col-no-padding">
                <div className="top-menu-item">
                    <div className="top-menu-icon user"></div>
                    <Link to={"/app/change_password"}>Minha Conta</Link>
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

        const search = (
            <div className="col-md-3 col-no-padding">
                <div style={{ padding: 10, width: 150 }}>
                    <ProjectSearch onItemSelected={ this.onProjectSelected.bind(this) } />
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
                            { myAccountMenuItem }
                            { sacMenuItem }
                            { search }
                        </div>
                    </div>
                </div>
            </div>
        );

        return menu;
    }
}