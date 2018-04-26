import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';
import styles from './styles/styles';

type Props = {};
export default class HomeShelvesPane extends Component<Props> {
  render() {
    return (
      <View style={styles.homeShelvesContainer}>
        <Text style={styles.comment}>
          HomeShelvesPane
        </Text>
      </View>
    );
  }
}