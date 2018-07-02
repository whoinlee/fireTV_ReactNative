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
  View
} from 'react-native';
import KeyEvent from 'react-native-keyevent';

import config from './config';
import keyCodes from './keyCodes';
import styles from './styles/styles';
import GlobalNavPane from './components/GlobalNavPane';
import HomeHeroPane from './components/HomeHeroPane';
import HomeShelvesPane from './components/HomeShelvesPane';



/* --------- from config -------------------------------------------//
//-- density, animation duration, opacity, and
//-- initial pane location related
//----------------------------------------------------------------- */
const RATIO                 = config.density;
const STD_DURATION          = config.stdDuration;
const SHORT_DURATION        = config.shortDuration;
const UNSELECTED_OPACITY    = config.unselectedOpacity;
const SELECTED_OPACITY      = config.selectedOpacity;
//
const V_MIDDLE_Y            = Math.floor(config.stageH/(2*RATIO));          //-- vertical middle location of the stage
const INIT_GLOBAL_NAV_Y     = config.initGlobalNavY/RATIO;
const INIT_HOME_HERO_Y      = config.initHomeHeroY/RATIO;                   //-- 165 = (100(globalNav)+65(offset)
const INIT_HOME_SHELVES_Y   = config.initHomeShelvesY/RATIO;                //-- 836 = (100(globalNav)+65(offset)+606(homeHero)+65) = 836 
const INIT_HOME_HERO_H      = config.initHomeHeroH/RATIO;                   //-- 606


/* ---------- from config ------------------------------------------//
//-- homeShelvesPane location & dimension related
//----------------------------------------------------------------- */
const INIT_SHELF_Y          = config.homeShelves.initShelfY/RATIO;          //-- distance from the top of homeShelvesPane container to the top of 1st shelf container

const BASE_TITLE_H          = config.homeShelves.baseTitleH/RATIO;          //-- unselected shelf title height (!!!not same as the font size, 28)  
const TITLE_TO_TILE_OFFSET  = config.homeShelves.titleToTileOffset/RATIO;   //-- distance from the bottom of shelf title to the top of shelf tile

const BASE_TILE_H           = config.homeShelves.baseTileH/RATIO;           //-- base tile height, on an unselected shelf
const FOCUSED_TILE_H        = config.homeShelves.focusedTileH/RATIO;        //-- focused tile height, on a selected shelf
const BLOOMED_TILE_H        = config.homeShelves.bloomedTileH/RATIO;        //-- bloomed tile height, on a selected shelf

const BASE_SHELF_H          = config.homeShelves.baseShelfH/RATIO;          //-- baseTitleH (40) + titleToTileOffset (10) + baseTileH (180) + baseShelfOffsetY (106) = 336
const FOCUSED_SHELF_H       = config.homeShelves.focusedShelfH/RATIO;       //-- focusedTitleH (60) + titleToTileOffset (10) + focusedTileH (332) + focusedShelfOffsetY (182) = 584

const BASE_SHELF_OFFSET_Y   = config.homeShelves.baseShelfOffsetY/RATIO;    //-- TODO: not used
const FOCUSED_SHELF_OFFSET_Y= config.homeShelves.focusedShelfOffsetY/RATIO; //-- baseShelfOffsetY (106) + focusedShelfShiftY (76) = 182

const FOCUSED_SHELF_SHIFT_Y = config.homeShelves.focusedShelfShiftY/RATIO;  //-- the y location shift of unselected shelves on selected shelf being focused: (focusedTileH (332) - baseTileH (180))/2 = 76
const BLOOMED_SHELF_SHIFT_Y = config.homeShelves.bloomedShelfShiftY/RATIO;  //-- the y location shift of unselected shelves on selected shelf being large bloomed: (bloomedTileH (594) - focusedTileH (332))/2 = 131




