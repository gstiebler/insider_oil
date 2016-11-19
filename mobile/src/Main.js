import React, { Component } from 'react';
import { 
    Navigator,
    TouchableHighlight,
    Text,
    View
} from 'react-native';
import { Insights } from './Insights';
import { login } from './lib/session';

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

    async onLoginClicked(navigator) {
        console.log('***    onLoginClicked');
        await login('gstiebler', 'aloalo35');
        navigator.replace(routes[1]);
    }

    renderScene(route, navigator) {
        console.log('renderScene', route);
        if(route.index == 0) {
            return (
                <View style={{padding: 100}} >
                    <TouchableHighlight onPress={ this.onLoginClicked.bind(this, navigator) } >
                        <Text>Hello {route.title}!</Text>
                    </TouchableHighlight>
                </View>
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