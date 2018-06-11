import React, { Component } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import styles from '../styles/styles';


export default class GlobalNavPane extends Component {
  constructor(props){
    super(props);
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
      console.log("\nINFO GlobalNavPane :: onFocus =====>")
      const { onFocus } = this.props;
      if (onFocus) {
        console.log('INFO GlobalNavPane :: onFocus calling back from GlobalNavPane');
        onFocus();
      }
    }
  }

  onBlur = () => {
    console.log("\nINFO GlobalNavPane :: onBlur =====>")
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={this.onFocus()}
        // onPress={console.log("INFO GlobalNavPane :: TouchableWithoutFeedback onPress")}
        // onPressIn={console.log("INFO GlobalNavPane :: TouchableWithoutFeedback onPressIn")}
        // onPressOut={console.log("INFO GlobalNavPane :: TouchableWithoutFeedback onPressOut")}
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