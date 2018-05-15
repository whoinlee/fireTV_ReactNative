/** 
 * ================================================
 *  POC for fireTV in React Native
 *  https://github.com/whoinlee/fireTV_ReactNative
 *  by WhoIN Lee :: whoin.lee@nbcuni.com
 * ================================================
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  Animated,
  Easing,
  StyleSheet,
  TVEventHandler,
  View
} from 'react-native';
import KeyEvent from 'react-native-keyevent';

import config from './config';
import keyCodes from './keyCodes';
import styles from './styles/styles';
import GlobalNavPane from './components/GlobalNavPane';
import HomeHeroPane from './components/HomeHeroPane';
import HomeShelvesPane from './components/HomeShelvesPane';




const RATIO               = config.density;
const STD_DURATION        = config.stdDuration;
const SHORT_DURATION      = config.shortDuration;
//
const INIT_GLOBAL_NAV_Y   = config.initGlobalNavY/RATIO;
const INIT_HOME_HERO_Y    = config.initHomeHeroY/RATIO;     //-- 165 = (100(globalNav)+65(offset)
const INIT_HOME_SHELVES_Y = config.initHomeShelvesY/RATIO;  //-- 836 = (100(globalNav)+65(offset)+606(homeHero)+65) = 836 
//
const V_CENTER_Y          = Math.floor(config.stageH/(2*RATIO));
//
const FOCUS_LOC_ARR       = ['globalNavPane', 'homeHeroPane', 'homeShelvesPane'];
const GLOBAL_NAV_INDEX    = 0;
const HOME_HERO_INDEX     = 1;
const HOME_SHELVES_INDEX  = 2;


/* ----- from HomeShelvesPane design -------- */
const INIT_SHELF_Y        = 62/RATIO;         //-- from container top to the 1st shelf title
//
const BASE_TITLE_H        = 28/RATIO;
const TITLE_N_TILE_OFFSET = 10/RATIO; 
const BASE_TILE_H         = 180/RATIO;
const FOCUSED_TILE_H      = 332/RATIO; 
/* ------------------------------------------ */

