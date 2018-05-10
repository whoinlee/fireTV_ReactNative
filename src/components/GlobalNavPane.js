import React, { Component } from 'react';
import {
  Text,
  // TouchableHighlight,
  // TouchableWithoutFeedback,
  TouchableNativeFeedback,
  View
} from 'react-native';
import styles from '../styles/styles';


export default class GlobalNavPane extends Component {
  constructor(props){
    super(props);
  } 

  render() {
    return (
      <TouchableNativeFeedback>
        <View>
            <Text style={styles.comment}>
              {this.constructor.name}
            </Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

/*
 // TouchableWithoutFeedback,
         //onPress={(e) => this.getNodeInfo(e)} 
        //onTouchableHandleActivePressIn={console.log('INFO GlobalNavPane :: test pressIn')} 
        //onTouchableHandleActivePressOut={console.log('INFO GlobalNavPane :: test pressOut')} 
*/