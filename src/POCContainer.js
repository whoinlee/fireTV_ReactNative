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
// import KeyEvent from 'react-native-keyevent';

import config from './config';
// import keyCodes from './keyCodes';
import styles from './styles/styles';
import GlobalNavPane from './components/GlobalNavPane';
import HomeHeroPane from './components/HomeHeroPane';
import HomeShelvesPane from './components/HomeShelvesPane';


//---------- from config -----------------------------------------//
/*
  //-- base dimension and density
  density: PixelRatio.get(),    //TV density
  stageW: 1920,
  stageH: 1080,

  //-- animation related
  stdDuration: 500,             //in milliseconds = .5 sec,
  shortDuration: 350,           //in milliseconds = .35 sec,
  waitToLargeBloomDuration: 4000,

  //-- pane initial location
  initGlobalNavY: 0,
  initHomeHeroY: 165,
  initHomeShelvesY: 836,

  //-- pane initial dimension
  initGlobalNavH: 100,
  initHomeHeroH: 606,

  //-- opacity related
  unselectedOpacity: 1,
  selectedOpacity: .6,
*/
const RATIO               = config.density;
const STD_DURATION        = config.stdDuration;
const SHORT_DURATION      = config.shortDuration;
//
const INIT_GLOBAL_NAV_Y   = config.initGlobalNavY/RATIO;
const INIT_HOME_HERO_Y    = config.initHomeHeroY/RATIO;           //-- 165 = (100(globalNav)+65(offset)
const INIT_HOME_SHELVES_Y = config.initHomeShelvesY/RATIO;        //-- 836 = (100(globalNav)+65(offset)+606(homeHero)+65) = 836 
//
const V_MIDDLE_Y          = Math.floor(config.stageH/(2*RATIO));  //-- vertical middle location of the stage
const UNSELECTED_OPACITY  = config.unselectedOpacity;
const SELECTED_OPACITY    = config.selectedOpacity;

/*
//-- homeShelvesPane location & dimension related
homeShelves: {
  initShelfY: 62,             //-- distance from the top of homeShelvesPane container to the top of 1st shelf container

  //-- shelf title related
  baseTitleH: 40,             //-- unselected shelf title height (!!!not same as the font size, 28)
  focusedTitleH: 60,          //-- update!!!
  titleToTileOffset: 10,      //-- distance from the bottom of shelf title to the top of shelf tile
  
  //-- tile dimensions
  baseTileW: 320,             //-- unselected base tile width, 320x180
  baseTileH: 180,             //-- unselected base tile height
  focusedTileW: 590,          //-- focused tile width, on a selected shelf, 590x332
  focusedTileH: 332,          //-- focused tile height, on a selected shelf
  bloomedTileW: 1056,         //-- large bloomed tile width, on a selected shelf, 1056x594
  bloomedTileH: 594,          //-- large bloomed tile height, on a selected shelf
  // ??? focused unselected tile dimension ??? (375x210)
  // ??? bloomed unselected tile dimension ??? (782x440)

  //-- shelf related
  baseShelfOffsetX: 0,        //-- distance between tiles on an unselected shelf
  baseShelfOffsetY: 106,      //-- distance between unselected shelves
  baseShelfH: 336,            //-- baseTitleH (40) + titleToTileOffset (10) + baseTileH (180) + baseShelfOffsetY (106) = 336

  focusedShelfShiftY: 76,     //-- the y location shift of unselected shelves on selected shelf being focused: (focusedTileH (332) - baseTileH (180))/2 = 76
  bloomedShelfShiftY: 131,    //-- the y location shift of unselected shelves on selected shelf being large bloomed: (bloomedTileH (594) - focusedTileH (332))/2 = 131
  
  focusedShelfOffsetX: 25,    //-- distance between tiles on a focused shelf
  focusedShelfOffsetY: 182,   //-- baseShelfOffsetY (106) + focusedShelfShiftY (76) = 182
  focusedShelfH: 584,         //-- focusedTitleH (60) + titleToTileOffset (10) + focusedTileH (332) + focusedShelfOffsetY (182) = 584

  bloomedShelfOffsetX: 57,    //-- distance between tiles on a focused shelf ?????
  bloomedShelfOffsetY: 313,   //-- focusedShelfOffsetY (182) + bloomedShelfShiftY (131) = 313
  bloomedShelfH: 543          //-- focusedTitleH (60) + titleToTileOffset (10) + bloomedTileH (594) + bloomedShelfOffsetY (313) = 977
}
*/
const INIT_SHELF_Y          = config.homeShelves.initShelfY/RATIO;

