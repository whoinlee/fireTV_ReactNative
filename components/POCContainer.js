/**
 * POC for fireTV in React Native
 * https://github.com/whoinlee/fireTV_ReactNative
 * by WhoIN Lee :: whoin.lee@nbcuni.com
 */
import React, { Component } from 'react';
import { 
  View,
  // PixelRatio,
  //TVEventHandler,
} from 'react-native';
import KeyEvent from 'react-native-keyevent';
//

import config from './config/config';
import keyCodes from './config/keyCodes';
import styles from './styles/styles';
import GlobalNavPane from './GlobalNavPane';
import HomeHeroPane from './HomeHeroPane';
import HomeShelvesPane from './HomeShelvesPane';

const initGlobalNavY = config.initGlobalNavY;
const initHomeHeroY = config.initHomeHeroY;
const initHomeShelvesY = config.initHomeShelvesY;
const stageW = config.stageW;
const stageH = config.stageH;

const focusLocationArr = ['globalNavPane', 'homeHeroPane', 'homeShelvesPane'];
const GLOBAL_NAV_INDEX = 0;
const HOME_HERO_INDEX = 1;
const HOME_SHELVES_INDEX = 2;

export default class POCContainer extends Component {
  constructor(props) {
    super(props);
    //console.log('INFO POCContainer :: constructor, this.constructor.name? : ' + this.constructor.name);  //POCContainer

    this.state = {
      isGuideVisible: false,
      focusLocationIndex: GLOBAL_NAV_INDEX,
      shelvesTopY: initHomeShelvesY + 'px'
    };

    this.elts = [];
    this.shelvesShiftOffsetY = 0;   //this.containerShiftOffsetY = 0

   // this.initGlobalNavY = initGlobalNavY;
    this.upGlobalNavY = initGlobalNavY;
   // this.initHomeHeroY = initHomeHeroY
    this.upHomeHeroY = initHomeHeroY   
    this.upMidHomeHeroY = initHomeHeroY      
    this.upOffHomeHeroY = initHomeHeroY
    // this.initHomeShelvesY = initHomeShelvesY
    this.upHomeShelvesY = initHomeShelvesY  
    this.upOffHomeShelvesY = initHomeShelvesY 
    this.currHomeShelvesY = initHomeShelvesY  

    //this._tvEventHandler = new TVEventHandler();
    this._doUp = this._doUp.bind(this);
    this._doDown = this._doDown.bind(this);
    this._doLeft = this._doLeft.bind(this);
    this._doRight = this._doRight.bind(this);
    this._doSelect = this._doSelect.bind(this);
    this._toggleGuides = this._toggleGuides.bind(this)

   // console.log("INFO POCContainer constructor :: PixelRatio.get() is " + PixelRatio.get());
  }

  componentDidMount() {
    KeyEvent.onKeyDownListener((keyEvent) => {
      let keyCode = keyEvent.keyCode;
      switch (keyCode) {
          case keyCodes.up:
            this._doUp();
            break;
          case keyCodes.down:
            this._doDown();
            break;
          case keyCodes.left:
            this._doLeft();
            break;
          case keyCodes.right:
            this._doRight();
            break;
          case keyCodes.center:
            this._doSelect();
            break;
          default:
            console.log('INFO POCContainer :: componentDidMount, keyCode ? : ' + keyCode);
        }

    });
    // KeyEvent.onKeyUpListener((keyEvent) => {
    //   console.log(`INFO POCContainer :: componentDidMount, onKeyUpListener keyCode: ${keyEvent.keyCode}`);
    //   console.log(`INFO POCContainer :: componentDidMount, onKeyUpListener Action: ${keyEvent.action}`);
    // });
    // KeyEvent.onKeyMultipleListener((keyEvent) => {
    //   console.log(`INFO POCContainer :: componentDidMount, Characters: ${keyEvent.characters}`);
    // });

    //this._enableTVEventHandler();
  }//componentDidMount

