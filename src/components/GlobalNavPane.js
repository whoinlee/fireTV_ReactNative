import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableWithoutFeedback,
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

  // onSelect = () => {
  //   console.log("INFO GlobalNavPane :: onBlur")
  // }

  onFocus = () => {
   //if (this.props.isFocused) {
      console.log("INFO GlobalNavPane :: onFocus =================================> GlobalNavPane")
      const { onFocus } = this.props;
      if (onFocus) {
        // console.log('INFO GlobalNavPane :: onFocus calling back from GlobalNavPane');
        onFocus();
      }
    //}
  }

  onBlur = () => {
    console.log("INFO GlobalNavPane :: onBlur =================================> GlobalNavPane")
    const { onBlur } = this.props;
      if (onBlur) {
        // console.log('INFO GlobalNavPane :: onBlur calling back from GlobalNavPane');
        onBlur();
      }
  }

  onSelect = () => {
    console.log("INFO GlobalNavPane :: onSelect =================================> GlobalNavPane")
    const { onSelect } = this.props;
      if (onSelect) {
        //console.log('INFO GlobalNavPane :: onSelect calling back from HomeHeroPane');
        onSelect();
      }
  }

  render() {
    return (
        <View>
            <Text style={styles.comment}>
              Global Navigation Pane
            </Text>
        </View>
    );
  }
}

GlobalNavPane.propTypes = {
  onFocus : PropTypes.func,
  onBlur : PropTypes.func,
  onSelect : PropTypes.func,
}

GlobalNavPane.defaultProps = {
  onFocus: () => {console.log("INFO GlobalNavPane :: please pass a function for onFocus")},
  // onBlur: () => {console.log("INFO GlobalNavPane :: please pass a function for onBlur")},
  // onSelect: () => {console.log("INFO GlobalNavPane :: please pass a function for onSelect")},
}