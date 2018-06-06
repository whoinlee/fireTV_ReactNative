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
// import toControllable from './components/toControllable';
import GlobalNavPane from './components/GlobalNavPane';
import HomeHeroPane from './components/HomeHeroPane';
import HomeShelvesPane from './components/HomeShelvesPane';


//---------- from config -----------------------------------------//
const RATIO               = config.density;
const STD_DURATION        = config.stdDuration;
const SHORT_DURATION      = config.shortDuration;
//
const INIT_GLOBAL_NAV_Y   = config.initGlobalNavY/RATIO;
const INIT_HOME_HERO_Y    = config.initHomeHeroY/RATIO;           //-- 165 = (100(globalNav)+65(offset)
const INIT_HOME_SHELVES_Y = config.initHomeShelvesY/RATIO;        //-- 836 = (100(globalNav)+65(offset)+606(homeHero)+65) = 836 
//
const V_MIDDLE_Y          = Math.floor(config.stageH/(2*RATIO));  //-- vertical middle location of the stage
//----------------------------------------------------------------//

const FOCUS_LOC_ARR       = ['globalNavPane', 'homeHeroPane', 'homeShelvesPane'];
const GLOBAL_NAV_INDEX    = 0;
const HOME_HERO_INDEX     = 1;
const HOME_SHELVES_INDEX  = 2;

/* ----- from HomeShelvesPane design -------- */
const INIT_SHELF_Y        = 62/RATIO;         //-- from container top to the 1st shelf title
//
//const BASE_TITLE_H        = 28/RATIO;       //-- wrong!!! ====> turned out to be '20'
const BASE_TITLE_H        = 40/RATIO;         
const TITLE_N_TILE_OFFSET = 10/RATIO; 
const BASE_TILE_H         = 180/RATIO;
const FOCUSED_TILE_H      = 332/RATIO; 
/* ------------------------------------------ */

const BASE_SHELF_OFFSET   = 106/RATIO;
const BASE_SHELF_H = BASE_TITLE_H + TITLE_N_TILE_OFFSET + BASE_TILE_H + BASE_SHELF_OFFSET;
// const BASE_SHELF_H = BASE_SHELF_OFFSET_Y;
const FOCUSED_SHELF_SHIFT_Y   = Math.floor(76/RATIO);
const BLOOMED_SHELF_SHIFT_Y   = Math.floor(131/RATIO);
// const FOCUSED_SHELF_OFFSET_Y  = BASE_SHELF_H + FOCUSED_SHELF_SHIFT_Y;
const FOCUSED_SHELF_OFFSET_Y  = BASE_SHELF_OFFSET + FOCUSED_SHELF_SHIFT_Y;
const FOCUSED_SHELF_H         = BASE_SHELF_H + FOCUSED_SHELF_SHIFT_Y;

// console.log("INFO FOCUSED_SHELF_SHIFT 1 ?? " + FOCUSED_SHELF_SHIFT_Y)
// console.log("INFO FOCUSED_SHELF_H 1 ?? " + FOCUSED_SHELF_H)

// const ControllableGlobalNav = toControllable(GlobalNavPane)
// const ControllableHomeHero = toControllable(HomeHeroPane)
// const ControllableHomeShelves = toControllable(HomeShelvesPane)

