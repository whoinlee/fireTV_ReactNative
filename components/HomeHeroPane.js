import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';
import styles from './styles/styles';


export default class HomeHeroPane extends Component {
  render() {
    return (
      <View style={styles.homeHeroContainer}>
        <Text style={styles.comment}>
          HomeHeroPane
        </Text>
      </View>
    );
  }
}