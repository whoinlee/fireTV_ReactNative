import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import styles from '../styles/styles';
import config from '../config';


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
    //if (this.props.isFocused) {
      console.log("INFO HomeHeroPane :: onFocus =================================> HomeHeroPane")
      const { onFocus } = this.props;
      if (onFocus) {
        console.log('INFO HomeHeroPane :: onFocus calling back from HomeHeroPane');
        onFocus();
      }
   // }
  }

  onBlur = () => {
    console.log("INFO HomeHeroPane :: onBlur =================================> HomeHeroPane")
    const { onBlur } = this.props;
      if (onBlur) {
        console.log('INFO HomeHeroPane :: onBlur calling back from HomeHeroPane');
        onBlur();
      }
  }

  onSelect = () => {
    console.log("INFO HomeHeroPane :: onSelect =================================> HomeHeroPane")
    const { onSelect } = this.props;
      if (onSelect) {
        //console.log('INFO HomeHeroPane :: onSelect calling back from HomeHeroPane');
        onSelect();
      }
  }

  render() {
    return (
        <View>
            <Text style={styles.comment}>
              {this.constructor.name}
              {"\n\n" + this.today}
            </Text>
        </View>
    );
  }
}

HomeHeroPane.propTypes = {
  // styleObj: PropTypes.object,
  onFocus : PropTypes.func,
  onBlur : PropTypes.func,
  onSelect : PropTypes.func,
}

HomeHeroPane.defaultProps = {
  // styleObj: StyleSheet.flatten(styles.homeHeroContainer),
  onFocus: () => {console.log("INFO HomeHeroPane :: please pass a function for onFocus")},
  // onBlur: () => {console.log("INFO HomeHeroPane :: please pass a function for onBlur")},
  // onSelect: () => {console.log("INFO HomeHeroPane :: please pass a function for onSelect")},
}