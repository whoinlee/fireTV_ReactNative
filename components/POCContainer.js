/**
 * POC for fireTV in React Native
 * https://github.com/whoinlee/fireTV_ReactNative
 * by WhoIN Lee :: whoin.lee@nbcuni.com
 */
import React, { Component } from 'react';
import { 
  View,
  TouchableWithoutFeedback,
  TVEventHandler,
  // RCTTVView
} from 'react-native';
import styles from './styles/styles';
import GlobalNavPane from './GlobalNavPane';
import HomeHeroPane from './HomeHeroPane';
import HomeShelvesPane from './HomeShelvesPane';

const ReactNative = require('ReactNative');
const initGlobalNavY = 0;
const initHomeHeroY = 0;
const initHomeShelvesY = 0;
export default class POCContainer extends Component {
  constructor(props) {
    super(props);
    //console.log('INFO POCContainer :: constructor, this.constructor.name? : ' + this.constructor.name);  //POCContainer
    this._tvEventHandler = new TVEventHandler();
  }

  componentDidMount() {
    //console.log('INFO POCContainer :: componentDidMount');
    this._enableTVEventHandler();
  }

  componentWillUnmount() {
    //console.log('INFO POCContainer :: componentWillUnmount');
    this._disableTVEventHandler();
  }

  _enableTVEventHandler() {
    //console.log('INFO :: _enableTVEventHandler');
    this._tvEventHandler.enable(this, function(cmp, evt) {
      // console.log('INFO :: _enableTVEventHandler, cmp? : ' + cmp.constructor.name);  //POCContainer
      /*
      const myTag = ReactNative.findNodeHandle(cmp);
      evt.dispatchConfig = {};
      if (myTag === evt.tag) {
        if (evt.eventType === 'focus') {
          cmp.touchableHandleActivePressIn && cmp.touchableHandleActivePressIn(evt);
        } else if (evt.eventType === 'blur') {
          cmp.touchableHandleActivePressOut && cmp.touchableHandleActivePressOut(evt);
        } else if (evt.eventType === 'select') {
          cmp.touchableHandlePress && !cmp.props.disabled && cmp.touchableHandlePress(evt);
        }
      }*/

      if (evt) {
        switch (evt.eventType) {
          case 'blur':
            cmp._doBlur();
            break;
          case 'focus':
            cmp._doFocus();
            break;
          case 'select':
            cmp._doSelect();
            break;
          case 'left':
            cmp._doLeft();
            break;
          case 'right':
            cmp.doRight();
            break;
          case 'up':
            cmp._doUp();
            break;
          case 'down':
            cmp._doDown();
            break;
          case 'playPause':
            cmp._doPlayPause();
            break;
          default:
            console.log('INFO POCContainer :: _enableTVEventHandler, evt.eventType? : ' + evt.eventType);
        }
      }
    });
  }

  _disableTVEventHandler() {
    //console.log('INFO :: _disableTVEventHandler');
    if (this._tvEventHandler) {
      this._tvEventHandler.disable();
      delete this._tvEventHandler;
    }
  }

  _doBlur = () => {
    console.log('INFO POCContainer :: _doBlur, this is ??' + this.constructor.name);
  }

  _doFocus = () => {
    console.log('INFO POCContainer :: _doFocus, this is ??' + this.constructor.name);
  }

  _doSelect = () => {
    console.log('INFO POCContainer :: _doSelect');
  }

  _doLeft = () => {console.log('INFO POCContainer :: _doLeft');}

  _doRight = () => {console.log('INFO POCContainer :: _doRight');}

  _doUp = () => {console.log('INFO POCContainer :: _doUp');}

  _doDown = () => {console.log('INFO POCContainer :: _doDown');}

  _doPlayPause = () => { console.log('INFO POCContainer :: _doPlayPause');}

  _doTest = () => {console.log('INFO :: _doTest ????');}

  render() {
    return (
        <View style={styles.pocContainer}>
            <GlobalNavPane />
            <HomeHeroPane />
            <HomeShelvesPane />
        </View>
    );
  }
}