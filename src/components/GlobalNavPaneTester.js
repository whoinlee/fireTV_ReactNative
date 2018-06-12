import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TVEventHandler,
  View
} from 'react-native';
import styles from '../styles/styles';
import config from '../config';

const RATIO               = config.density;
const TOP                 = config.initGlobalNavY/RATIO;


export default class GlobalNavPane extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    //console.log('INFO GlobalNavPane :: componentDidMount, this.tvEventHandler ? ' + this.tvEventHandler);
    //this._enableTVEventHandler()
  }//componentDidMount

  componentWillUnmount() {
    //this._disableTVEventHandler()
  }//componentWillUnmount

  _enableTVEventHandler() {
    this.tvEventHandler = new TVEventHandler()
    console.log('INFO GlobalNavPane :: _enableTVEventHandler, this.tvEventHandler ? ' + this.tvEventHandler);
    //
    this.tvEventHandler.enable(this, function(cmp, evt) {
      console.log('INFO GlobalNavPane :: _enableTVEventHandler, cmp? : ' + cmp.constructor.name);  //GlobalNavPane
      //-- sometimes works, sometimes doesn't ?????
      if (evt) {
        console.log('INFO GlobalNavPane :: _enableTVEventHandler, evt.eventType? : ' + evt.eventType);
        console.log('INFO GlobalNavPane :: _enableTVEventHandler, evt.tag? : ' + evt.tag);
        switch (evt.eventType) {
          case 'blur':
            console.log('INFO GlobalNavPane :: blur');
            break;
          case 'focus':
            console.log('INFO GlobalNavPane :: focus');
            break;
          case 'playPause':
            console.log('INFO GlobalNavPane :: playPause');
            break;
          case 'rewind':
            console.log('INFO GlobalNavPane :: rewind');
            break;
          case 'fastForward':
            console.log('INFO GlobalNavPane :: fastForward');
            break;
          case 'select':
          //   cmp._doSelect();
            break;
          case 'left':
          //   cmp._doLeft();
            break;
          case 'up':
          //   cmp._doUp();
            break;
          default:
            console.log('INFO GlobalNavPane :: _enableTVEventHandler, default evt.eventType? : ' + evt.eventType);
        }//switch
      }//if
    });//enable
  }//_enableTVEventHandler

  _disableTVEventHandler() {
    if (this.tvEventHandler) {
      this.tvEventHandler.disable()
      delete this.tvEventHandler
    }
  }//_disableTVEventHandler

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

  onSelect = () => {
    console.log("INFO GlobalNavPaneTester :: onSelect =======================>")
    const { onSelect } = this.props;
      if (onSelect) {
        //console.log('INFO GlobalNavPane :: onSelect calling back from GlobalNavPane');
        onSelect();
      }
  }

  onFocus = () => {
    console.log("INFO GlobalNavPaneTester :: onFocus =======================>")

    //if (this.props.isFocused) {
      const { onFocus } = this.props;
      if (onFocus) {
        //console.log('INFO GlobalNavPane :: onFocus calling back from GlobalNavPane');
        onFocus();
      }
    //}
  }

  onBlur = () => {
    console.log("INFO GlobalNavPaneTester :: onBlur =======================>")
    const { onBlur } = this.props;
      if (onBlur) {
        //console.log('INFO GlobalNavPane :: onBlur calling back from GlobalNavPane');
        onBlur();
      }
  }

  render() {
    return (
        <TouchableNativeFeedback
          //onPress={this.onFocus()}
          onPress={this.onSelect}
          onPressIn={this.onFocus}
          onPressOut={this.onBlur}
        >
          <View style={ {...this.props.styleObj, top:TOP} } >
            <Text style={styles.comment}>
              {this.constructor.name}
            </Text>
          </View>
        </TouchableNativeFeedback>
    );
  }
}

GlobalNavPane.propTypes = {
  styleObj: PropTypes.object,
  onFocus : PropTypes.func,
  onBlur : PropTypes.func,
  onSelect : PropTypes.func,
}

GlobalNavPane.defaultProps = {
  styleObj: StyleSheet.flatten(styles.globalNavContainer),
  onFocus: () => {console.log("INFO GlobalNavPane :: please pass a function for onFocus")},
  onBlur: () => {console.log("INFO GlobalNavPane :: please pass a function for onBlur")},
  onSelect: () => {console.log("INFO GlobalNavPane :: please pass a function for onSelect")},
}