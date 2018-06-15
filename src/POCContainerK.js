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
import GlobalNavPane from './components/GlobalNavPaneK';
import HomeHeroPane from './components/HomeHeroPaneK';
import HomeShelvesPane from './components/HomeShelvesPaneK';


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
const V_MIDDLE_Y            = Math.floor(config.stageH/(2*RATIO));  //-- vertical middle location of the stage
const INIT_GLOBAL_NAV_Y     = config.initGlobalNavY/RATIO;
const INIT_HOME_HERO_Y      = config.initHomeHeroY/RATIO;           //-- 165 = (100(globalNav)+65(offset)
const INIT_HOME_SHELVES_Y   = config.initHomeShelvesY/RATIO;        //-- 836 = (100(globalNav)+65(offset)+606(homeHero)+65) = 836 


/* ---------- from config ------------------------------------------//
//-- homeShelvesPane location & dimension related
//----------------------------------------------------------------- */
const INIT_SHELF_Y          = config.homeShelves.initShelfY/RATIO;          //-- distance from the top of homeShelvesPane container to the top of 1st shelf container

const BASE_TITLE_H          = config.homeShelves.baseTitleH/RATIO;          //-- unselected shelf title height (!!!not same as the font size, 28)  
const TITLE_TO_TILE_OFFSET  = config.homeShelves.titleToTileOffset/RATIO;   //-- distance from the bottom of shelf title to the top of shelf tile

const BASE_TILE_H           = config.homeShelves.baseTileH/RATIO;           //-- base tile height, on an unselected shelf
const FOCUSED_TILE_H        = config.homeShelves.focusedTileH/RATIO;        //-- focused tile height, on a selected shelf

const BASE_SHELF_H          = config.homeShelves.baseShelfH/RATIO;          //-- baseTitleH (40) + titleToTileOffset (10) + baseTileH (180) + baseShelfOffsetY (106) = 336
const FOCUSED_SHELF_H       = config.homeShelves.focusedShelfH/RATIO;       //-- focusedTitleH (60) + titleToTileOffset (10) + focusedTileH (332) + focusedShelfOffsetY (182) = 584

const BASE_SHELF_OFFSET_Y   = config.homeShelves.baseShelfOffsetY/RATIO;    //-- TODO: not used
const FOCUSED_SHELF_OFFSET_Y= config.homeShelves.focusedShelfOffsetY/RATIO; //-- baseShelfOffsetY (106) + focusedShelfShiftY (76) = 182