const BASE_TITLE_H          = config.homeShelves.baseTitleH/RATIO;         
const TITLE_TO_TILE_OFFSET  = config.homeShelves.titleToTileOffset/RATIO;

const BASE_TILE_H           = config.homeShelves.baseTileH/RATIO;
const FOCUSED_TILE_H        = config.homeShelves.focusedTileH/RATIO; 

const BASE_SHELF_OFFSET_Y   = config.homeShelves.baseShelfOffsetY/RATIO;
const BASE_SHELF_H          = config.homeShelves.baseShelfH/RATIO;
// const BASE_SHELF_H = BASE_SHELF_OFFSET_Y;

const FOCUSED_SHELF_SHIFT_Y = config.homeShelves.focusedShelfShiftY/RATIO;
const BLOOMED_SHELF_SHIFT_Y = config.homeShelves.bloomedShelfShiftY/RATIO;

// const FOCUSED_SHELF_OFFSET_Y  = BASE_SHELF_H + FOCUSED_SHELF_SHIFT_Y;
const FOCUSED_SHELF_OFFSET_Y= config.homeShelves.focusedShelfOffsetY/RATIO;
const FOCUSED_SHELF_H       = config.homeShelves.focusedShelfH/RATIO;  
/* ------------------------------------------ */


/* ------------------------------------------ */
/* POCContainer specific constants            */
/* ------------------------------------------ */
const FOCUS_LOC_ARR       = ['globalNavPane', 'homeHeroPane', 'homeShelvesPane'];
const GLOBAL_NAV_INDEX    = 0;
const HOME_HERO_INDEX     = 1;
const HOME_SHELVES_INDEX  = 2;


