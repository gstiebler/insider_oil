import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import * as server from './lib/Server';
import * as session from './lib/session';
import { TopMenu } from './Components/TopMenu'
import { SecondMenuBar } from './Components/SecondMenuBar'
import { AdminList } from './Admin/AdminList';
import { AdminGrid } from './Admin/AdminGrid';
import { AdminEdit } from './Admin/AdminEdit';
import { NewsEdit } from './Admin/NewsEdit';
import { ProjectEdit } from './Admin/ProjectEdit';
import { Publisher } from './Admin/Publisher/Publisher';
import { RequestsViewer } from './Admin/RequestsViewer';
import { ViewRecord } from './ViewRecord/ViewRecord';
import { OilFieldView } from './ViewRecord/OilFieldView';
import { BlockView } from './ViewRecord/BlockView';
import { ProjectView } from './ViewRecord/ProjectView';
import { Flash } from './Components/Flash';
import { ChangePassword } from './Pages/ChangePassword';
import { MapsAll } from './Pages/MapsAll';
import { Dashboard } from './Pages/Dashboard';
import { NewsSingle } from './Pages/NewsSingle';
import { PaginatedTableView } from './PaginatedTable/PaginatedTableView'; 
import { DataList } from './Pages/DataList'; 
import { Insights } from './Insights/Insights'; 
import { Observatory } from './Pages/Observatory'; 
import { CompaniesCards } from './Pages/PersonsByCompany'; 
import { NewsTicker } from './Components/NewsTicker'; 
import { Analytics } from './Pages/Analytics';  
import { TargetSales } from './Pages/TargetSales';  
import { SearchResults } from './Pages/SearchResults';  

const ReactGA = require('react-ga');
ReactGA.initialize('UA-80990869-2');

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
            ReactGA.set({ userId: response.id });
        }.bind(this), function(result) {
            if(result.status == 401) {
                window.location.replace('/login');
            }
        });

        if(props.location.pathname == 'app/' || props.location.pathname == 'app/index.html') {
            browserHistory.replace('/app/target_sales');
        }
    }

    public componentWillMount() {
        if( this.state.url ) {
            browserHistory.push(this.state.url);
        }
    }

    public render():React.ReactElement<any> {
        const footer = (
            <footer id="footer">
                <div className="container-1450">
                    <div className="row">
                        <div className=" col-lg-2 col-md-2 col-sm-3 col-xs-12">
                            <img src="images/logo_footer.png" className="img-responsive"/>
                        </div>
                        <div className=" col-lg-10 col-md-10 col-sm-9 col-xs-12">
                            <ul>
                                <li>&copy;2016. E&P Brasil - Serviços de Informação</li>
                                <li><a href="javascript:void(0);">Política de Privacidade</a></li>
                                <li><a href="javascript:void(0);">Termos e Condições</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        );

        return (
          <div>
            <NewsTicker />
            <div className="container-1450">
              <TopMenu username={this.state.username} ></TopMenu>
              <SecondMenuBar isAdmin={this.state.isAdmin} />
            </div>
            <div className="container-1450">
              <Flash timeout={5000}/>
              {this.props.children}
            </div>
            <br/>
            { footer }
          </div>
        );
    }
}

function logPageView() {
    const completeURL = window.location.pathname + window.location.search; 
    ReactGA.set({ page: completeURL });
    ReactGA.pageview(completeURL);
}

ReactDOM.render(
  <Router history={browserHistory} onUpdate={logPageView}>
    <Route path="/" component={InsiderOilApp}/>
    <Route path="/app" component={InsiderOilApp}>
      <Route path="dashboard" component={Dashboard}/>
      <Route path="admin" component={AdminList}/>
      <Route path="model_view" component={AdminGrid}/>
      <Route path="edit_item" component={AdminEdit}/>
      <Route path="create_news" component={NewsEdit}/>
      <Route path="create_project" component={ProjectEdit}/>
      <Route path="view_record" component={ViewRecord}/>
      <Route path="oil_field" component={OilFieldView}/>
      <Route path="block" component={BlockView}/>
      <Route path="view_project" component={ProjectView}/>
      <Route path="maps_all" component={MapsAll}/>
      <Route path="change_password" component={ChangePassword}/>
      <Route path="view_new" component={NewsSingle}/>
      <Route path="paginated_table_view" component={PaginatedTableView}/>
      <Route path="data_list" component={DataList}/>
      <Route path="insights" component={Insights}/>
      <Route path="insights_publisher" component={Publisher}/>
      <Route path="observatory" component={Observatory}/>
      <Route path="companies" component={CompaniesCards}/>
      <Route path="charts" component={Analytics}/>
      <Route path="target_sales" component={TargetSales}/>
      <Route path="requests_viewer" component={RequestsViewer}/>
      <Route path="search_results" component={SearchResults}/>
    </Route>
    <Route path="/app/index.html" component={InsiderOilApp}/>
  </Router>,
  document.getElementById('insideroilapp')
);
