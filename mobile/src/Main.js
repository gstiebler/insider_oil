/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView
} from 'react-native';
 
import { postJson, getJson } from './lib/network'
import { login } from './lib/session';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export class MainClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titles: ds.cloneWithRows([])
        };
    }

    componentDidMount() {
        this.testFetch();
    }
 
    async testFetch() {
        try {
            await login('gstiebler', 'aloalo35');
 
            let resInsights = await getJson('http://app.insideroil.com/insights', {});
            const titles = resInsights.recent.map(r => { return r.title });
            this.setState({ titles: ds.cloneWithRows(titles) });
            console.log(titles);      
        } catch(error) {
            console.error(error);
        }
    }
 
  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <ListView
          dataSource={this.state.titles}
          renderRow={(title) => <Text style={styles.welcome}>{title}</Text>}
        />
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});