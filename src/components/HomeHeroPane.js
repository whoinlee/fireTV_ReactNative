import React, { Component } from 'react';
import {
  Text,
  // TouchableWithoutFeedback,
  TouchableNativeFeedback,
  View
} from 'react-native';
import styles from '../styles/styles';


export default class HomeHeroPane extends Component {
  constructor(props){
    super(props);
    this.today = new Date();
    this.preStr = (this.today.getMonth() < 9)? "0" : "";
  }

  onFocus = () => {
    console.log("INFO HomeHeroPane :: onFocus")
  }

  onBlur = () => {
    console.log("INFO HomeHeroPane :: onBlur")
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

  render() {
    return (
      <TouchableNativeFeedback onPress={console.log("INFO HomeHeroPane :: onPress")}>
        <View>
            <Text style={styles.comment}>
              {this.constructor.name}
              {"\n\n" + this.today}
            </Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
}