const FOCUSED_SHELF_SHIFT_Y = config.homeShelves.focusedShelfShiftY/RATIO;  //-- the y location shift of unselected shelves on selected shelf being focused: (focusedTileH (332) - baseTileH (180))/2 = 76
const BLOOMED_SHELF_SHIFT_Y = config.homeShelves.bloomedShelfShiftY/RATIO;  //-- the y location shift of unselected shelves on selected shelf being large bloomed: (bloomedTileH (594) - focusedTileH (332))/2 = 131


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
      animOpacity0: new Animated.Value(1),                    //-- animation instance for 'globalNav' with initial opacity value of '1'
      animOpacity1: new Animated.Value(1),                    //-- for 'homeHero'
      animOpacity2: new Animated.Value(1),                    //-- for 'homeShelves'
      animLocation0: new Animated.Value(INIT_GLOBAL_NAV_Y),   //-- animation instance for 'globalNav' with initial location value of INIT_GLOBAL_NAV_Y
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
    this.upHomeShelvesY = V_MIDDLE_Y - (INIT_SHELF_Y + BASE_TITLE_H + TITLE_TO_TILE_OFFSET + BASE_TILE_H/2)       //-- top of the homeShelves pane location, where the fist shelf is v-aligned with the center of the stage
    this.paneShiftOffsetY = this.initHomeShelvesY - this.upHomeShelvesY + (FOCUSED_TILE_H - BASE_TILE_H)/2        //bc, the fist shelf tile will be focused : (332-180)/2
    this.upGlobalNavY = this.initGlobalNavY - this.paneShiftOffsetY
    this.upHomeHeroY = this.initHomeHeroY - this.paneShiftOffsetY           //-- homeHeroPane shifts on homeShelves pane and its first shelf being focused

    //-- mid-up and off the stage homeHero pane locations
    this.upMidHomeHeroY = this.upHomeHeroY - BLOOMED_SHELF_SHIFT_Y          //-- homeHeroPane shifts on the fist shelf being largeBloomed
    this.upOffHomeHeroY = this.upHomeHeroY - FOCUSED_SHELF_OFFSET_Y         //-- homeHeroPane shifts/hides on the 2nd shelf being focused
  }

  componentDidMount() {
    //this._enableTVEventHandler()
    this._setKeyListener()
  }//componentDidMount

  componentWillUnmount() {
    //_disableTVEventHandler()
    this._removeKeyListener()
  }//componentWillUnmount

  _enableTVEventHandler() {
    this.tvEventHandler = new TVEventHandler()
    console.log('INFO :: _enableTVEventHandler, this.tvEventHandler ? ' + this.tvEventHandler);
    //
    this.tvEventHandler.enable(this, function(cmp, evt) {
      //console.log('INFO :: _enableTVEventHandler, cmp? : ' + cmp.constructor.name);  //POCContainer
      if (evt) {
        console.log('INFO POCContainerK :: _enableTVEventHandler, evt.eventType? : ' + evt.eventType);
        switch (evt.eventType) {
          case 'focus':
            console.log('INFO POCContainerK :: _enableTVEventHandler, evt.tag? : ' + evt.tag);
          case 'blur':
          case 'select':
            break;
          case 'left':
          case 'right':
          case 'up':
          case 'down':
            console.log('INFO POCContainerK :: _enableTVEventHandler, ever???? : ' + evt.eventType);
            break;
          case 'playPause':
            console.log('INFO POCContainerK :: playPause ===>');
            break;
          case 'rewind':
            console.log('INFO POCContainerK :: rewind ======>');
           break;
          case 'fastForward':
            console.log('INFO POCContainerK :: fastForward =>');
            break;
          default:
            console.log('INFO POCContainerK :: _enableTVEventHandler, default, evt.eventType? : ' + evt.eventType);
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
    console.log('INFO POCContainerK :: _setKeyListener')
    KeyEvent.onKeyDownListener((keyEvent) => {
      // console.log('INFO POCContainerK :: componentDidMount, keyCode ? : ' + keyEvent.keyCode);
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
          this._toggleGuide()
          break
        case keyCodes.reload:
          //-- for reloading the app: r, r
          //-- do nothing
          break
        default:
          console.log('INFO POCContainerK :: _setKeyListener, default - keyCode ? : ' + keyEvent.keyCode);
      }//switch
    });//onKeyDownListener
  }//_setKeyListener

  _removeKeyListener = () => {
    console.log('INFO POCContainerK :: _removeKeyListener')
    KeyEvent.removeKeyDownListener()
  }//_removeKeyListener

  _toggleGuide = () => { this.setState({isGuideVisible: !this.state.isGuideVisible}) }

  _showGuide = () => { if (!this.state.isGuideVisible) this.setState({isGuideVisible: true}) }

  _hideGuide = () => { if (this.state.isGuideVisible) this.setState({isGuideVisible: false}) }

  doUp = () => {
    console.log('INFO POCContainerK :: doUp');

    switch (this.currFocusLocIndex) {
      case GLOBAL_NAV_INDEX :
        //-- do nothing
        break;
      case HOME_HERO_INDEX :
        this._onGlobalNavPaneFocus()
        break;
      case HOME_SHELVES_INDEX :
        this.selectablePanes[HOME_SHELVES_INDEX].doUp()
        break;
    }
  }//doUp

  doDown = () => {
    console.log('INFO POCContainerK :: doDown, this.currFocusLocIndex ? ' + this.currFocusLocIndex);

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
    console.log('INFO POCContainerK :: _doLeft');
    if (this.currFocusLocIndex == HOME_SHELVES_INDEX) {
      console.log('INFO POCContainerK :: do _doLeft in the HomeShelvesPane');
    }
  }//doLeft

  doRight = () => {
    console.log('INFO POCContainerK :: _doRight');
    if (this.currFocusLocIndex == HOME_SHELVES_INDEX) {
      console.log('INFO POCContainerK :: do _doRight in the HomeShelvesPane');
    }
  }//doRight

  doSelect = () => {
    console.log('INFO POCContainerK :: _doSelect');
    if (this.currFocusLocIndex == HOME_SHELVES_INDEX) {
      console.log('INFO POCContainerK :: do _doSelect in the HomeShelvesPane');
    }
  }//doSelect

  _changeOpacity = (targetIndex, targetValue, pDuration=STD_DURATION) => {
    //console.log("INFO POCContainerK :: _changeOpacity, " + targetIndex + ": " + FOCUS_LOC_ARR[targetIndex] + " changeOpacity to " + targetValue)
    Animated.timing(
      this.state["animOpacity" + targetIndex], 
      {
        toValue: targetValue,
        duration: pDuration,
      }
    ).start();
  }//_changeOpacity

  _changeLocation = (targetIndex, targetValue, pDuration=STD_DURATION) => {
    //console.log("INFO POCContainerK :: _changeLocation, " + targetIndex + ": " + FOCUS_LOC_ARR[targetIndex] + " change yLocation to " + targetValue)
    Animated.timing(
      this.state["animLocation" + targetIndex], 
      {
        toValue: targetValue,
        duration: pDuration,
        easing: Easing.out(Easing.quad),
      }
    ).start();
  }//_changeLocation

  _onGlobalNavPaneFocus = () => {
    //console.log("INFO POCContainerK :: _onGlobalNavPaneFocus, ====================> prevFocusLocIndex ? " + this.currFocusLocIndex)
    if (this.currFocusLocIndex === GLOBAL_NAV_INDEX) return
    
    this._changeOpacity(GLOBAL_NAV_INDEX, SELECTED_OPACITY)
    this._changeOpacity(HOME_HERO_INDEX, SELECTED_OPACITY)
    this._changeOpacity(HOME_SHELVES_INDEX, SELECTED_OPACITY)
    this._changeLocation(GLOBAL_NAV_INDEX, this.initGlobalNavY)
    this._changeLocation(HOME_HERO_INDEX, this.initHomeHeroY)
    this._changeLocation(HOME_SHELVES_INDEX, this.initHomeShelvesY)
    this._hideGuide()

    this.currFocusLocIndex = GLOBAL_NAV_INDEX

    console.log("INFO POCContainerK :: _onGlobalNavPaneFocus, ====================> currFocusLocIndex ? " + this.currFocusLocIndex)
  }//_onGlobalNavPaneFocus

  _onHomeHeroPaneFocus = () => {
    //console.log("INFO POCContainerK :: _onHomeHeroPaneFocus, =====================> prevFocusLocIndex ? " + this.currFocusLocIndex)
    if (this.currFocusLocIndex === HOME_HERO_INDEX) return
    
    this._changeOpacity(GLOBAL_NAV_INDEX, UNSELECTED_OPACITY)
    this._changeOpacity(HOME_HERO_INDEX, SELECTED_OPACITY)
    this._changeOpacity(HOME_SHELVES_INDEX, UNSELECTED_OPACITY)
    this._changeLocation(GLOBAL_NAV_INDEX, this.initGlobalNavY)
    this._changeLocation(HOME_HERO_INDEX, this.initHomeHeroY)
    this._changeLocation(HOME_SHELVES_INDEX, this.initHomeShelvesY)
    this._hideGuide()

    this.currFocusLocIndex = HOME_HERO_INDEX

    //console.warn("on homeHeroPane focus");
    console.log("INFO POCContainerK :: _onHomeHeroPaneFocus, =====================> currFocusLocIndex ? " + this.currFocusLocIndex)
  }//_onHomeHeroPaneFocus

  _onHomeShelvesPaneFocus = () => {
    //console.log("INFO POCContainerK :: _onHomeShelvesPaneFocus, ======================> prevFocusLocIndex ? " + this.currFocusLocIndex)
    if (this.currFocusLocIndex === HOME_SHELVES_INDEX) return
    
    this._changeOpacity(GLOBAL_NAV_INDEX, UNSELECTED_OPACITY)
    this._changeOpacity(HOME_HERO_INDEX, UNSELECTED_OPACITY)
    this._changeOpacity(HOME_SHELVES_INDEX, SELECTED_OPACITY)
    this._changeLocation(GLOBAL_NAV_INDEX, this.upGlobalNavY)
    //this._changeLocation(HOME_HERO_INDEX, this.upHomeHeroY)
    this._changeLocation(HOME_SHELVES_INDEX, this.upHomeShelvesY)
    this._showGuide()

    this.currFocusLocIndex = HOME_SHELVES_INDEX
    console.log("INFO POCContainerK :: _onHomeShelvesPaneFocus, ======================> currFocusLocIndex ? " + this.currFocusLocIndex)

    this.selectablePanes[HOME_SHELVES_INDEX].doDown()
  }//_onHomeShelvesPaneFocus

  _onHomeShelvesPaneBlur = () => {
    console.log("INFO POCContainerK :: _onHomeShelvesPaneBlur")
    this._onHomeHeroPaneFocus()
  }//_onHomeShelvesPaneBlur

  _updateHomeHeroLocation = (shelfIndex, isBloomed) => {
    //-- covered by _onHomeShelvesPaneBlur
    if (shelfIndex < 0 || shelfIndex > 1) return

    console.log("INFO POCContainerK :: _updateHomeHeroLocation, shelfIndex is ?? " + shelfIndex)
    console.log("INFO POCContainerK :: _updateHomeHeroLocation, isBloomed is ?? " + isBloomed)

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
    //-- covered by _onHomeShelvesPaneBlur
    if (shelfIndex < 0) return

    console.log("INFO POCContainerK :: _updateHomeShelvesLocation, shelfIndex is ?? " + shelfIndex)
    // console.log("INFO POCContainerK :: _updateHomeShelvesLocation, isBloomed is ?? " + isBloomed)

    let targetY = this.upHomeShelvesY - (shelfIndex) * BASE_SHELF_H
    this._changeLocation(HOME_SHELVES_INDEX, targetY)
  }//_updateHomeShelvesLocation

  _onShelvesPaneSelect = () => {
    console.log("INFO POCContainerK :: _onShelvesPaneSelect, onSelectCallBack =====> POCContainer")
  }//_onShelvesPaneSelect

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
    console.log("INFO POCContainerK :: render --------------------------------------------------------------->")
    let { animOpacity0, animOpacity1, animOpacity2, animLocation0, animLocation1, animLocation2} = this.state
    return (
        <View style={styles.pocContainer}>
            <Animated.View
                      style={ { ...this.props.globalNavStyleObj,
                                top: animLocation0,
                                opacity: animOpacity0  } } >
                      <GlobalNavPane
                                ref={node => {this.selectablePanes[GLOBAL_NAV_INDEX] = node}}
                                // onFocus={this._onGlobalNavPaneFocus}

                                //onBlur={this._onGlobalNavPaneBlur}
                                //onSelect={this._onGlobalNavPaneSelect}
                                // isFocused={this.currFocusLocIndex === GLOBAL_NAV_INDEX}
                      />
            </Animated.View>
            <Animated.View
                      style={ { ...this.props.homeHeroStyleObj,
                                top: animLocation1,
                                opacity: animOpacity1  } } >
                      <HomeHeroPane
                                ref={node => {this.selectablePanes[HOME_HERO_INDEX] = node}}
                                // onFocus={this._onHomeHeroPaneFocus}
                                //onBlur={this._onHomeHeroPaneBlur}
                                //onSelect={this._onHomeHeroPaneSelect}
                                // isFocused={this.currFocusLocIndex === HOME_HERO_INDEX}
                      />
            </Animated.View>
            <Animated.View
                      style={ { ...this.props.homeShelvesStyleObj, 
                                top: animLocation2,
                                opacity: animOpacity2  } } >
                      <HomeShelvesPane
                                ref={node => {this.selectablePanes[HOME_SHELVES_INDEX] = node}}

                                onBlur={this._onHomeShelvesPaneBlur}
                                updateHomeHeroLocation={this._updateHomeHeroLocation}
                                updateHomeShelvesLocation={this._updateHomeShelvesLocation}

                                // onFocus={this._onHomeShelvesPaneFocus}
                                //onBlur={this._onShelvesPaneBlur}
                                //onSelect={this._onShelvesPaneSelect}
                                // isFocused={this.currFocusLocIndex === HOME_SHELVES_INDEX}
                                // onFirstShelfSelected={this._onFirstShelfSelected}
                                // onFirstShelfBloomed={this._onFirstShelfBloomed}
                                // onSecondShelfSelected={this._onSecondShelfSelected}
                                // onShelvesDown={this._onShelvesDown}
                                // onShelvesUp={this._onShelvesUp}
                      />
            </Animated.View>
            {this._renderGuide()}
        </View>

    );
  }
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
