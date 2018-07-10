import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  // TouchableWithoutFeedback,
  View
} from 'react-native';
import styles from '../styles/styles';
import config from '../config';


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

/*
  // onFocus = () => {
  //   // console.log("INFO GlobalNavPane :: onFocus =================================> GlobalNavPane")
  //   const { onFocus } = this.props;
  //   if (onFocus) {
  //     onFocus();
  //   }
  // }//onFocus

  // onBlur = () => {
  //   // console.log("INFO GlobalNavPane :: onBlur =================================> GlobalNavPane")
  //   const { onBlur } = this.props;
  //   if (onBlur) {
  //     onBlur();
  //   }
  // }//onBlur

  // onSelect = () => {
  //   // console.log("INFO GlobalNavPane :: onSelect =================================> GlobalNavPane")
  //   const { onSelect } = this.props;
  //   if (onSelect) {
  //     onSelect();
  //   }
  // }//onSelect
*/

  render() {
    return (
      <View>
          <Text style={styles.comment}>
            Global Navigation Pane
          </Text>
      </View>
    )
  }//render
};