const SHELF_H           = BLOOMED_TILE_H
const TILE_TOP          = (BLOOMED_TILE_H - BASE_TILE_H)/2
const BASE_TITLE_TOP    = TILE_TOP - TITLE_TO_TILE_OFFSET
const NEXT_SHELF_OFFSET = (SHELF_H-(BLOOMED_TILE_H-BASE_TILE_H)/2)         //-- (BLOOMED_TILE_H - BASE_TILE_H)/2 : distance (offset) between prev and next shelf tiles



/* ------------------------------------------ */
/* POCContainerK specific constants           */
/* ------------------------------------------ */
const FOCUS_LOC_ARR         = ['globalNavPane', 'homeHeroPane', 'homeShelvesPane'];
const GLOBAL_NAV_INDEX      = 0;
const HOME_HERO_INDEX       = 1;
const HOME_SHELVES_INDEX    = 2;


export default class POCContainerK extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animOpacity0: new Animated.Value(1),                    //-- for 'globalNav' opacity value with initial value of '1'
      animOpacity1: new Animated.Value(1),                    //-- for 'homeHero'
      animOpacity2: new Animated.Value(1),                    //-- for 'homeShelves'
      animLocation0: new Animated.Value(INIT_GLOBAL_NAV_Y),   //-- for 'globalNav' location value with the initial value of INIT_GLOBAL_NAV_Y
      animLocation1: new Animated.Value(INIT_HOME_HERO_Y),    //-- for 'homeHero'
      animLocation2: new Animated.Value(INIT_HOME_SHELVES_Y), //-- for 'homeShelves'
      isGuideVisible: false,
    }

    this.selectablePanes = []
    this.currFocusLocIndex = GLOBAL_NAV_INDEX 

    //-- initial pane locations
    this.initGlobalNavY = INIT_GLOBAL_NAV_Y
    this.initHomeHeroY = INIT_HOME_HERO_Y   
    this.initHomeShelvesY = INIT_HOME_SHELVES_Y

    //-- up pane locations
    // this.upHomeShelvesY = V_MIDDLE_Y - (INIT_SHELF_Y + BASE_TITLE_H + TITLE_TO_TILE_OFFSET + BASE_TILE_H/2)    //-- top of the homeShelves pane location, where the fist shelf is v-aligned with the center of the stage
    this.upHomeShelvesY = V_MIDDLE_Y - (BLOOMED_TILE_H/2)                   //-- top of the homeShelves pane location, where the fist shelf is v-aligned with the center of the stage
    this.upHomeHeroY = this.upHomeShelvesY - INIT_HOME_HERO_H               //-- homeHeroPane shifts on homeShelves pane and its first shelf being focused

    //TODO: recalculate
    this.paneShiftOffsetY = this.initHomeShelvesY - this.upHomeShelvesY + (FOCUSED_TILE_H - BASE_TILE_H)/2        //bc, the fist shelf tile will be focused : (332-180)/2
    this.upGlobalNavY = this.initGlobalNavY - this.paneShiftOffsetY     

    //TODO: recalculate
    //-- mid-up and off the stage homeHero pane locations
    this.upMidHomeHeroY = this.upHomeHeroY - BLOOMED_SHELF_SHIFT_Y           //-- homeHeroPane shifts on the fist shelf being largeBloomed
    //TODO: recalculate, -100: hack
    this.upOffHomeHeroY = this.upHomeHeroY - FOCUSED_SHELF_OFFSET_Y - 100    //-- homeHeroPane shifts/hides on the 2nd shelf being focused
  }

  componentDidMount() {
    this._setKeyListener()
  }//componentDidMount

  componentWillUnmount() {
    this._removeKeyListener()
  }//componentWillUnmount
