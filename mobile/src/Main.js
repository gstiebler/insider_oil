import React, { Component } from 'react';
import { 
    Navigator,
    TouchableHighlight,
    Text,
    View
} from 'react-native';
import { Insights } from './Insights';
import { Login } from './Login';
import { ViewInsight } from './ViewInsight';

const routes = [
    {title: 'Login', index: 0},
    {title: 'Insights', index: 1},
    {title: 'View Insight', index: 2},
];

export class MainClass extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    onLogin(navigator) {
        navigator.replace(routes[1]);
    }

    renderScene(route, navigator) {
        switch (route.index) {
            case 0:
                return  <Login onLogin={ this.onLogin.bind(this, navigator) } />
            case 1:
                return <Insights onInsightSelected={ id => { navigator.push({index: 2, id}); } } />
            case 2: 
                return <ViewInsight id={route.id} />
        }
    }
 
    render() {
        return (
            <Navigator
              initialRoute={routes[0]}
              renderScene={this.renderScene.bind(this)}
            />
        );
    }
}