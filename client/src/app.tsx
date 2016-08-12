import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import * as server from './lib/Server';
import * as session from './lib/session';
import { TopMenu } from './TopMenu'
import { SecondMenuBar } from './SecondMenuBar'
import { AdminList } from './Admin/AdminList';
import { AdminGrid } from './Admin/AdminGrid';
import { AdminEdit } from './Admin/AdminEdit';
import { NewsEdit } from './Admin/NewsEdit';
import { AdminCreate } from './Admin/AdminCreate';
import { Publisher } from './Admin/Publisher/Publisher';
import { ViewRecord } from './ViewRecord/ViewRecord';
import { OilFieldView } from './ViewRecord/OilFieldView';
import { Flash } from './Flash';
import { ChangePassword } from './ChangePassword';
import { MapsAll } from './MapsAll';
import { Dashboard } from './Dashboard';
import { NewsSingle } from './NewsSingle';
import { PaginatedTableView } from './PaginatedTableView'; 
import { DataList } from './DataList'; 
import { Insights } from './Insights/Insights'; 
import { Observatory } from './Observatory'; 

interface IAppProps {
    model: string;
    location: any;
}

interface IAppState {
    username: string;
    isAdmin: boolean;
    url: string;
}


class InsiderOilApp extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            isAdmin: false,
            username: '',
            url: props.location.query.url
        };

        var token = props.location.query.token;
        if( token ) {
            session.login( token );
        } else {
            token = session.getToken();
            if(!token) {
                window.location.replace('/login');
                return;
            }
        }
      
        server.getUserDetails(function(response) {
            this.setState({
                username: response.login,
                isAdmin: response.admin
            });
        }.bind(this), function(result) {
            if(result.status == 401) {
                browserHistory.push('/');
            }
        });

        if(props.location.pathname == 'app/' || props.location.pathname == 'app/index.html') {
            browserHistory.replace('/app/insights');
        }
    }

    public componentWillMount() {
        if( this.state.url ) {
            browserHistory.push(this.state.url);
        }
    }

    public render():React.ReactElement<any> {
        return (
          <div>
            <div className="container-1450">
              <TopMenu username={this.state.username} ></TopMenu>
              <SecondMenuBar isAdmin={this.state.isAdmin} />
            </div>
            <div className="container-1450">
              <Flash timeout={5000}/>
              {this.props.children}
            </div>
          </div>
        );
    }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={InsiderOilApp}/>
    <Route path="/app" component={InsiderOilApp}>
      <Route path="dashboard" component={Dashboard}/>
      <Route path="admin" component={AdminList}/>
      <Route path="model_view" component={AdminGrid}/>
      <Route path="edit_item" component={AdminEdit}/>
      <Route path="create_news" component={NewsEdit}/>
      <Route path="create_item" component={AdminCreate}/>
      <Route path="view_record" component={ViewRecord}/>
      <Route path="oil_field" component={OilFieldView}/>
      <Route path="maps_all" component={MapsAll}/>
      <Route path="change_password" component={ChangePassword}/>
      <Route path="view_new" component={NewsSingle}/>
      <Route path="paginated_table_view" component={PaginatedTableView}/>
      <Route path="data_list" component={DataList}/>
      <Route path="insights" component={Insights}/>
      <Route path="insights_publisher" component={Publisher}/>
      <Route path="observatory" component={Observatory}/>
    </Route>
    <Route path="/app/index.html" component={InsiderOilApp}/>
  </Router>,
  document.getElementById('insideroilapp')
);