export default class POCContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animOpacity0: new Animated.Value(1),    //-- animation instance for 'globalNav' with initial opacity value of '1'
      animOpacity1: new Animated.Value(1),    //-- for 'homeHero'
      animOpacity2: new Animated.Value(1),    //-- for 'homeShelves'
      animLocation0: new Animated.Value(INIT_GLOBAL_NAV_Y),   //-- animation instance for 'globalNav' with initial location value of INIT_GLOBAL_NAV_Y
      animLocation1: new Animated.Value(INIT_HOME_HERO_Y),    //-- for 'homeHero'
      animLocation2: new Animated.Value(INIT_HOME_SHELVES_Y), //-- for 'homeShelves'
      isGuideVisible: false,
    }

    this.tvEventHandler = new TVEventHandler()

    this.selectablePanes = []
    this.currFocusLocIndex = GLOBAL_NAV_INDEX //CHECK : needs to move to the state
    this.selectedShelfIndex = -1  
    this.currHomeShelvesY = INIT_HOME_SHELVES_Y
    this.isFirstShelfSelected = false

    //-- set panes' initial locations
    this.initGlobalNavY = INIT_GLOBAL_NAV_Y
    this.initHomeHeroY = INIT_HOME_HERO_Y   
    this.initHomeShelvesY = INIT_HOME_SHELVES_Y

    //-- set panes' up locations
    this.upHomeShelvesY = V_MIDDLE_Y - (INIT_SHELF_Y + BASE_TITLE_H + TITLE_TO_TILE_OFFSET + BASE_TILE_H/2)       //-- top of the homeShelves pane location, where the fist shelf is v-aligned with the center of the stage
    this.paneShiftOffsetY = this.initHomeShelvesY - this.upHomeShelvesY + (FOCUSED_TILE_H - BASE_TILE_H)/2        //bc, the fist shelf tile will be focused : (332-180)/2
    this.upGlobalNavY = this.initGlobalNavY - this.paneShiftOffsetY
    this.upHomeHeroY = this.initHomeHeroY - this.paneShiftOffsetY           //-- homeHeroPane shifts on homeShelves pane and its first shelf being focused
    //this.upHomeShelvesY = TOP_Y

    //-- set panes' mid-up and off the stage locations
    this.upMidHomeHeroY = this.upHomeHeroY - BLOOMED_SHELF_SHIFT_Y          //-- homeHeroPane shifts on the fist shelf being largeBloomed
    //
    this.upOffHomeHeroY = this.upHomeHeroY - FOCUSED_SHELF_OFFSET_Y         //-- homeHeroPane shifts/hides on the 2nd shelf being focused
    this.upOffHomeShelvesY = this.upHomeShelvesY -  FOCUSED_SHELF_OFFSET_Y  //-- need?????
  }

  componentDidMount() {
    this._enableTVEventHandler()
    //this._setKeyListener()
  }//componentDidMount

  componentWillUnmount() {
    _disableTVEventHandler()
    //this._removeKeyListener()
  }//componentWillUnmount

  _enableTVEventHandler() {
    this.tvEventHandler = new TVEventHandler()
    console.log('INFO :: _enableTVEventHandler, this.tvEventHandler ? ' + this.tvEventHandler);
    //
    this.tvEventHandler.enable(this, function(cmp, evt) {
      //console.log('INFO :: _enableTVEventHandler, cmp? : ' + cmp.constructor.name);  //POCContainer
      if (evt) {
        console.log('INFO POCContainer :: _enableTVEventHandler, evt.eventType? : ' + evt.eventType);
        switch (evt.eventType) {
          case 'blur':
          case 'focus':
          case 'select':
            //console.log('INFO POCContainer :: _enableTVEventHandler, evt.eventType? : ' + evt.eventType);
            console.log('INFO POCContainer :: _enableTVEventHandler, evt.tag? : ' + evt.tag);
            break;
          case 'left':
          case 'right':
          case 'up':
          case 'down':
            console.log('INFO POCContainer :: _enableTVEventHandler, ever???? : ' + evt.eventType);
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
          default:
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
      console.log('INFO POCContainer :: componentDidMount, keyCode ? : ' + keyEvent.keyCode);
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
          //-- for reloading the app: r, r
          //-- do nothing
          break
        default:
          console.log('INFO POCContainer :: _setKeyListener, default - keyCode ? : ' + keyEvent.keyCode);
      }//switch
    });//onKeyDownListener
  }//_setKeyListener

  _removeKeyListener = () => {
    console.log('INFO POCContainer :: _removeKeyListener')
    KeyEvent.removeKeyDownListener()
  }//_removeKeyListener

  _toggleGuide = () => { this.setState({isGuideVisible: !this.state.isGuideVisible}) }

  _showGuide = () => { if (!this.state.isGuideVisible) this.setState({isGuideVisible: true}) }

  _hideGuide = () => { if (this.state.isGuideVisible) this.setState({isGuideVisible: false}) }

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
    console.log("INFO POCContainer :: _onGlobalNavPaneFocus, ====================> prevFocusLocIndex ? " + this.currFocusLocIndex)

    if (this.currFocusLocIndex === GLOBAL_NAV_INDEX) return
    
    this._changeOpacity(GLOBAL_NAV_INDEX, SELECTED_OPACITY)
    this._changeOpacity(HOME_HERO_INDEX, SELECTED_OPACITY)
    this._changeOpacity(HOME_SHELVES_INDEX, SELECTED_OPACITY)
    this._changeLocation(GLOBAL_NAV_INDEX, this.initGlobalNavY)
    this._changeLocation(HOME_HERO_INDEX, this.initHomeHeroY)
    this._changeLocation(HOME_SHELVES_INDEX, this.initHomeShelvesY)
    this._hideGuide()

    this.currFocusLocIndex = GLOBAL_NAV_INDEX
    this.currHomeShelvesY = this.initHomeShelvesY

    console.log("INFO POCContainer :: _onGlobalNavPaneFocus, ====================> currFocusLocIndex ? " + this.currFocusLocIndex)
  }//_onGlobalNavPaneFocus

  _onHomeHeroPaneFocus = () => {
    console.log("INFO POCContainer :: _onHomeHeroPaneFocus, =====================> prevFocusLocIndex ? " + this.currFocusLocIndex)

    if (this.currFocusLocIndex === HOME_HERO_INDEX) return
    
    this._changeOpacity(GLOBAL_NAV_INDEX, UNSELECTED_OPACITY)
    this._changeOpacity(HOME_HERO_INDEX, SELECTED_OPACITY)
    this._changeOpacity(HOME_SHELVES_INDEX, UNSELECTED_OPACITY)
    this._changeLocation(GLOBAL_NAV_INDEX, this.initGlobalNavY)
    this._changeLocation(HOME_HERO_INDEX, this.initHomeHeroY)
    this._changeLocation(HOME_SHELVES_INDEX, this.initHomeShelvesY)
    this._hideGuide()

    this.currFocusLocIndex = HOME_HERO_INDEX
    this.currHomeShelvesY = this.initHomeShelvesY

    console.log("INFO POCContainer :: _onHomeHeroPaneFocus, =====================> currFocusLocIndex ? " + this.currFocusLocIndex)
  }//_onHomeHeroPaneFocus

  _onShelvesPaneFocus = () => {
    console.log("INFO POCContainer :: _onShelvesPaneFocus, ======================> prevFocusLocIndex ? " + this.currFocusLocIndex)

    if (this.currFocusLocIndex === HOME_SHELVES_INDEX) return
    
    this._changeOpacity(GLOBAL_NAV_INDEX, UNSELECTED_OPACITY)
    this._changeOpacity(HOME_HERO_INDEX, UNSELECTED_OPACITY)
    this._changeOpacity(HOME_SHELVES_INDEX, SELECTED_OPACITY)
    this._changeLocation(GLOBAL_NAV_INDEX, this.upGlobalNavY)
    this._changeLocation(HOME_HERO_INDEX, this.upHomeHeroY)
    this._changeLocation(HOME_SHELVES_INDEX, this.upHomeShelvesY)
    this._showGuide()

    this.currFocusLocIndex = HOME_SHELVES_INDEX
    this.currHomeShelvesY = this.upHomeShelvesY

    //TODO: CHECK
    this.isFirstShelfSelected = true

    console.log("INFO POCContainer :: _onShelvesPaneFocus, ======================> currFocusLocIndex ? " + this.currFocusLocIndex)
  }//_onShelvesPaneFocus

  _onGlobalNavPaneBlur = () => {
    // if (this.currFocusLocIndex !== GLOBAL_NAV_INDEX) return
    console.log("INFO POCContainer :: _onGlobalNavPaneBlur, onBlurCallBack =====> POCContainer")

    // this._changeOpacity(GLOBAL_NAV_INDEX, 1)
    // this._changeOpacity(HOME_HERO_INDEX, 1)
    // this._changeOpacity(HOME_SHELVES_INDEX, 1)
  }//_onGlobalNavPaneFocus

  _onGlobalNavPaneSelect = () => {
    // if (this.currFocusLocIndex !== GLOBAL_NAV_INDEX) return
    console.log("INFO POCContainer :: _onGlobalNavPaneSelect, onSelectCallBack =====> POCContainer")

    // this._changeOpacity(GLOBAL_NAV_INDEX, 1)
    // this._changeOpacity(HOME_HERO_INDEX, 1)
    // this._changeOpacity(HOME_SHELVES_INDEX, 1)
  }//_onGlobalNavPaneFocus

  _onHomeHeroPaneBlur = () => {
    // if (this.currFocusLocIndex !== HOME_HERO_INDEX) return
    console.log("INFO POCContainer :: _onHomeHeroPaneBlur, onBlurCallBack =====> POCContainer")

    // this._changeOpacity(GLOBAL_NAV_INDEX, .4)
    // this._changeOpacity(HOME_HERO_INDEX, 1)
    // this._changeOpacity(HOME_SHELVES_INDEX, .4)
  }//_onHomeHeroPaneFocus

  _onHomeHeroPaneSelect = () => {
    // if (this.currFocusLocIndex !== HOME_HERO_INDEX) return
    console.log("INFO POCContainer :: _onHomeHeroPaneSelect, onSelectCallBack =====> POCContainer")

    // this._changeOpacity(GLOBAL_NAV_INDEX, .4)
    // this._changeOpacity(HOME_HERO_INDEX, 1)
    // this._changeOpacity(HOME_SHELVES_INDEX, .4)
  }//_onHomeHeroPaneFocus

  _onShelvesPaneBlur = () => {
    console.log("INFO POCContainer :: _onShelvesPaneBlur, onBlurCallBack =====> POCContainer")

    // this.currFocusLocIndex = HOME_HERO_INDEX

    // //-- focus moves to homeHero
    // this._onHomeHeroPaneFocus()
    // this._changeLocation(GLOBAL_NAV_INDEX, this.initGlobalNavY)
    // this._changeLocation(HOME_HERO_INDEX, this.initHomeHeroY)
    // this._changeLocation(HOME_SHELVES_INDEX, this.initHomeShelvesY)
    // this.currHomeShelvesY = this.initHomeShelvesY
    // this.isFirstShelfSelected = false

    // this._setKeyListener()
  }//_onShelvesPaneBlur

  _onShelvesPaneSelect = () => {
    // if (this.currFocusLocIndex !== HOME_HERO_INDEX) return
    console.log("INFO POCContainer :: _onShelvesPaneSelect, onSelectCallBack =====> POCContainer")

    // this._changeOpacity(GLOBAL_NAV_INDEX, .4)
    // this._changeOpacity(HOME_HERO_INDEX, 1)
    // this._changeOpacity(HOME_SHELVES_INDEX, .4)
  }//_onHomeHeroPaneFocus

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
  }//_onFirstShelfBloomed

  _onSecondShelfSelected = () => {
    console.log("INFO POCContainer :: _onSecondShelfSelected")

    //-- move up homeHero off the stage
    this._changeLocation(HOME_HERO_INDEX, this.upOffHomeHeroY)
    //this._changeLocation(HOME_SHELVES_INDEX, this.upOffHomeShelvesY)  //need?, adjust the value anyway!!!!!
  }//_onSecondShelfSelected

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
  }//_onShelvesUp

  _renderGuide = () => {
    if (this.state.isGuideVisible) {
      return (
        <View style={styles.guideContainer}></View>
      )
    } else {
      return null;
    }
  }//_renderGuide

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
                                      ref={node => this.selectablePanes[GLOBAL_NAV_INDEX] = node}
                                      isFocused={this.currFocusLocIndex === GLOBAL_NAV_INDEX}

                                      onFocus={this._onGlobalNavPaneFocus}
                                      //onBlur={this._onGlobalNavPaneBlur}
                                      //onSelect={this._onGlobalNavPaneSelect}
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
                                      //onBlur={this._onHomeHeroPaneBlur}
                                      //onSelect={this._onHomeHeroPaneSelect}
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
                                      //onBlur={this._onShelvesPaneBlur}
                                      //onSelect={this._onShelvesPaneSelect}

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