export default class POCContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // isGuideVisible: false,
      animOpacity0: new Animated.Value(1), //-- animation instance for 'globalNav' with initial opacity value of '1'
      animOpacity1: new Animated.Value(1), //-- for 'homeHero'
      animOpacity2: new Animated.Value(1), //-- for 'homeShelves'
      animLocation0: new Animated.Value(INIT_GLOBAL_NAV_Y),   //-- animation instance for 'globalNav' with initial location value of INIT_GLOBAL_NAV_Y
      animLocation1: new Animated.Value(INIT_HOME_HERO_Y),    //-- for 'homeHero'
      animLocation2: new Animated.Value(INIT_HOME_SHELVES_Y), //-- for 'homeShelves'
    }

    this._currFocusLocIndex = GLOBAL_NAV_INDEX
    this._selectedShelfIndex = -1  
    this._currHomeShelvesY = INIT_HOME_SHELVES_Y
    this._isFirstShelfSelected = false

    this.elts = []

    //this.paneShiftOffsetY = 0       //-- how much panes(globalNav, homeHero, and homeShelves) need to shift up on padding down to the 1st shelf
    // this.paneShiftOffsetY = (INIT_SHELF_Y + BASE_TITLE_H + TITLE_N_TILE_OFFSET + BASE_TILE_H/2);       //-- how much panes(globalNav, homeHero, and homeShelves) need to shift up on padding down to the 1st shelf
    //
    this.initGlobalNavY = INIT_GLOBAL_NAV_Y
    this.initHomeHeroY = INIT_HOME_HERO_Y   
    this.initHomeShelvesY = INIT_HOME_SHELVES_Y
    //
    this.upMidHomeHeroY = INIT_HOME_HERO_Y      
    this.upOffHomeHeroY = INIT_HOME_HERO_Y
    this.upOffHomeShelvesY = INIT_HOME_SHELVES_Y 

    //-- set panes' up locations
    const TOP_Y = V_CENTER_Y - (INIT_SHELF_Y + BASE_TITLE_H + TITLE_N_TILE_OFFSET + BASE_TILE_H/2)         //-- top of the homeShelves pane location, where the fist shelf is v-aligned with the center of the stage
    this.paneShiftOffsetY = this.initHomeShelvesY - TOP_Y + (FOCUSED_TILE_H - BASE_TILE_H)/2               //bc, the fist shelf tile will be focused : (332-180)/2
    this.upGlobalNavY = this.initGlobalNavY - this.paneShiftOffsetY
    this.upHomeHeroY = this.initHomeHeroY - this.paneShiftOffsetY
    this.upHomeShelvesY = TOP_Y;
    
    // this._tvEventHandler = new TVEventHandler()
    // this._doUp = this._doUp.bind(this)
    // this._doDown = this._doDown.bind(this)
    // this._doLeft = this._doLeft.bind(this)
    // this._doRight = this._doRight.bind(this)
    // this._doSelect = this._doSelect.bind(this)
    // this._toggleGuides = this._toggleGuides.bind(this)
  }

  componentDidMount() {
    KeyEvent.onKeyDownListener((keyEvent) => {
      switch (keyEvent.keyCode) {
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
            console.log('INFO POCContainer :: componentDidMount, keyCode ? : ' + keyEvent.keyCode);
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
    KeyEvent.removeKeyDownListener()
    //this._disableTVEventHandler();
  }//componentWillUnmount

  _doUp = () => {
    console.log("---")
    console.log("INFO POCContainer :: _doUp, from " + FOCUS_LOC_ARR[this._currFocusLocIndex])

    switch (this._currFocusLocIndex) {
      case HOME_SHELVES_INDEX:
        //-- TODO: do this only if the 1st shelf is selected inside of HomeShelvesPane
        if (this._isFirstShelfSelected) {
          this._currFocusLocIndex -= 1
          this._changeOpacity(HOME_HERO_INDEX, 1)
          this._changeOpacity(HOME_SHELVES_INDEX, .6)
          //
          this._changeLocation(GLOBAL_NAV_INDEX, this.initGlobalNavY)
          this._changeLocation(HOME_HERO_INDEX, this.initHomeHeroY)
          this._changeLocation(HOME_SHELVES_INDEX, this.initHomeShelvesY)
          this._currHomeShelvesY = this.initHomeShelvesY
          //
          this._isFirstShelfSelected = false
        } else {
          //-- handle inside of the shelvesPane
        }
        break;
      case HOME_HERO_INDEX:
        this._currFocusLocIndex -= 1
        this._changeOpacity(GLOBAL_NAV_INDEX, 1)
        this._changeOpacity(HOME_SHELVES_INDEX, 1)
        //-- homeShelvesPane moves to the location, upHomeShelvesY, where the first shelf tiles' vertical center is located at V_CENTER_Y
        break;
      case GLOBAL_NAV_INDEX: 
    }//switch

    console.log("INFO POCContainer :: _doUp, to " + FOCUS_LOC_ARR[this._currFocusLocIndex])
    console.log(" ")
  }//_doUp

  _doDown = () => {
    console.log("---")
    console.log("INFO POCContainer :: _doDown, from " + FOCUS_LOC_ARR[this._currFocusLocIndex])

    // let prevShelfIndex
    // let nextShelfIndex
    switch (this._currFocusLocIndex) {
      case GLOBAL_NAV_INDEX:
        this._currFocusLocIndex += 1
        //
        this._changeOpacity(GLOBAL_NAV_INDEX, .6)
        this._changeOpacity(HOME_SHELVES_INDEX, .6)
        break;
      case HOME_HERO_INDEX:
        this._currFocusLocIndex += 1
        //
        this._changeOpacity(HOME_HERO_INDEX, .6)
        this._changeOpacity(HOME_SHELVES_INDEX, 1)
        //
        this._changeLocation(GLOBAL_NAV_INDEX, this.upGlobalNavY)
        this._changeLocation(HOME_HERO_INDEX, this.upHomeHeroY)
        this._changeLocation(HOME_SHELVES_INDEX, this.upHomeShelvesY)
        this._currHomeShelvesY = this.upHomeShelvesY

        this._isFirstShelfSelected = true
        // TODO::
        // this._selectedShelfIndex = 0  //-- the 1st shelf, CHECK!!!
        // nextShelfIndex = 1
        // this._selectTheFirstShelf()  //-- inside of the homeShelvesPane??
        // selectedShelfIndex = 0  //the first shelf selected
        // nextShelfIndex = 1
        // this.prevShelf = null
        // this.currShelf = this.shelves[0]
        // this.nextShelf = (nextShelfIndex < totalShelves) ? this.shelves[nextShelfIndex] : null
        // this.selectTheFirstShelf() 
        break;
      case HOME_SHELVES_INDEX:
        if (this._isFirstShelfSelected) {
          //-- TODO: unless there's only one shelf
          this._isFirstShelfSelected = false
        } else {
          //-- handle inside of homeShelves pane
        }
    }//switch

    console.log("INFO POCContainer :: _doDown, to " + FOCUS_LOC_ARR[this._currFocusLocIndex])
    console.log(" ")
  }//_doDown

  _doLeft = () => {
    console.log('INFO POCContainer :: _doLeft');
    if (this._currFocusLocIndex == HOME_SHELVES_INDEX) {
      console.log('INFO POCContainer :: do _doLeft in the HomeShelvesPane');
    }
  }

  _doRight = () => {
    console.log('INFO POCContainer :: _doRight');
    if (this._currFocusLocIndex == HOME_SHELVES_INDEX) {
      console.log('INFO POCContainer :: do _doRight in the HomeShelvesPane');
    }
  }

  _doSelect = () => {
    console.log('INFO POCContainer :: _doSelect');
    if (this._currFocusLocIndex == HOME_SHELVES_INDEX) {
      console.log('INFO POCContainer :: do _doSelect in the HomeShelvesPane');
    }
  }

  _toggleGuides = () => {

  }

  _changeOpacity = (targetIndex, targetValue, pDuration=STD_DURATION) => {
    console.log("INFO POCContainer :: _changeOpacity, " + targetIndex + ": " + FOCUS_LOC_ARR[targetIndex] + " changeOpacity to " + targetValue)

    Animated.timing(
      this.state["animOpacity" + targetIndex], 
      {
        toValue: targetValue,
        duration: pDuration,
      }
    ).start();
  }

  _changeLocation = (targetIndex, targetValue, pDuration=STD_DURATION) => {
    console.log("INFO POCContainer :: _changeLocation, " + targetIndex + ": " + FOCUS_LOC_ARR[targetIndex] + " change yLocation to " + targetValue)
    Animated.timing(
      this.state["animLocation" + targetIndex], 
      {
        toValue: targetValue,
        duration: pDuration,
        easing: Easing.out(Easing.quad),
      }
    ).start();
  }

  // _selectTheFirstShelf = () => {
  //   // this.shelves[0].select()
  //   // //-- dimm out the rest
  //   // for (var i = 1; i < totalShelves; i++) {
  //   //   let target = this.shelves[i]
  //   //   target.opacityChange(.6)
  //   // }
  // }//_selectTheFirstShelf

  _onFirstShelfSelected = () => {
    console.log("INFO POCContainer :: _onFirstShelfSelected")
    this._isFirstShelfSelected = true
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

  _onShelvesPanePressCallBack() {
    console.log("INFO POCContainer :: _onShelvesPanePressCallBack")
  }

  _onPressCallBack() {
    console.log("INFO POCContainer :: _onPressCallBack")
  }

  render() {
    console.log("INFO POCContainer :: render")
    let { animOpacity0, animOpacity1, animOpacity2, animLocation0, animLocation1, animLocation2 } = this.state
    return (
        <View style={styles.pocContainer}>
            <Animated.View  style={ { ...this.props.globalNavStyleObj,
                                      top: animLocation0,
                                      opacity: animOpacity0  } }   /* for binding an animation instance */
                            ref={node => this.elts.push(node)} >
                      <GlobalNavPane />
            </Animated.View>
            <Animated.View  style={ { ...this.props.homeHeroStyleObj,
                                      top: animLocation1,
                                      opacity: animOpacity1  } }
                            ref={node => this.elts.push(node)} >
                      <HomeHeroPane />
            </Animated.View>
            <Animated.View  style={ { ...this.props.homeShelvesStyleObj, 
                                      top: animLocation2,
                                      opacity: animOpacity2  } }
                            ref={node => this.elts.push(node)} >
                      <HomeShelvesPane  onPressCallBack={this._onShelvesPanePressCallBack}
                                        onFirstShelfSelected={this._onFirstShelfSelected}
                      />
            </Animated.View>
        </View>
    );
  }
}//POCContainer


POCContainer.propTypes = {
  globalNavStyleObj: PropTypes.object,
  homeHeroStyleObj: PropTypes.object,
  homeShelvesStyleObj: PropTypes.object
}

POCContainer.defaultProps = {
  globalNavStyleObj: StyleSheet.flatten(styles.globalNavContainer),
  homeHeroStyleObj: StyleSheet.flatten(styles.homeHeroContainer),
  homeShelvesStyleObj: StyleSheet.flatten(styles.homeShelvesContainer)
}