  componentWillUnmount() {
    KeyEvent.removeKeyDownListener();
    //this._disableTVEventHandler();
  }//componentWillUnmount

  _doUp = () => {
    console.log('INFO POCContainer :: _doUp');
  }

  _doDown = () => {
    console.log('INFO POCContainer :: _doDown');
  }

  _doLeft = () => {
    console.log('INFO POCContainer :: _doLeft');
  }

  _doRight = () => {
    console.log('INFO POCContainer :: _doRight');
  }

  _doSelect = () => {
    console.log('INFO POCContainer :: _doSelect');
  }

  _toggleGuides = () => {

  }

  _enableTVEventHandler() {
    //console.log('INFO :: _enableTVEventHandler');

    // this._tvEventHandler.enable(this, function(cmp, evt) {
    //   // console.log('INFO :: _enableTVEventHandler, cmp? : ' + cmp.constructor.name);  //POCContainer
    //   /*
    //   const myTag = ReactNative.findNodeHandle(cmp);
    //   evt.dispatchConfig = {};
    //   if (myTag === evt.tag) {
    //     if (evt.eventType === 'focus') {
    //       cmp.touchableHandleActivePressIn && cmp.touchableHandleActivePressIn(evt);
    //     } else if (evt.eventType === 'blur') {
    //       cmp.touchableHandleActivePressOut && cmp.touchableHandleActivePressOut(evt);
    //     } else if (evt.eventType === 'select') {
    //       cmp.touchableHandlePress && !cmp.props.disabled && cmp.touchableHandlePress(evt);
    //     }
    //   }*/

    //   if (evt) {
    //     //console.log('INFO POCContainer :: _enableTVEventHandler, evt.eventType? : ' + evt.eventType);
    //     console.log('INFO POCContainer :: _enableTVEventHandler, evt.keyCode ? : ' + evt.keyCode);
    //     console.log('INFO POCContainer :: _enableTVEventHandler, evt.key ? : ' + evt.key);
    //     switch (evt.eventType) {
    //       case 'blur':
    //         console.log('INFO POCContainer :: _doBlur, this is ??' + this.constructor.name);
    //         //cmp._doBlur();
    //         break;
    //       case 'focus':
    //         console.log('INFO POCContainer :: _doFocus, this is ??' + this.constructor.name);
    //         //cmp._doFocus();
    //         break;
    //       case 'select':
    //         cmp._doSelect();
    //         break;
    //       case 'left':
    //         cmp._doLeft();
    //         break;
    //       case 'right':
    //         cmp._doRight();
    //         break;
    //       case 'up':
    //         cmp._doUp();
    //         break;
    //       case 'down':
    //         cmp._doDown();
    //         break;
    //       case 'playPause':
    //         console.log('INFO POCContainer :: playPause');
    //         break;
    //       case 'rewind':
    //         console.log('INFO POCContainer :: rewind');
    //         break;
    //       case 'fastForward':
    //         console.log('INFO POCContainer :: fastForward');
    //         break;
    //       default:
    //         console.log('INFO POCContainer :: _enableTVEventHandler, default evt.eventType? : ' + evt.eventType);
    //     }
    //   }
    // });
  }//_enableTVEventHandler

  _disableTVEventHandler() {
    //console.log('INFO :: _disableTVEventHandler');

    // if (this._tvEventHandler) {
    //   this._tvEventHandler.disable();
    //   delete this._tvEventHandler;
    // }
  }//_disableTVEventHandler

  render() {
    return (
        <View style={styles.pocContainer}>
            <GlobalNavPane 
                //style={{top:initGlobalNavY}}
                ref={node => this.elts.push(node)} 
            />
            <HomeHeroPane 
                //style={{top:initHomeHeroY}}
                ref={node => this.elts.push(node)}
            />
            <HomeShelvesPane 
                //style={{top:initHomeShelvesY}}
                ref={node => this.elts.push(node)}
            />
        </View>
    );
  }
}