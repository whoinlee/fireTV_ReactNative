/**
 * POC for fireTV in React Native
 * https://github.com/whoinlee/fireTV_ReactNative
 * by WhoIN Lee :: whoin.lee@nbcuni.com
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  Animated,
  Easing,
  PixelRatio,
  StyleSheet,
  TVEventHandler,
  View
} from 'react-native';
import KeyEvent from 'react-native-keyevent';
// import {TweenLite, Power3} from 'gsap';
import config from './config/config';
import keyCodes from './config/keyCodes';
import styles from './styles/styles';
import GlobalNavPane from './GlobalNavPane';
import HomeHeroPane from './HomeHeroPane';
import HomeShelvesPane from './HomeShelvesPane';


// const TL = TweenLite;     // eslint-disable-line
const INIT_GLOBAL_NAV_Y   = config.initGlobalNavY;
const INIT_HOME_HERO_Y    = config.initHomeHeroY;
const INIT_HOME_SHELVES_Y = config.initHomeShelvesY;
//
const STD_DURATION        = config.stdDuration;
const SHORT_DURATION      = config.shortDuration;
//
const FOCUS_LOC_ARR       = ['globalNavPane', 'homeHeroPane', 'homeShelvesPane'];
const GLOBAL_NAV_INDEX    = 0;
const HOME_HERO_INDEX     = 1;
const HOME_SHELVES_INDEX  = 2;
export default class POCContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isGuideVisible: false,
      focusLocationIndex: GLOBAL_NAV_INDEX,
      fadeAnim0: new Animated.Value(1), //-- initial opacity value for fadeAnimation for globalNav
      fadeAnim1: new Animated.Value(1), //-- for homeHero
      fadeAnim2: new Animated.Value(1), //-- for homeShelves
      shelvesTopY: INIT_HOME_SHELVES_Y,
    };

    //-- animation related
    //

    this.elts = [];
    this.shelvesShiftOffsetY = 0;       //-- this.containerShiftOffsetY = 0

   // this.initGlobalNavY = initGlobalNavY;
    this.upGlobalNavY = INIT_GLOBAL_NAV_Y;
   // this.initHomeHeroY = initHomeHeroY
    this.upHomeHeroY = INIT_HOME_HERO_Y   
    this.upMidHomeHeroY = INIT_HOME_HERO_Y      
    this.upOffHomeHeroY = INIT_HOME_HERO_Y
    // this.initHomeShelvesY = initHomeShelvesY
    this.upHomeShelvesY = INIT_HOME_SHELVES_Y  
    this.upOffHomeShelvesY = INIT_HOME_SHELVES_Y 
    this.currHomeShelvesY = INIT_HOME_SHELVES_Y  


    // this._tvEventHandler = new TVEventHandler()
    this._doUp = this._doUp.bind(this)
    this._doDown = this._doDown.bind(this)
    this._doLeft = this._doLeft.bind(this)
    this._doRight = this._doRight.bind(this)
    this._doSelect = this._doSelect.bind(this)
    this._toggleGuides = this._toggleGuides.bind(this)
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
        }//switch
    });//onKeyDownListener
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

    let {focusLocationIndex} = this.state
    switch (focusLocationIndex) {
      //console.log('INFO POCContainer :: _doDown, focusLocationIndex is ' + focusLocationIndex);
      case HOME_SHELVES_INDEX:
        console.log("homeShelves to homeHero")
        focusLocationIndex = HOME_HERO_INDEX

        //-- TODO: only if the 1st shelf is selected inside of HomeShelvesPane
        //-- fadeIn homeHero
        Animated.timing(
          this.state.fadeAnim1, 
          {
            toValue: 1,
            duration: SHORT_DURATION,
          }
        ).start();
        //-- fadeOut homeShelves
        Animated.timing(
          this.state.fadeAnim2, 
          {
            toValue: .6,
            duration: SHORT_DURATION,
          }
        ).start();
        break;
      case HOME_HERO_INDEX:
        console.log("homeHero to homeShelves")
        focusLocationIndex = GLOBAL_NAV_INDEX
        //-- fadeIn globalNav
        Animated.timing(
          this.state.fadeAnim0, 
          {
            toValue: 1,
            duration: SHORT_DURATION,
          }
        ).start();
         //-- fadeOut homeHero
        Animated.timing(
          this.state.fadeAnim1, 
          {
            toValue: .6,
            duration: SHORT_DURATION,
          }
        ).start();
        break;
      case GLOBAL_NAV_INDEX: 
        console.log("globalNav")
      default: 
    }
    this.setState({focusLocationIndex : focusLocationIndex})
  }

  _doDown = () => {
    console.log('INFO POCContainer :: _doDown');

    let {focusLocationIndex} = this.state
    switch (focusLocationIndex) {
      case GLOBAL_NAV_INDEX: 
        console.log("INFO POCContainer :: _doDown, globalNav to homeHero")
        focusLocationIndex = HOME_HERO_INDEX

        //-- fadeOut globalNav
        Animated.timing(
          this.state.fadeAnim0, 
          {
            toValue: .6,
            duration: SHORT_DURATION,
          }
        ).start();

        //-- fadeOut homeShelves
        Animated.timing(
          this.state.fadeAnim2, 
          {
            toValue: .6,
            duration: SHORT_DURATION,
          }
        ).start();

        //-- TODO: reset homeShelves y location

        //-- testing
        //TL.to(this.elts[0], .5, {opacity: 0})
        //TweenLite.to(this.elts[0], .5, {state: {width: 100}});

        break;
      case HOME_HERO_INDEX:
        console.log("INFO POCContainer :: _doDown, homeHero to homeShelves")
        focusLocationIndex = HOME_SHELVES_INDEX

        //-- fadeOut homeHero
        Animated.timing(
          this.state.fadeAnim1, 
          {
            toValue: .6,
            duration: SHORT_DURATION,
          }
        ).start();

        //-- fadeIn homeShelves
        Animated.timing(
          this.state.fadeAnim2, 
          {
            toValue: 1,
            duration: SHORT_DURATION,
          }
        ).start();

        break;
      case HOME_SHELVES_INDEX:
        //-- handle inside of homeShelves pane
      default:
        console.log("INFO POCContainer :: _doDown, homeShelves")
    }
    this.setState({focusLocationIndex : focusLocationIndex})
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

  _changeOpacity = (target) => {

  }

  _changeLocation = (target) => {
    
  }

  _enableTVEventHandler() {
    console.log('INFO :: _enableTVEventHandler, this._tvEventHandler ? ' + this._tvEventHandler);
    //
    this._tvEventHandler.enable(this, function(cmp, evt) {
      console.log('INFO :: _enableTVEventHandler, cmp? : ' + cmp.constructor.name);  //POCContainer
      // console.log('INFO :: _enableTVEventHandler, evt.toSource()? : ' + evt.toSource())
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
      if (evt) {
        console.log('INFO POCContainer :: _enableTVEventHandler, evt.eventType? : ' + evt.eventType);
        switch (evt.eventType) {
          case 'blur':
            console.log('INFO POCContainer :: _doBlur, this is ??' + this.constructor.name);
            //cmp._doBlur();
            break;
          case 'focus':
            console.log('INFO POCContainer :: _doFocus, this is ??' + this.constructor.name);
            //cmp._doFocus();
            break;
          case 'playPause':
            console.log('INFO POCContainer :: playPause');
            break;
          case 'rewind':
            console.log('INFO POCContainer :: rewind');
            break;
          case 'fastForward':
            console.log('INFO POCContainer :: fastForward');
            break;
          // case 'select':
          //   cmp._doSelect();
          //   break;
          // case 'left':
          //   cmp._doLeft();
          //   break;
          // case 'right':
          //   cmp._doRight();
          //   break;
          // case 'up':
          //   cmp._doUp();
          //   break;
          // case 'down':
          //   cmp._doDown();
          //   break;
          default:
            console.log('INFO POCContainer :: _enableTVEventHandler, default evt.eventType? : ' + evt.eventType);
        }//switch
      }//if
    });//enable
  }//_enableTVEventHandler

  _disableTVEventHandler() {
    // if (this._tvEventHandler) {
    //   this._tvEventHandler.disable();
    //   delete this._tvEventHandler;
    // }
  }//_disableTVEventHandler

  render() {
    let { fadeAnim0, fadeAnim1, fadeAnim2 } = this.state
    return (
        <View style={styles.pocContainer}>
            <Animated.View  style={ {  ...this.props.globalNavStyle,
                                      opacity: fadeAnim0  } }
                            ref={node => this.elts.push(node)} >
                <GlobalNavPane/>
            </Animated.View>
            <Animated.View  style={ {  ...this.props.homeHeroStyle,
                                      opacity: fadeAnim1  } }
                            ref={node => this.elts.push(node)} >
                <HomeHeroPane/>
            </Animated.View>
            <Animated.View  style={ {  ...this.props.homeShelvesStyle,
                                      opacity: fadeAnim2  } }
                            ref={node => this.elts.push(node)} >
                <HomeShelvesPane/>
            </Animated.View>
        </View>
    );
  }
}//POCContainer


POCContainer.propTypes = {
  globalNavStyle: PropTypes.object,
  homeHeroStyle: PropTypes.object,
  homeShelvesStyle: PropTypes.object
}

POCContainer.defaultProps = {
  globalNavStyle: StyleSheet.flatten(styles.globalNavContainer),
  homeHeroStyle: StyleSheet.flatten(styles.homeHeroContainer),
  homeShelvesStyle: StyleSheet.flatten(styles.homeShelvesContainer)
}