export default class POCContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //activeControllable: null,
      //controllables: [],
      animOpacity0: new Animated.Value(1),    //-- animation instance for 'globalNav' with initial opacity value of '1'
      animOpacity1: new Animated.Value(1),    //-- for 'homeHero'
      animOpacity2: new Animated.Value(1),    //-- for 'homeShelves'
      animLocation0: new Animated.Value(INIT_GLOBAL_NAV_Y),   //-- animation instance for 'globalNav' with initial location value of INIT_GLOBAL_NAV_Y
      animLocation1: new Animated.Value(INIT_HOME_HERO_Y),    //-- for 'homeHero'
      animLocation2: new Animated.Value(INIT_HOME_SHELVES_Y), //-- for 'homeShelves'
      isGuideVisible: true,
    }

    this.selectablePanes = []
    this.currFocusLocIndex = GLOBAL_NAV_INDEX //CHECK : needs to move to the state
    this.selectedShelfIndex = -1  
    this.currHomeShelvesY = INIT_HOME_SHELVES_Y
    this.isFirstShelfSelected = false
    
    this.initGlobalNavY = INIT_GLOBAL_NAV_Y
    this.initHomeHeroY = INIT_HOME_HERO_Y   
    this.initHomeShelvesY = INIT_HOME_SHELVES_Y

    //-- set panes' up locations
    const TOP_Y = V_MIDDLE_Y - (INIT_SHELF_Y + BASE_TITLE_H + TITLE_N_TILE_OFFSET + BASE_TILE_H/2)         //-- top of the homeShelves pane location, where the fist shelf is v-aligned with the center of the stage
    this.paneShiftOffsetY = this.initHomeShelvesY - TOP_Y + (FOCUSED_TILE_H - BASE_TILE_H)/2               //bc, the fist shelf tile will be focused : (332-180)/2
    this.upGlobalNavY = this.initGlobalNavY - this.paneShiftOffsetY
    this.upHomeHeroY = this.initHomeHeroY - this.paneShiftOffsetY           //-- homeHeroPane shifts on homeShelves pane and its first shelf being focused
    this.upHomeShelvesY = TOP_Y

    this.upMidHomeHeroY = this.upHomeHeroY - BLOOMED_SHELF_SHIFT_Y          //-- homeHeroPane shifts on the fist shelf being largeBloomed
    //
    this.upOffHomeHeroY = this.upHomeHeroY - FOCUSED_SHELF_OFFSET_Y         //-- homeHeroPane shifts/hides on the 2nd shelf being focused
    this.upOffHomeShelvesY = this.upHomeShelvesY -  FOCUSED_SHELF_OFFSET_Y  //-- need?????
    
    this.tvEventHandler = new TVEventHandler()
  }

  // _registerControllable = (
  //   onFocus,
  //   onBlur,
  //   onLeft,
  //   onRight,
  //   onUp,
  //   onDown,
  //   onPress,
  // ) => {
  //   this.state.controllables.push({
  //     onFocus,
  //     onBlur,
  //     onLeft,
  //     onRight,
  //     onUp,
  //     onDown,
  //     onPress,
  //   });

  //   this.setState({ controllables: this.state.controllables });
  // }

  componentDidMount() {
    this._setKeyListener()
  }//componentDidMount

  componentWillUnmount() {
    this._removeKeyListener()
  }//componentWillUnmount

  _enableTVEventHandler() {
    console.log('INFO :: _enableTVEventHandler, this.tvEventHandler ? ' + this.tvEventHandler);
    //
    this.tvEventHandler.enable(this, function(cmp, evt) {
      //console.log('INFO :: _enableTVEventHandler, cmp? : ' + cmp.constructor.name);  //POCContainer
      //-- sometimes works, sometimes doesn't ?????
      if (evt) {
        console.log('INFO POCContainer :: _enableTVEventHandler, evt.eventType? : ' + evt.eventType);
        switch (evt.eventType) {
          case 'blur':
            console.log('INFO POCContainer :: blur');
            break;
          case 'focus':
            console.log('INFO POCContainer :: focus');
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
          // case 'up':
          //   cmp._doUp();
          //   break;
          default:
            console.log('INFO POCContainer :: _enableTVEventHandler, default evt.eventType? : ' + evt.eventType);
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

  _setKeyListener = () => {
    console.log('INFO POCContainer :: _setKeyListener')
    KeyEvent.onKeyDownListener((keyEvent) => {
      //console.log('INFO POCContainer :: componentDidMount, keyCode ? : ' + keyEvent.keyCode);
      switch (keyEvent.keyCode) {
        case keyCodes.up:
          this._doUp()
          break
        case keyCodes.down:
          this._doDown()
          break
        case keyCodes.left:
          this._doLeft()
          break
        case keyCodes.right:
          this._doRight()
          break
        case keyCodes.center:
        case keyCodes.return:
          this._doSelect()
          break
        case keyCodes.toggleGuide:
          this._toggleGuide()
          break
        case keyCodes.reload:
          //-- for reloading the app
          break
        default:
          console.log('INFO POCContainer :: _setKeyListener, default - keyCode ? : ' + keyEvent.keyCode);
      }//switch
    });//onKeyDownListener

    //this._enableTVEventHandler();
  }//_setKeyListener

  _removeKeyListener = () => {
    console.log('INFO POCContainer :: _removeKeyListener')
    KeyEvent.removeKeyDownListener()
    
    //this._disableTVEventHandler()
  }//_removeKeyListener

  _toggleGuide = () => { this.setState({isGuideVisible: !this.state.isGuideVisible}) }

  _doUp = () => {
    console.log("\n---")
    console.log("INFO POCContainer :: _doUp, from " + FOCUS_LOC_ARR[this.currFocusLocIndex])
    switch (this.currFocusLocIndex) {
      case HOME_SHELVES_INDEX:
        if (this.isFirstShelfSelected) {
          //-- focus moves to the homeHero
          this.currFocusLocIndex -= 1

          //-- _onShelvesPaneBlur
          // this._changeOpacity(HOME_HERO_INDEX, 1)
          // this._changeOpacity(HOME_SHELVES_INDEX, .6)

          this._changeLocation(GLOBAL_NAV_INDEX, this.initGlobalNavY)
          this._changeLocation(HOME_HERO_INDEX, this.initHomeHeroY)
          this._changeLocation(HOME_SHELVES_INDEX, this.initHomeShelvesY)
          this.currHomeShelvesY = this.initHomeShelvesY
          //
          this.isFirstShelfSelected = false
        } else {
          //-- handle inside of the shelvesPane
          console.log("CHECK POCContainer :: _doUp, calling this.state.activeControllable.doUp() ")
          //this.state.activeControllable.doUp()  //CHECK, wrong way?????, temporarily commented out
        }
        break;
      case HOME_HERO_INDEX:
        //-- focus moves to the globalNav
        this.currFocusLocIndex -= 1
        // this._changeOpacity(GLOBAL_NAV_INDEX, 1)
        // this._changeOpacity(HOME_SHELVES_INDEX, 1)
        //-- homeShelvesPane moves to the location, upHomeShelvesY, where the first shelf tiles' vertical center is located at V_CENTER_Y
        break;
      case GLOBAL_NAV_INDEX:
        //-- do nothing
    }//switch
    this.setState({activeControllable: this.selectablePanes[this.currFocusLocIndex]})
    // console.log("INFO POCContainer :: _doUp, to " + FOCUS_LOC_ARR[this.currFocusLocIndex] + "\n")
  }//_doUp

  _doDown = () => {
    console.log("\n---")
    console.log("INFO POCContainer :: _doDown, from " + FOCUS_LOC_ARR[this.currFocusLocIndex])
    // let prevShelfIndex
    // let nextShelfIndex
    switch (this.currFocusLocIndex) {
      case GLOBAL_NAV_INDEX:
        //-- focus moves to the homeHero
        this.currFocusLocIndex += 1
        // this._changeOpacity(GLOBAL_NAV_INDEX, .6)
        // this._changeOpacity(HOME_SHELVES_INDEX, .6)
        break;
      case HOME_HERO_INDEX:
        //-- focus moves to the homeShelves
        this.currFocusLocIndex += 1
        // this._changeOpacity(HOME_HERO_INDEX, .6)
        // this._changeOpacity(HOME_SHELVES_INDEX, 1)
        this._changeLocation(GLOBAL_NAV_INDEX, this.upGlobalNavY)
        this._changeLocation(HOME_HERO_INDEX, this.upHomeHeroY)
        this._changeLocation(HOME_SHELVES_INDEX, this.upHomeShelvesY)
        this.currHomeShelvesY = this.upHomeShelvesY
        this.isFirstShelfSelected = true
        // TODO:: ***************************************************** //
        //console.log("this.selectablePanes[this.currFocusLocIndex]?? : " + this.selectablePanes[this.currFocusLocIndex])
        //this.selectablePanes[this.currFocusLocIndex]._onFocus()

        // this.selectedShelfIndex = 0  //-- the 1st shelf, CHECK!!!
        // nextShelfIndex = 1
        // this._selectTheFirstShelf()  //-- inside of the homeShelvesPane??
        // selectedShelfIndex = 0  //the first shelf selected
        // nextShelfIndex = 1
        // this.prevShelf = null
        // this.currShelf = this.shelves[0]
        // this.nextShelf = (nextShelfIndex < totalShelves) ? this.shelves[nextShelfIndex] : null
        // this.selectTheFirstShelf() 
        // ************************************************************ //
        break;
      case HOME_SHELVES_INDEX:
        if (this.isFirstShelfSelected) {
          //-- TODO: unless there's only one shelf
          this.isFirstShelfSelected = false
        }
        //-- handle inside of homeShelves pane
        console.log("CHECK  POCContainer :: _doDown, calling this.state.activeControllable.doDown()")
        //this.state.activeControllable.doDown() //CHECK, wrong way?????, temporarily commented out
    }//switch
    this.setState({activeControllable: this.selectablePanes[this.currFocusLocIndex]})
    //console.log("INFO POCContainer :: _doDown, to " + FOCUS_LOC_ARR[this.currFocusLocIndex] + "\n")
  }//_doDown

  _doLeft = () => {
    console.log('INFO POCContainer :: _doLeft');
    if (this.currFocusLocIndex == HOME_SHELVES_INDEX) {
      console.log('INFO POCContainer :: do _doLeft in the HomeShelvesPane');
    }
  }//_doLeft

  _doRight = () => {
    console.log('INFO POCContainer :: _doRight');
    if (this.currFocusLocIndex == HOME_SHELVES_INDEX) {
      console.log('INFO POCContainer :: do _doRight in the HomeShelvesPane');
    }
  }//_doRight

  _doSelect = () => {
    console.log('INFO POCContainer :: _doSelect');
    if (this.currFocusLocIndex == HOME_SHELVES_INDEX) {
      console.log('INFO POCContainer :: do _doSelect in the HomeShelvesPane');
    }
  }//_doSelect

  _changeOpacity = (targetIndex, targetValue, pDuration=STD_DURATION) => {
    //console.log("INFO POCContainer :: _changeOpacity, " + targetIndex + ": " + FOCUS_LOC_ARR[targetIndex] + " changeOpacity to " + targetValue)
    Animated.timing(
      this.state["animOpacity" + targetIndex], 
      {
        toValue: targetValue,
        duration: pDuration,
      }
    ).start();
  }//_changeOpacity

  _changeLocation = (targetIndex, targetValue, pDuration=STD_DURATION) => {
    //console.log("INFO POCContainer :: _changeLocation, " + targetIndex + ": " + FOCUS_LOC_ARR[targetIndex] + " change yLocation to " + targetValue)
    Animated.timing(
      this.state["animLocation" + targetIndex], 
      {
        toValue: targetValue,
        duration: pDuration,
        easing: Easing.out(Easing.quad),
      }
    ).start();

    if (targetIndex === HOME_SHELVES_INDEX) {
      this.currHomeShelvesY = targetValue
      //console.log("INFO POCContainer :: _changeLocation, this.currHomeShelvesY is " + this.currHomeShelvesY)
    }

  }//_changeLocation

  _onGlobalNavPaneFocus = () => {
    if (this.currFocusLocIndex !== GLOBAL_NAV_INDEX) return
    console.log("INFO POCContainer :: _onGlobalNavPaneFocus, onPressCallBack")

    this._changeOpacity(GLOBAL_NAV_INDEX, 1)
    this._changeOpacity(HOME_HERO_INDEX, 1)
    this._changeOpacity(HOME_SHELVES_INDEX, 1)
  }//_onGlobalNavPaneFocus

  _onHomeHeroPaneFocus = () => {
    if (this.currFocusLocIndex !== HOME_HERO_INDEX) return
    console.log("INFO POCContainer :: _onHomeHeroPaneFocus, onPressCallBack")

    this._changeOpacity(GLOBAL_NAV_INDEX, .6)
    this._changeOpacity(HOME_HERO_INDEX, 1)
    this._changeOpacity(HOME_SHELVES_INDEX, .6)
  }//_onHomeHeroPaneFocus

  _onShelvesPaneFocus = () => {
    if (this.currFocusLocIndex !== HOME_SHELVES_INDEX) return
    console.log("INFO POCContainer :: _onShelvesPaneFocus, onFocusCallBack")

    this._changeOpacity(GLOBAL_NAV_INDEX, .6)
    this._changeOpacity(HOME_HERO_INDEX, .6)
    this._changeOpacity(HOME_SHELVES_INDEX, 1)
  }//_onShelvesPaneFocus

  _onShelvesPaneBlur = () => {
    console.log("INFO POCContainer :: _onShelvesPaneBlur, onBlurCallBack")

    this.currFocusLocIndex = HOME_HERO_INDEX

    //-- focus moves to homeHero
    this._onHomeHeroPaneFocus()
    this._changeLocation(GLOBAL_NAV_INDEX, this.initGlobalNavY)
    this._changeLocation(HOME_HERO_INDEX, this.initHomeHeroY)
    this._changeLocation(HOME_SHELVES_INDEX, this.initHomeShelvesY)
    this.currHomeShelvesY = this.initHomeShelvesY
    this.isFirstShelfSelected = false

    this._setKeyListener()
  }//_onShelvesPaneBlur

  _onFirstShelfSelected = () => {
    console.log("INFO POCContainer :: _onFirstShelfSelected")
    this.isFirstShelfSelected = true

    //-- move down homeHero
    this._changeLocation(HOME_HERO_INDEX, this.upHomeHeroY)
    this._changeLocation(HOME_SHELVES_INDEX, this.upHomeShelvesY)
  }//_onFirstShelfSelected

  _onFirstShelfBloomed = () => {
    console.log("INFO POCContainer :: _onFirstShelfBloomed")
    this.isFirstShelfSelected = true

    //-- move homeHero further up
    this._changeLocation(HOME_HERO_INDEX, this.upMidHomeHeroY)
  }//_onFirstShelfSelected

  _onSecondShelfSelected = () => {
    console.log("INFO POCContainer :: _onSecondShelfSelected")

    //-- move up homeHero off the stage
    this._changeLocation(HOME_HERO_INDEX, this.upOffHomeHeroY)
    //this._changeLocation(HOME_SHELVES_INDEX, this.upOffHomeShelvesY)  //need?, adjust the value anyway!!!!!
  }//_onFirstShelfSelected

  _onShelvesDown = () => {
    console.log("INFO POCContainer :: _onShelvesDown")
    // console.log("INFO POCContainer :: _onShelvesDown, FOCUSED_SHELF_H is ???? " + FOCUSED_SHELF_H)

    //-- move up homeShelves pane by 'FOCUSED_SHELF_H'
    let targetY = this.currHomeShelvesY - FOCUSED_SHELF_H
    this._changeLocation(HOME_SHELVES_INDEX, targetY)
  }//_onShelvesDown

  _onShelvesUp = () => {
    console.log("INFO POCContainer :: _onShelvesUp, FOCUSED_SHELF_H is ???? " + FOCUSED_SHELF_H)

    //-- move down homeShelves pane by 'FOCUSED_SHELF_H'
    let targetY = this.currHomeShelvesY + FOCUSED_SHELF_H
    this._changeLocation(HOME_SHELVES_INDEX, targetY)
  }//_onShelvesDown

  // _selectTheFirstShelf = () => {
  //   // this.shelves[0].select()
  //   // //-- dimm out the rest
  //   // for (var i = 1; i < totalShelves; i++) {
  //   //   let target = this.shelves[i]
  //   //   target.opacityChange(.6)
  //   // }
  // }//_selectTheFirstShelf

  _renderGuide = () => {
    if (this.state.isGuideVisible) {
      return (
        <View style={styles.guideContainer}></View>
      )
    } else {
      return null;
    }
  }

  render() {
    //console.log("INFO POCContainer :: render")
    let { animOpacity0, animOpacity1, animOpacity2, animLocation0, animLocation1, animLocation2} = this.state
    return (
        <View style={styles.pocContainer}>
            <Animated.View
                      // ref={node => this.elts.push(node)} 
                      style={ { ...this.props.globalNavStyleObj,
                                top: animLocation0,
                                opacity: animOpacity0  } } >
                      <GlobalNavPane  
                                      ref={node => this.selectablePanes[GLOBAL_NAV_INDEX] = node}
                                      isFocused={this.currFocusLocIndex === GLOBAL_NAV_INDEX}
                                      onFocus={this._onGlobalNavPaneFocus}
                      />
            </Animated.View>
            <Animated.View
                      style={ { ...this.props.homeHeroStyleObj,
                                top: animLocation1,
                                opacity: animOpacity1  } } >
                      <HomeHeroPane   
                                      ref={node => this.selectablePanes[HOME_HERO_INDEX] = node}
                                      isFocused={this.currFocusLocIndex === HOME_HERO_INDEX}
                                      onFocus={this._onHomeHeroPaneFocus}
                      />
            </Animated.View>
            <Animated.View
                      style={ { ...this.props.homeShelvesStyleObj, 
                                top: animLocation2,
                                opacity: animOpacity2  } } >
                      <HomeShelvesPane  
                                      ref={node => this.selectablePanes[HOME_SHELVES_INDEX] = node}
                                      isFocused={this.currFocusLocIndex === HOME_SHELVES_INDEX}
                                      onFocus={this._onShelvesPaneFocus}
                                      onBlur={this._onShelvesPaneBlur}
                                      onFirstShelfSelected={this._onFirstShelfSelected}
                                      onFirstShelfBloomed={this._onFirstShelfBloomed}
                                      onSecondShelfSelected={this._onSecondShelfSelected}
                                      onShelvesDown={this._onShelvesDown}
                                      onShelvesUp={this._onShelvesUp}
                      />
            </Animated.View>
            {this._renderGuide()}
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
