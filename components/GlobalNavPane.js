import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';
import styles from './styles/styles';


export default class GlobalNavPane extends Component<Props> {
  render() {
    return (
      <View style={styles.globalNavContainer}>
        <Text style={styles.comment}>
          GlobalNavPane
        </Text>
      </View>
    );
  }
}