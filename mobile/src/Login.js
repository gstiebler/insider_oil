import React, { Component } from 'react';
import {
    TouchableHighlight,
    Text,
    View,
    TextInput,
    StyleSheet,
    Image
} from 'react-native';
import { login } from './lib/session';

export class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errorMsg: null
        };
    }

    componentDidMount() {
    }

    async onLoginClicked(navigator) {
        console.log('onLoginClicked')
        try {
            await login(this.state.username, this.state.password);
            this.props.onLogin();
        } catch(err) {
            console.log('erro: ', err);
            this.setState({errorMsg: err});
        }
    }
 
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.mark} source={{uri: 'http://app.insideroil.com/images/logo.jpg'}} />
                        <TextInput 
                            style={[styles.input]}
                            placeholder="Usuário"
                            autoCapitalize="none"
                            value={this.state.username}
                            onChangeText={(username) => this.setState({username})}
                        />
                        <TextInput
                            password={true}
                            style={[styles.input]}
                            placeholder="Senha"
                            value={this.state.password}
                            onChangeText={(password) => this.setState({password})}
                        />
                <TouchableHighlight 
                        onPress={ this.onLoginClicked.bind(this) }  
                        style={styles.signin}>
                    <Text style={styles.whiteFont}>Login</Text>
                </TouchableHighlight>
                <Text style={{margin: 20}} >{this.state.errorMsg}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      //backgroundColor: 'transparent'
    },
    bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 400, // TODO get window size
        height: 600 // TODO get window size
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: .5,
        backgroundColor: 'transparent'
    },
    mark: {
        width: 264,
        height: 84,
        marginTop: 50,
        marginLeft: 20
    },
    signin: {
        backgroundColor: '#8EDB82',
        padding: 20,
        alignItems: 'center'
    },
    signup: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: .15
    },
    inputs: {
        marginTop: 10,
        marginBottom: 10,
        flex: .25
    },
    inputPassword: {
        marginLeft: 15,
        width: 20,
        height: 21
    },
    inputUsername: {
      marginLeft: 15,
      width: 20,
      height: 20
    },
    inputContainer: {
        padding: 10,
        borderWidth: 1,
        borderBottomColor: '#CCC',
        borderColor: 'transparent'
    },
    input: {
        alignSelf: 'stretch',
        height: 50,
        fontSize: 14,
        margin: 15,
    },
    forgotContainer: {
      alignItems: 'flex-end',
      padding: 15,
    },
    greyFont: {
      color: '#D8D8D8'
    },
    whiteFont: {
      color: '#FFF'
    }
})