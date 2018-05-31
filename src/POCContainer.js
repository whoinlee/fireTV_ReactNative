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
import toControllable from './components/toControllable'
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

const ControllableGlobalNav = toControllable(GlobalNavPane)
const ControllableHomeHero = toControllable(HomeHeroPane)
const ControllableHomeShelves = toControllable(HomeShelvesPane)

export default class POCContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeControllable: null,
      controllables: [],
      animOpacity0: new Animated.Value(1), //-- animation instance for 'globalNav' with initial opacity value of '1'
      animOpacity1: new Animated.Value(1), //-- for 'homeHero'
      animOpacity2: new Animated.Value(1), //-- for 'homeShelves'
      animLocation0: new Animated.Value(INIT_GLOBAL_NAV_Y),   //-- animation instance for 'globalNav' with initial location value of INIT_GLOBAL_NAV_Y
      animLocation1: new Animated.Value(INIT_HOME_HERO_Y),    //-- for 'homeHero'
      animLocation2: new Animated.Value(INIT_HOME_SHELVES_Y), //-- for 'homeShelves'
    }

    this.selectablePanes = []
    this.currFocusLocIndex = GLOBAL_NAV_INDEX
    this.selectedShelfIndex = -1  
    this.currHomeShelvesY = INIT_HOME_SHELVES_Y
    this.isFirstShelfSelected = false
    
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
    
    this.tvEventHandler = new TVEventHandler()
  }

  _registerControllable = (
    onFocus,
    onBlur,
    onLeft,
    onRight,
    onUp,
    onDown,
    onPress,
  ) => {
    this.state.controllables.push({
      onFocus,
      onBlur,
      onLeft,
      onRight,
      onUp,
      onDown,
      onPress,
    });

    this.setState({ controllables: this.state.controllables });
  }

  componentDidMount() {
    KeyEvent.onKeyDownListener((keyEvent) => {
      console.log('INFO POCContainer :: componentDidMount, keyCode ? : ' + keyEvent.keyCode);
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
            //console.log('INFO POCContainer :: componentDidMount, default - keyCode ? : ' + keyEvent.keyCode);
        }//switch
    });//onKeyDownListener

    //-- temporarily disabled
    //this._enableTVEventHandler();
  }//componentDidMount

  componentWillUnmount() {
    KeyEvent.removeKeyDownListener()
    this._disableTVEventHandler();
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
            console.log('INFO POCContainer :: _doBlur');
          //   //cmp._doBlur();
            break;
          case 'focus':
            console.log('INFO POCContainer :: focus');
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
    if (this.tvEventHandler) {
      this.tvEventHandler.disable()
      delete this.tvEventHandler
    }
  }//_disableTVEventHandler

  _doUp = () => {
    console.log("---")
    console.log("INFO POCContainer :: _doUp, from " + FOCUS_LOC_ARR[this.currFocusLocIndex])
    switch (this.currFocusLocIndex) {
      case HOME_SHELVES_INDEX:
        if (this.isFirstShelfSelected) {
          //-- focus moves to the homeHero
          this.currFocusLocIndex -= 1
          //
          this._changeOpacity(HOME_HERO_INDEX, 1)
          this._changeOpacity(HOME_SHELVES_INDEX, .6)
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
        this._changeOpacity(GLOBAL_NAV_INDEX, 1)
        this._changeOpacity(HOME_SHELVES_INDEX, 1)
        //-- homeShelvesPane moves to the location, upHomeShelvesY, where the first shelf tiles' vertical center is located at V_CENTER_Y
        break;
      case GLOBAL_NAV_INDEX:
        //-- do nothing
    }//switch
    this.setState({activeControllable: this.selectablePanes[this.currFocusLocIndex]})
    // console.log("INFO POCContainer :: _doUp, to " + FOCUS_LOC_ARR[this.currFocusLocIndex] + "\n")
  }//_doUp

  _doDown = () => {
    console.log("---")
    console.log("INFO POCContainer :: _doDown, from " + FOCUS_LOC_ARR[this.currFocusLocIndex])
    // let prevShelfIndex
    // let nextShelfIndex
    switch (this.currFocusLocIndex) {
      case GLOBAL_NAV_INDEX:
        //-- focus moves to the homeHero
        this.currFocusLocIndex += 1
        this._changeOpacity(GLOBAL_NAV_INDEX, .6)
        this._changeOpacity(HOME_SHELVES_INDEX, .6)
        break;
      case HOME_HERO_INDEX:
        //-- focus moves to the homeShelves
        this.currFocusLocIndex += 1
        this._changeOpacity(HOME_HERO_INDEX, .6)
        this._changeOpacity(HOME_SHELVES_INDEX, 1)
        this._changeLocation(GLOBAL_NAV_INDEX, this.upGlobalNavY)
        this._changeLocation(HOME_HERO_INDEX, this.upHomeHeroY)
        this._changeLocation(HOME_SHELVES_INDEX, this.upHomeShelvesY)
        this.currHomeShelvesY = this.upHomeShelvesY
        this.isFirstShelfSelected = true
        // TODO:: ***************************************************** //
        console.log("this.selectablePanes[this.currFocusLocIndex]?? : " + this.selectablePanes[this.currFocusLocIndex])
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
  }

  _doRight = () => {
    console.log('INFO POCContainer :: _doRight');
    if (this.currFocusLocIndex == HOME_SHELVES_INDEX) {
      console.log('INFO POCContainer :: do _doRight in the HomeShelvesPane');
    }
  }

  _doSelect = () => {
    console.log('INFO POCContainer :: _doSelect');
    if (this.currFocusLocIndex == HOME_SHELVES_INDEX) {
      console.log('INFO POCContainer :: do _doSelect in the HomeShelvesPane');
    }
  }

  _toggleGuides = () => {

  }

  

  _changeOpacity = (targetIndex, targetValue, pDuration=STD_DURATION) => {
    //console.log("INFO POCContainer :: _changeOpacity, " + targetIndex + ": " + FOCUS_LOC_ARR[targetIndex] + " changeOpacity to " + targetValue)
    Animated.timing(
      this.state["animOpacity" + targetIndex], 
      {
        toValue: targetValue,
        duration: pDuration,
      }
    ).start();
  }

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
  }

  // _selectTheFirstShelf = () => {
  //   // this.shelves[0].select()
  //   // //-- dimm out the rest
  //   // for (var i = 1; i < totalShelves; i++) {
  //   //   let target = this.shelves[i]
  //   //   target.opacityChange(.6)
  //   // }
  // }//_selectTheFirstShelf





  _onShelvesPanePressed() {
    console.log("INFO POCContainer :: _onShelvesPanePressed, onPressCallBack")
    if (this.currFocusLocIndex !== HOME_SHELVES_INDEX) return
    //do something
  }

  _onFirstShelfSelected = () => {
    console.log("INFO POCContainer :: _onFirstShelfSelected, onFirstShelfSelected")
    this.isFirstShelfSelected = true
  }

  render() {
    console.log("INFO POCContainer :: render")
    let { animOpacity0, animOpacity1, animOpacity2, animLocation0, animLocation1, animLocation2} = this.state
    return (
        <View style={styles.pocContainer}>
            <Animated.View  
                      // ref={node => this.elts.push(node)} 
                      style={ { ...this.props.globalNavStyleObj,
                                top: animLocation0,
                                opacity: animOpacity0  } } >
                      <GlobalNavPane  
                          // onFocus={()=> {console.log("INFO POCCOntainer :: CGN, onFocus")}}
                          // onBlur={()=> {console.log("INFO POCCOntainer :: CGN, onBlur")}}
                          // onLeft={()=> {console.log("INFO POCCOntainer :: CGN, onLeft")}}
                          // onRight={()=> {console.log("INFO POCCOntainer :: CGN, onRight")}}
                          // onUp={()=> {console.log("INFO POCCOntainer :: CGN, onUp")}}
                          // onDown={()=> {console.log("INFO POCCOntainer :: CGN, onDown")}}
                          // onPress={()=> {console.log("INFO POCCOntainer :: CGN, onPress")}}
                      />
            </Animated.View>
            <Animated.View  
                      // ref={node => this.elts.push(node)}
                      style={ { ...this.props.homeHeroStyleObj,
                                top: animLocation1,
                                opacity: animOpacity1  } } >
                      <HomeHeroPane   
                                      ref={node => this.selectablePanes[HOME_HERO_INDEX] = node}
                                      onPress={this._onGlobalNavPanePressed}
                                      // onFocus={()=> {console.log("INFO POCCOntainer :: CHP, onFocus")}}
                                      // onBlur={()=> {console.log("INFO POCCOntainer :: CHP, onBlur")}}
                                      // onLeft={()=> {console.log("INFO POCCOntainer :: CHP, onLeft")}}
                                      // onRight={()=> {console.log("INFO POCCOntainer :: CHP, onRight")}}
                                      // onUp={()=> {console.log("INFO POCCOntainer :: CHP, onUp")}}
                                      // onDown={()=> {console.log("INFO POCCOntainer :: CHP, onDown")}}
                                      // onPress={()=> {console.log("INFO POCCOntainer :: CHP, onPress")}}
                                      //onTouchableHandleActivePressIn={console.log("touchableHandleActivePressIn for HomeHeroPane")}
                                      //onTouchableHandleActivePressOut={console.log("touchableHandleActivePressOut for HomeHeroPane")}
                                      //onTouchableHandlePress={console.log("touchableHandlePress for HomeHeroPane")}
                      />
            </Animated.View>
            <Animated.View  
                      // ref={node => this.elts.push(node)} 
                      style={ { ...this.props.homeShelvesStyleObj, 
                                top: animLocation2,
                                opacity: animOpacity2  } } >
                      <HomeShelvesPane  
                                      ref={node => this.selectablePanes[HOME_SHELVES_INDEX] = node}
                                      onPress={this._onShelvesPanePressed}
                                      onFirstShelfSelected={this._onFirstShelfSelected}
                                      // onFocus={()=> {console.log("INFO POCCOntainer :: CHS, onFocus")}}
                                      // onBlur={()=> {console.log("INFO POCCOntainer :: CHS, onBlur")}}
                                      // onLeft={()=> {console.log("INFO POCCOntainer :: CHS, onLeft")}}
                                      // onRight={()=> {console.log("INFO POCCOntainer :: CHS, onRight")}}
                                      // onUp={()=> {console.log("INFO POCCOntainer :: CHS, onUp")}}
                                      // onDown={()=> {console.log("INFO POCCOntainer :: CHS, onDown")}}
                                      // onPress={()=> {console.log("INFO POCCOntainer :: CHS, onPress")}}
                                      //onTouchableHandleActivePressIn={console.log("touchableHandleActivePressIn for HomeShelvesPane")}
                                      //onTouchableHandleActivePressOut={console.log("touchableHandleActivePressOut for HomeShelvesPane")}
                                      //onTouchableHandlePress={console.log("touchableHandlePress for HomeShelvesPane")}
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
