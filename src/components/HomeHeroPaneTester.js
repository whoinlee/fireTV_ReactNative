import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native';
import styles from '../styles/styles';
import config from '../config';

const RATIO               = config.density;
const TOP                 = config.initHomeHeroY/RATIO;

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

  onSelect = () => {
    console.log("INFO HomeHeroPane :: onSelect =====>")
  }

  onFocus = () => {
   // if (this.props.isFocused) {
      console.log("INFO HomeHeroPane :: onFocus =====>")
      const { onFocus } = this.props;
      if (onFocus) {
        //console.log('INFO HomeHeroPane :: onFocus calling back from HomeHeroPane');
        onFocus();
      }
    //}
  }

  onBlur = () => {
    console.log("INFO HomeHeroPane :: onBlur =====>")
  }

  render() {
    return (
        <TouchableNativeFeedback
          onPress={this.onSelect}
          onPressIn={this.onFocus}
          onPressOut={this.onBlur}
        >
          <View style={ {...this.props.styleObj, top:TOP} } >
              <Text style={styles.comment}>
                {this.constructor.name}
                {"\n\n" + this.today}
              </Text>
          </View>
        </TouchableNativeFeedback>
    );
  }
}

HomeHeroPane.propTypes = {
  styleObj: PropTypes.object,
  onFocus : PropTypes.func,
  onBlur : PropTypes.func,
  onSelect : PropTypes.func,
}

HomeHeroPane.defaultProps = {
  styleObj: StyleSheet.flatten(styles.homeHeroContainer),
  onFocus: () => {console.log("INFO HomeHeroPane :: please pass a function for onFocus")},
  onBlur: () => {console.log("INFO HomeHeroPane :: please pass a function for onBlur")},
  onSelect: () => {console.log("INFO HomeHeroPane :: please pass a function for onSelect")},
}