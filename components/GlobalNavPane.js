import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import styles from './styles/styles';


export default class GlobalNavPane extends Component<Props> {
  render() {
    return (
      <View style={styles.globalNavContainer}>
        <TouchableHighlight>
          <Text style={styles.comment}>
            GlobalNavPane-0427-15:40
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}