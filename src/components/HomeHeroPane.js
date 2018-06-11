import React, { Component } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import styles from '../styles/styles';


export default class HomeHeroPane extends Component {
  constructor(props){
    super(props);
    this.today = new Date();
    this.preStr = (this.today.getMonth() < 9)? "0" : "";
  }

  onLeft = () => {
    console.log("INFO HomeHeroPane :: onLeft")
  }

  onRight = () => {
    console.log("INFO HomeHeroPane :: onRight")
  }

  onDown = () => {
    console.log("INFO HomeHeroPane :: onDown")
  }

  onUp = () => {
    console.log("INFO HomeHeroPane :: onUp")
  }

  onFocus = () => {
    if (this.props.isFocused) {
      console.log("\nINFO HomeHeroPane :: onFocus =====>")
      const { onFocus } = this.props;
      if (onFocus) {
        console.log('INFO HomeHeroPane :: onFocus calling back from HomeHeroPane');
        onFocus();
      }
    }
  }

  onBlur = () => {
    console.log("\nINFO HomeHeroPane :: onBlur =====>")
  }

  render() {
    return (
      <TouchableWithoutFeedback 
        onPress={this.onFocus()}
        // onPress={console.log("INFO HomeHeroPane :: TouchableWithoutFeedback onPress")}
        // onPressIn={console.log("INFO HomeHeroPane :: TouchableWithoutFeedback onPressIn")}
        // onPressOut={console.log("INFO HomeHeroPane :: TouchableWithoutFeedback onPressOut")}
      >
        <View>
            <Text style={styles.comment}>
              {this.constructor.name}
              {"\n\n" + this.today}
            </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}