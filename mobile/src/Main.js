import React, { Component } from 'react';
import { 
    Navigator,
    TouchableHighlight,
    Text,
    View
} from 'react-native';
import { Insights } from './Insights';
import { Login } from './Login';

const routes = [
    {title: 'First Scene', index: 0},
    {title: 'Second Scene', index: 1},
];

export class MainClass extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    onLogin(navigator) {
        console.log('onLogin');
        navigator.replace(routes[1]);
    }

    renderScene(route, navigator) {
        if(route.index == 0) {
            return (
                <Login onLogin={ this.onLogin.bind(this, navigator) } />
            );
        } else {
            return <Insights />
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