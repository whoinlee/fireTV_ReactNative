import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import styles from './styles/styles';


export default class HomeHeroPane extends Component {
  render() {
    return (
      <View style={styles.homeHeroContainer}>
        <TouchableHighlight>
          <Text style={styles.comment}>
            HomeHeroPane
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}