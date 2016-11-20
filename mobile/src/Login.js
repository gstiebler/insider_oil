import React, { Component } from 'react';
import {
    TouchableHighlight,
    Text,
    View
} from 'react-native';
import { login } from './lib/session';

export class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    async onLoginClicked(navigator) {
        console.log('onLoginClicked')
        try {
            await login('gstiebler', 'aloalo35');
            this.props.onLogin();
        } catch(err) {
            console.log('erro: ', err);
        }
    }
 
    render() {
        return (
            <View style={{padding: 100}} >
                <TouchableHighlight onPress={ this.onLoginClicked.bind(this) } >
                    <Text>Hello Login Screen!</Text>
                </TouchableHighlight>
            </View>
        );
    }
}