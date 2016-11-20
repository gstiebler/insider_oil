import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableHighlight
} from 'react-native';
import { postJson, getJson } from './lib/network'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export class Insights extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titles: ds.cloneWithRows([])
        };
    }

    componentDidMount() {
        this.fetchInsights();
    }
 
    async fetchInsights() {
        try {
            let resInsights = await getJson('http://app.insideroil.com/insights', {});
            this.setState({ titles: ds.cloneWithRows(resInsights.recent) });
        } catch(error) {
            console.error(error);
        }
    }

    onInsightSelected(id) {
        this.props.onInsightSelected(id);
    }

    renderRow(insight) {
        return (
            <TouchableHighlight 
                        onPress={ this.onInsightSelected.bind(this, insight.id) } >
                <Text style={styles.welcome}>{insight.title}</Text>
            </TouchableHighlight>
        );
    }
 
    render() {
        return (
            <View style={styles.container}>
              <Text style={styles.welcome}>
                  Welcome to React Native!
              </Text>
              <ListView
                  dataSource={this.state.titles}
                  renderRow={this.renderRow.bind(this)}
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