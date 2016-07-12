import * as React from 'react';
import * as showError from '../lib/ShowError';
import { ProjectSearch } from '../ProjectSearch'
import { IFrontEndProject } from '../../../common/Interfaces';

interface IAppProps {
    value: IFrontEndProject[];
    onChange: any;
}

interface IAppState {
    projects: IFrontEndProject[];
    selectedProject: any;
    description: string;
}

export class ListOfProjects extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            projects: props.value ? props.value : [],
            selectedProject: {},
            description: ''
        };
    }

    private removeItem(index) {
        this.state.projects.splice(index, 1);
        this.setState(this.state);
        this.props.onChange(this.state.projects);
    };
    
    private onProjectSelected(selectedItem:IFrontEndProject) {
        selectedItem.description = this.state.description;
        this.state.projects.push(selectedItem);
        this.state.description = "";
        this.setState(this.state);
        this.props.onChange(this.state.projects);
    };
    
    public render(): React.ReactElement<any> {
        var projects = this.state.projects.map((project, index) => {
            return (
                <tr key={'item' + index}>
                    <td>{project.name}</td>
                    <td>{project.description}</td>
                    <td><button className="btn btn-default" onClick={ this.removeItem.bind(this, index) }>Remover</button></td>
                </tr>
            );  
        });

        return (
            <table className="table">
                <tbody>
                    <tr>
                        <td width="300">
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Projeto</th>
                                        <th>Descrição</th>
                                    </tr>
                                    {projects}
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td><ProjectSearch onItemSelected={ this.onProjectSelected.bind(this) } /></td>
                                    </tr>
                                    <tr>
                                        <td>Descrição: <input type="text" defaultValue={this.state.description} 
                                                                          onChange={ (e) => {this.state.description = e.target.value;} } /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}