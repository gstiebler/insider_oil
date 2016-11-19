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
 
async function postJson(url, params) {
    let opts = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    };
    let response = await fetch(url, opts);
    return await response.json();
}
 
async function getJson(url, queryParams) {
    const queryStrs = [];
    for(let queryParam in queryParams) {
        queryStrs.push(queryParam + '=' + queryParams[queryParam]);
    }
    let completeUrl = url;
    if(queryStrs.length > 0) {
        const queryStr = queryStrs.join('&');
        completeUrl += '?' + queryStr;
    }
    console.log('complete url: ' + completeUrl);
    let response = await fetch(completeUrl);
    return await response.json();
}
 
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
            let responseJson = await postJson('http://app.insideroil.com/login_rest', {
                username: 'gstiebler',
                password: 'aloalo35'
              });
            console.log(responseJson);
            this.token = responseJson.token;
 
            let resInsights = await getJson('http://app.insideroil.com/insights', { token: this.token });
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