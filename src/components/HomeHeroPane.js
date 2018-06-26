import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  // TouchableWithoutFeedback,
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
    console.log("INFO HomeHeroPane :: onFocus =================================> HomeHeroPane")
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus();
    }
  }//onFocus

  onBlur = () => {
    console.log("INFO HomeHeroPane :: onBlur =================================> HomeHeroPane")
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur();
    }
  }//onBlur

  onSelect = () => {
    console.log("INFO HomeHeroPane :: onSelect =================================> HomeHeroPane")
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect();
    }
  }//onSelect

  render() {
    return (
      <View>
          <Text style={styles.comment}>
            Home Hero Pane
            {"\n\n" + this.today}
          </Text>
      </View>
    )
  }//render
}

HomeHeroPane.propTypes = {
  onFocus : PropTypes.func,
  onBlur : PropTypes.func,
  onSelect : PropTypes.func,
}

// HomeHeroPane.defaultProps = {
// }