/*
  _enableTVEventHandler() {
    this.tvEventHandler.enable(this, function(cmp, evt) {
      //console.log('INFO :: _enableTVEventHandler, cmp? : ' + cmp.constructor.name);  //POCContainer
      if (evt) {
        console.log('INFO POCContainer :: _enableTVEventHandler, evt.eventType? : ' + evt.eventType);
        switch (evt.eventType) {
          case 'focus':
            console.log('INFO POCContainer :: _enableTVEventHandler, evt.tag? : ' + evt.tag);
          case 'blur':
          case 'select':
            break;
          case 'left':
          case 'right':
          case 'up':
          case 'down':
            console.log('INFO POCContainer :: _enableTVEventHandler, ever???? : ' + evt.eventType);
            break;
          case 'playPause':
            console.log('INFO POCContainer :: playPause ===>');
            break;
          case 'rewind':
            console.log('INFO POCContainer :: rewind ======>');
           break;
          case 'fastForward':
            console.log('INFO POCContainer :: fastForward =>');
            break;
          default:
            console.log('INFO POCContainer :: _enableTVEventHandler, default, evt.eventType? : ' + evt.eventType);
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
*/
  _setKeyListener = () => {
    //console.log('INFO POCContainer :: _setKeyListener')
    KeyEvent.onKeyDownListener((keyEvent) => {
      //console.log('INFO POCContainer :: componentDidMount, keyCode ? : ' + keyEvent.keyCode);
      switch (keyEvent.keyCode) {
        case keyCodes.up:
          this.doUp()
          break
        case keyCodes.down:
          this.doDown()
          break
        case keyCodes.left:
          this.doLeft()
          break
        case keyCodes.right:
          this.doRight()
          break
        case keyCodes.center:
        case keyCodes.return:
          this.doSelect()
          break
        case keyCodes.toggleGuide:
        case keyCodes.playPause:
          this._toggleGuide()
          break
        case keyCodes.toggleOutline:
          // this.selectablePanes[HOME_SHELVES_INDEX].toggleOutline()
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
    // console.log('INFO POCContainer :: _removeKeyListener')
    KeyEvent.removeKeyDownListener()
  }//_removeKeyListener

  doUp = () => {
    if (this.currFocusLocIndex === GLOBAL_NAV_INDEX) return //-- do nothing
    console.log('INFO POCContainer :: doUp');

    switch (this.currFocusLocIndex) {
      case HOME_HERO_INDEX :
        this._onGlobalNavPaneFocus()
        break;
      case HOME_SHELVES_INDEX :
        this.selectablePanes[HOME_SHELVES_INDEX].doUp()
        break;
    }
  }//doUp

  doDown = () => {
    console.log('INFO POCContainer :: doDown, this.currFocusLocIndex ? ' + this.currFocusLocIndex);

    switch (this.currFocusLocIndex) {
      case GLOBAL_NAV_INDEX :
        this._onHomeHeroPaneFocus()
        break;
      case HOME_HERO_INDEX :
        this._onHomeShelvesPaneFocus()
        break;
      case HOME_SHELVES_INDEX :
        this.selectablePanes[HOME_SHELVES_INDEX].doDown()
        break;
    }
  }//doDown

  doLeft = () => {
    if (this.currFocusLocIndex !== HOME_SHELVES_INDEX) return
    this.selectablePanes[HOME_SHELVES_INDEX].doLeft()
  }//doLeft

  doRight = () => {
    if (this.currFocusLocIndex !== HOME_SHELVES_INDEX) return
    this.selectablePanes[HOME_SHELVES_INDEX].doRight()
  }//doRight

  doSelect = () => {
    if (this.currFocusLocIndex !== HOME_SHELVES_INDEX) return //-- do nothing
    this.selectablePanes[HOME_SHELVES_INDEX].doSelect()
  }//doSelect

  _changeOpacity = (targetIndex, targetValue, pDuration=0) => {
    //console.log("INFO POCContainer :: _changeOpacity, " + targetIndex + ": " + FOCUS_LOC_ARR[targetIndex] + " changeOpacity to " + targetValue)
    Animated.timing(this.state["animOpacity" + targetIndex]).stop()
    Animated.timing(this.state["animOpacity" + targetIndex], 
      {
        toValue: targetValue,
        duration: pDuration,
      }
    ).start()
  }//_changeOpacity

  _changeLocation = (targetIndex, targetValue, pDuration=STD_DURATION) => {
    //console.log("INFO POCContainer :: _changeLocation, " + targetIndex + ": " + FOCUS_LOC_ARR[targetIndex] + " change yLocation to " + targetValue)
    Animated.timing(this.state["animLocation" + targetIndex]).stop()
    Animated.timing(this.state["animLocation" + targetIndex], 
      {
        toValue: targetValue,
        duration: pDuration,
        easing: Easing.out(Easing.quad),
      }
    ).start()
  }//_changeLocation

  _onGlobalNavPaneFocus = () => {
    if (this.currFocusLocIndex === GLOBAL_NAV_INDEX) return
    //console.log("INFO POCContainer :: _onGlobalNavPaneFocus, ====================> prevFocusLocIndex ? " + this.currFocusLocIndex)
    this._changeOpacity(GLOBAL_NAV_INDEX, SELECTED_OPACITY)
    this._changeOpacity(HOME_HERO_INDEX, SELECTED_OPACITY)
    this._changeOpacity(HOME_SHELVES_INDEX, SELECTED_OPACITY)
    this._changeLocation(GLOBAL_NAV_INDEX, this.initGlobalNavY)
    this._changeLocation(HOME_HERO_INDEX, this.initHomeHeroY)
    this._changeLocation(HOME_SHELVES_INDEX, this.initHomeShelvesY)
    this._hideGuide()
    this.currFocusLocIndex = GLOBAL_NAV_INDEX
    // console.log("INFO POCContainer :: _onGlobalNavPaneFocus, ====================> currFocusLocIndex ? " + this.currFocusLocIndex)
  }//_onGlobalNavPaneFocus

  _onHomeHeroPaneFocus = () => {
    if (this.currFocusLocIndex === HOME_HERO_INDEX) return
    //console.log("INFO POCContainer :: _onHomeHeroPaneFocus, =====================> prevFocusLocIndex ? " + this.currFocusLocIndex)
    this._changeOpacity(GLOBAL_NAV_INDEX, UNSELECTED_OPACITY)
    this._changeOpacity(HOME_HERO_INDEX, SELECTED_OPACITY)
    this._changeOpacity(HOME_SHELVES_INDEX, UNSELECTED_OPACITY)
    this._changeLocation(GLOBAL_NAV_INDEX, this.initGlobalNavY)
    this._changeLocation(HOME_HERO_INDEX, this.initHomeHeroY)
    this._changeLocation(HOME_SHELVES_INDEX, this.initHomeShelvesY)
    this._hideGuide()
    this.currFocusLocIndex = HOME_HERO_INDEX
    // console.log("INFO POCContainer :: _onHomeHeroPaneFocus, =====================> currFocusLocIndex ? " + this.currFocusLocIndex)
  }//_onHomeHeroPaneFocus

  _onHomeShelvesPaneFocus = () => {
    if (this.currFocusLocIndex === HOME_SHELVES_INDEX) return
    //console.log("INFO POCContainer :: _onHomeShelvesPaneFocus, ======================> prevFocusLocIndex ? " + this.currFocusLocIndex)
    this._changeOpacity(GLOBAL_NAV_INDEX, UNSELECTED_OPACITY)
    this._changeOpacity(HOME_HERO_INDEX, UNSELECTED_OPACITY)
    this._changeOpacity(HOME_SHELVES_INDEX, SELECTED_OPACITY)
    this._changeLocation(GLOBAL_NAV_INDEX, this.upGlobalNavY)
    //this._changeLocation(HOME_HERO_INDEX, this.upHomeHeroY) //--TODO : check
    this._changeLocation(HOME_SHELVES_INDEX, this.upHomeShelvesY)
    //this._showGuide()
    this.currFocusLocIndex = HOME_SHELVES_INDEX
    // console.log("INFO POCContainer :: _onHomeShelvesPaneFocus, ======================> currFocusLocIndex ? " + this.currFocusLocIndex)
    this.selectablePanes[HOME_SHELVES_INDEX].doDown()
  }//_onHomeShelvesPaneFocus

  _updateHomeHeroLocation = (shelfIndex, isBloomed) => {
    //-- covered by _onHomeShelvesPaneBlur
    if (shelfIndex < 0 || shelfIndex > 1) return
    // console.log("INFO POCContainer :: _updateHomeHeroLocation, shelfIndex is ?? " + shelfIndex)
    switch (shelfIndex) {
      case 0:
        let targetY = (isBloomed)? this.upMidHomeHeroY : this.upHomeHeroY
        this._changeLocation(HOME_HERO_INDEX, targetY)
        break;
      case 1:
        this._changeLocation(HOME_HERO_INDEX, this.upOffHomeHeroY)
      default:
    }
  }//_updateHomeHeroLocation

  _updateHomeShelvesLocation = (shelfIndex) => {
    if (shelfIndex < 0) return  //-- covered by _onHomeShelvesPaneBlur
    const targetY = this.upHomeShelvesY - (shelfIndex) * NEXT_SHELF_OFFSET   //-- Jun21
    this._changeLocation(HOME_SHELVES_INDEX, targetY)
  }//_updateHomeShelvesLocation

  _toggleGuide = () => { this.setState({isGuideVisible: !this.state.isGuideVisible}) }

  _showGuide = () => { if (!this.state.isGuideVisible) this.setState({isGuideVisible: true}) }

  _hideGuide = () => { if (this.state.isGuideVisible) this.setState({isGuideVisible: false}) }

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
    //console.log("INFO POCContainer :: render --------------------------------------------------------------->")
    const { animOpacity0, animOpacity1, animOpacity2, animLocation0, animLocation1, animLocation2, isOutlineVisible } = this.state
    return (
        <View style={styles.pocContainer}>
            <Animated.View
                      style={ { ...this.props.globalNavStyleObj,
                                top: animLocation0,
                                opacity: animOpacity0  } } >
                      <GlobalNavPane
                                ref={node => {this.selectablePanes[GLOBAL_NAV_INDEX] = node}} /> 
            </Animated.View>
            <Animated.View
                      style={ { ...this.props.homeHeroStyleObj,
                                top: animLocation1,
                                opacity: animOpacity1  } } >
                      <HomeHeroPane
                                ref={node => {this.selectablePanes[HOME_HERO_INDEX] = node}} />
            </Animated.View>
            <Animated.View
                      style={ { ...this.props.homeShelvesStyleObj, 
                                top: animLocation2,
                                opacity: animOpacity2  } } >
                      <HomeShelvesPane
                                ref={node => {this.selectablePanes[HOME_SHELVES_INDEX] = node}}
                                onBlur={this._onHomeHeroPaneFocus}
                                updateHomeHeroLocation={this._updateHomeHeroLocation}
                                updateHomeShelvesLocation={this._updateHomeShelvesLocation}
                      />
            </Animated.View>
            {this._renderGuide()}
        </View>

    );
  }//render
}//POCContainer


POCContainerK.propTypes = {
  globalNavStyleObj: PropTypes.object,
  homeHeroStyleObj: PropTypes.object,
  homeShelvesStyleObj: PropTypes.object
}

POCContainerK.defaultProps = {
  globalNavStyleObj: StyleSheet.flatten(styles.globalNavContainer),
  homeHeroStyleObj: StyleSheet.flatten(styles.homeHeroContainer),
  homeShelvesStyleObj: StyleSheet.flatten(styles.homeShelvesContainer)
}