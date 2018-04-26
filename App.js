/**
 * POC for fireTV in React Native
 * https://github.com/whoinlee/fireTV_ReactNative
 * by WhoIN Lee :: whoin.lee@nbcuni.com
 */

import React, { Component } from 'react';
import {
  Platform,
  Text,
  View
} from 'react-native';
//
import styles from './components/styles/styles';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Press menu button for dev menu',
});


type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native for Android TV - 0426!
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}