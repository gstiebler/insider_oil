import * as React from 'react';
import * as showError from '../lib/ShowError';
import { ProjectSearch } from '../ProjectSearch'

interface IAppProps {
    value: any[];
    onChange: any;
}

interface IAppState {
    projects: any[];
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
        this.props.onChange(this.state.projects);
        this.setState(this.state);
    };
    
    private onProjectSelected(selectedItem) {
        selectedItem.description = this.state.description;
        this.state.projects.push(selectedItem);
        this.state.description = "";
        this.props.onChange(this.state.projects);
        this.setState(this.state);
    };

    private onDescriptionChanged(event) {
        this.state.description = event.target.value;
        this.setState(this.state);
    }
    
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
                                        <td>Descrição: <input type="text" value={this.state.description} onChange={ this.onDescriptionChanged.bind(this) } /></td>
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