import React, { Component } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  //TouchableNativeFeedback,
  View
} from 'react-native';
import styles from '../styles/styles';


export default class GlobalNavPane extends Component {
  constructor(props){
    super(props);
  } 

  onFocus = () => {
    console.log("INFO GlobalNavPane :: onFocus")
  }

  onBlur = () => {
    console.log("INFO GlobalNavPane :: onBlur")
  }

  onLeft = () => {
    console.log("INFO GlobalNavPane :: onLeft")
  }

  onRight = () => {
    console.log("INFO GlobalNavPane :: onRight")
  }

  onDown = () => {
    console.log("INFO GlobalNavPane :: onDown")
  }

  onUp = () => {
    console.log("INFO GlobalNavPane :: onUp")
  }

  // onSelect = () => {
  //   console.log("INFO GlobalNavPane :: onBlur")
  // }

  onFocus = () => {
    if (this.props.isFocused) {
      console.log("INFO GlobalNavPane :: onFocus")
      const { onFocus } = this.props;
      if (onFocus) {
        console.log('INFO GlobalNavPane :: onFocus calling back from GlobalNavPane');
        onFocus();
      }
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={this.onFocus()}
        // onTouchableHandleActivePressIn={console.log("INFO GlobalNavPane :: onTouchableHandleActivePressIn")}
        // onTouchableHandleActivePressOut={console.log("INFO GlobalNavPane :: onTouchableHandleActivePressOut")}
        // onTouchableHandlePress={console.log("INFO GlobalNavPane :: onTouchableHandleActivePress")}
      >
        <View>
            <Text style={styles.comment}>
              {this.constructor.name}
            </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

/*
 // TouchableWithoutFeedback,
        //onPress={(e) => this.getNodeInfo(e)} 
        //onTouchableHandleActivePressIn={console.log('INFO GlobalNavPane :: test pressIn')} 
        //onTouchableHandleActivePressOut={console.log('INFO GlobalNavPane :: test pressOut')} 
        //onPressIn
        //onPressOut
*/