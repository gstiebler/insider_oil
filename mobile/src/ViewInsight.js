import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export class ViewInsight extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}
 
    render() {
        console.log('rendering view insight', this.props.id);
        return (
            <View>
                <Text> Insight id: {this.props.id} </Text>
            </View>
        );
    }
}