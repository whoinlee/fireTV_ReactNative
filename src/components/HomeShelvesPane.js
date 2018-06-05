import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  Image,
  Text,
  TouchableWithoutFeedback,
  // TouchableNativeFeedback,
  View
} from 'react-native';
import KeyEvent from 'react-native-keyevent';
import HomeShelf from './ui/HomeShelf';

import config from '../config';
import keyCodes from '../keyCodes';
import styles from '../styles/styles';


const RATIO                 = config.density;
const STD_DURATION          = config.stdDuration;
const SHORT_DURATION        = config.shortDuration;
//
const SHELVES_DATA_ARR      = [
  {
    title:'up next',
    shows:[
          { showTitle: "Top Chef", episodeTitle: "Now That's a lot of Schnitzel", episode: 'S15 E6', 
            episodeDesc: "For the Quickfire, Padma and Richard Blais inspire the chefs using Tasty online videos and challenge them to transform the most laborious dishes from their own menus into accessible thirty minute dishes for home cooks. For the Quickfire, Padma and Richard Blais inspire the chefs using Tasty online videos and challenge them to transform the most laborious dishes from their own menus into accessible thirty minute dishes for home cooks.",
            imageURL: require('../assets/images/shows/topChef-s15e06-1056x594.jpg') }
          ,{ showTitle: "Top Chef", episodeTitle: "Something Old, Something New", episode: 'S14 E1', 
            episodeDesc: "Episode Description for S14 E1 goes here",
            imageURL: require('../assets/images/shows/topChef-s14e01-1056x594.jpg') }
          ,{ showTitle: "Below Deck", episodeTitle: "Only Doing It for the Money", episode: 'S5 E11', 
            episodeDesc: "Episode Description for S5 E11 goes here",
            imageURL: require('../assets/images/shows/belowDeck-s05e11-1056x594.jpg') }
          ,{ showTitle: "Real Housewives", episodeTitle: "When Chairs Fly", episode: 'S8 E9', 
            episodeDesc: "Episode Description for S8 E9 goes here",
            imageURL: require('../assets/images/shows/rhofNJ-s08e09-1056x594.jpg') }
          ,{ showTitle: "Imposters", episodeTitle: "Always Forward, Never Back", episode: 'S1 E10', 
            episodeDesc: "Episode Description for S1 E10 goes here",
            imageURL: require('../assets/images/shows/imposters-s01e10-1056x594.jpg') }
          ,{ showTitle: "Real Housewives", episodeTitle: "Another Spin Around the Block", episode: 'S9 E4', 
            episodeDesc: "Episode Description for S9 E4 goes here",
            imageURL: require('../assets/images/shows/rhofAT-s09e04-1056x594.jpg') }
          ,{ showTitle: "Top Chef", episodeTitle: "Shrimp Boats and Hat Ladies", episode: 'S14 E10', 
            episodeDesc: "Episode Description for S14 E10 goes here",
            imageURL: require('../assets/images/shows/topChef-s14e10-1056x594.jpg') }
      ]
  }
  ,{
    title:'recently added (6)',
    shows:[
        { showTitle: "Top Chef", episodeTitle: "Now That's a lot of Schnitzel", episode: 'S15 E6', 
          episodeDesc: "For the Quickfire, Padma and Richard Blais inspire the chefs using Tasty online videos and challenge them to transform the most laborious dishes from their own menus into accessible thirty minute dishes for home cooks.",
          imageURL: require('../assets/images/shows/topChef-s15e06-1056x594.jpg') }
        ,{ showTitle: "Below Deck", episodeTitle: "Only Doing It for the Money", episode: 'S5 E11', 
          episodeDesc: "Episode Description for S15 E6 goes here",
          imageURL: require('../assets/images/shows/belowDeck-s05e11-1056x594.jpg') }
        ,{ showTitle: "Real Housewives", episodeTitle: "When Chairs Fly", episode: 'S8 E9', 
          episodeDesc: "Episode Description for S15 E6 goes here",
          imageURL: require('../assets/images/shows/rhofNJ-s08e09-1056x594.jpg') }
        ,{ showTitle: "Imposters", episodeTitle: "Always Forward, Never Back", episode: 'S1 E10', 
          episodeDesc: "Episode Description for S15 E6 goes here",
          imageURL: require('../assets/images/shows/imposters-s01e10-1056x594.jpg') }
        ,{ showTitle: "Real Housewives", episodeTitle: "Another Spin Around the Block", episode: 'S9 E4', 
          episodeDesc: "Episode Description for S9 E4 goes here",
          imageURL: require('../assets/images/shows/rhofAT-s09e04-1056x594.jpg') }
        ,{ showTitle: "Top Chef", episodeTitle: "Shrimp Boats and Hat Ladies", episode: 'S14 E10', 
          episodeDesc: "Episode Description for S14 E10 goes here",
          imageURL: require('../assets/images/shows/topChef-s14e10-1056x594.jpg') }
      ]
  }
  ,{
    title:'category 3 (5)',
    shows:[
        {showTitle: "Top Chef", episodeTitle: "Episode Title", episode: 'S00 E0', 
        episodeDesc: "Episode Description for S00 E0 goes here",
        imageURL: require('../assets/images/shows/topChef-general-1056x594.jpg') },
        {showTitle: "Top Chef", episodeTitle: "The Curse of the Bambino", episode: 'S12 E3', 
        episodeDesc: "Episode Description for S12 E3 goes here",
        imageURL: require('../assets/images/shows/topChef-s12e03-1056x594.jpg') },
        {showTitle: "Real Housewives", episodeTitle: "House of Shade and Dust", episode: 'S9 E1', 
        episodeDesc: "Episode Description for S9 E1 goes here",
        imageURL: require('../assets/images/shows/rhofAT-s09e01-1056x594.jpg') },
        {showTitle: "Real Housewives", episodeTitle: "Reunion, Part 3", episode: 'S9 E23', 
        episodeDesc: "Episode Description for S9 E23 goes here",
        imageURL: require('../assets/images/shows/rhofAT-s09e23-1056x594.jpg') },
        {showTitle: "Top Chef", episodeTitle: "Shrimp Boats and Hat Ladies", episode: 'S14 E10', 
        episodeDesc: "Episode Description for S14 E10 goes here",
        imageURL: require('../assets/images/shows/topChef-s14e10-1056x594.jpg') }
      ]
  }
  ,{
    title:'category 4 (4)',
    shows:[
        {showTitle: "Top Chef", episodeTitle: "The Curse of the Bambino", episode: 'S12 E3', 
        episodeDesc: "Episode Description goes here",
        imageURL: require('../assets/images/shows/topChef-s12e03-1056x594.jpg') },
        {showTitle: "Imposters", episodeTitle: "Always Forward, Never Back", episode: 'S1 E10', 
        episodeDesc: "Episode Description goes here",
        imageURL: require('../assets/images/shows/imposters-s01e10-1056x594.jpg') },
        {showTitle: "Real Housewives", episodeTitle: "When Chairs Fly", episode: 'S8 E9', 
        episodeDesc: "Episode Description goes here",
        imageURL: require('../assets/images/shows/rhofNJ-s08e09-1056x594.jpg') },
        {showTitle: "Top Chef", episodeTitle: "Shrimp Boats and Hat Ladies", episode: 'S14 E10', 
        episodeDesc: "Episode Description goes here",
        imageURL: require('../assets/images/shows/topChef-s14e10-1056x594.jpg') }
      ]
  }
  ,{
    title:'category 5 (3)',
    shows:[
        {showTitle: "Below Deck", episodeTitle: "Only Doing It for the Money", episode: 'S5 E11', 
        episodeDesc: "Episode Description goes here",
        imageURL: require('../assets/images/shows/belowDeck-s05e11-1056x594.jpg') },
        {showTitle: "Real Housewives", episodeTitle: "When Chairs Fly", episode: 'S8 E9', 
        episodeDesc: "Episode Description goes here",
        imageURL: require('../assets/images/shows/rhofNJ-s08e09-1056x594.jpg') },
        {showTitle: "Top Chef", episodeTitle: "Shrimp Boats and Hat Ladies", episode: 'S14 E10', 
        episodeDesc: "Episode Description goes here",
        imageURL: require('../assets/images/shows/topChef-s14e10-1056x594.jpg') }
      ]
  }
  ,{
    title:'category 6 (2)',
    shows:[
        {showTitle: "Real Housewives", episodeTitle: "When Chairs Fly", episode: 'S8 E9', 
        episodeDesc: "Episode Description goes here",
        imageURL: require('../assets/images/shows/rhofNJ-s08e09-1056x594.jpg') },
        {showTitle: "Top Chef", episodeTitle: "Shrimp Boats and Hat Ladies", episode: 'S14 E10', 
        episodeDesc: "Episode Description goes here",
        imageURL: require('../assets/images/shows/topChef-s14e10-1056x594.jpg') }
      ]
  }
  ,{
    title:'category 7(1)',
    shows:[
       {showTitle: "Top Chef", episodeTitle: "Shrimp Boats and Hat Ladies", episode: 'S14 E10', 
       episodeDesc: "Episode Description goes here",
       imageURL: require('../assets/images/shows/topChef-s14e10-1056x594.jpg') }
      ]
  }
];//SHELVES_DATA_ARR: hardcoded test data
//
const TOTAL_SHELVES         = SHELVES_DATA_ARR.length;
const MAX_INDEX             = TOTAL_SHELVES - 1;
const INIT_SHELF_Y          = 62/RATIO;         //-- from container top to the 1st shelf title
//
const BASE_TILE_H           = 180/RATIO;        //90
const FOCUSED_TILE_H        = 332/RATIO;        //166
//
//const BASE_TITLE_H          = 28/RATIO;         //-- title height for Helvetica Light 28px
const BASE_TITLE_H          = 40/RATIO;         //-- title height for Helvetica Light 28px
const TITLE_N_TILE_OFFSET   = 10/RATIO;         //-- offset between title & tiles
const BASE_SHELF_OFFSET     = 106/RATIO;        //-- offset between shelves: from the bottom of previous shelf image to the top of next shelf title
const BASE_SHELF_H          = (BASE_TITLE_H + TITLE_N_TILE_OFFSET + BASE_TILE_H + BASE_SHELF_OFFSET);     //-- distance between unselected shelves
//
const FOCUSED_SHELF_SHIFT   = (FOCUSED_TILE_H - BASE_TILE_H)/2;    //-- (332-180)/2 = 76: how much unselected shelves shift on selected shelf's being focused
const FOCUSED_SHELF_H       = BASE_SHELF_H + FOCUSED_SHELF_SHIFT;
const BLOOMED_SHELF_SHIFT   = Math.floor(131/RATIO);
const FOCUSED_SHELF_OFFSET  = BASE_SHELF_OFFSET + FOCUSED_SHELF_SHIFT;

// console.log("\nINFO FOCUSED_SHELF_SHIFT 2 ?? " + FOCUSED_SHELF_SHIFT)
// console.log("INFO FOCUSED_SHELF_H 2 ?? " + FOCUSED_SHELF_H)


export default class HomeShelvesPane extends Component {
  constructor(props){
    super(props);
    this.state = {
      //isFocused: false,
      onFocusShelf: null,     //TODO: need to be here?
      selectedShelfIndex: -1, //TODO: need to be here?
      //isFirstShelfSelected: false,
      //shelvesTopY: initContainerY + 'px',
    }

    this.containerShiftOffsetY = 0

    this.isFocused = false
    this.isFirstShelfSelected = false
    this.selectedShelfIndex = -1

    this.shelves = []
    this.animsArr = []
    this.prevShelf = null
    this.currShelf = null
    this.nextShelf = null
    this.isPrevMoved = false
    this.isNextMoved = false
    
    this.totalMenu = 3
    this.totalShelves = 0

    // console.log("INFO HomeShelvesPane :: INIT_SHELF_Y ?? " + INIT_SHELF_Y)
  }

  componentDidMount() {
    this.totalShelves = this.shelves.length
  }//componentDidMount

  componentWillUnmount() {
    this._removeKeyListener()
  }//componentWillUnmount

  _setKeyListener = () => {
    console.log('INFO HomeShelvesPane :: _setKeyListener')
    KeyEvent.onKeyDownListener((keyEvent) => {
      //console.log("INFO HomeShelvesPane :: _setKeyListener, keyEvent.keyCode ? " + keyEvent.keyCode)
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
            console.log('INFO HomeShelvesPane :: _setKeyListener, keyCode ? : ' + keyEvent.keyCode);
        }//switch
    });//onKeyDownListener
  }

  _removeKeyListener = () => {
    console.log('INFO HomeShelvesPane :: _removeKeyListener')
    KeyEvent.removeKeyDownListener();
  }

  onFocus = () => {
    if (this.props.isFocused) {
      console.log('\nINFO HomeShelvesPane :: onFocus =====>');

      if (!this.isFocused) {
        this.isFocused = true
        this.isFirstShelfSelected = true  //-- check if this.shelves.lengh == 0, well .... at least a shelf exists
        //this.setState({selectedShelfIndex : 0})
        this.selectedShelfIndex = 0
        this._setKeyListener()
      }

      const { onFocus } = this.props;
      if (onFocus) {
        console.log('INFO HomeShelvesPane :: onFocus calling back from HomeShelvesPane');
        onFocus();
      }
    }
  }//onFocus

  onBlur = () => {
    console.log("\nINFO HomeShelvesPane :: onBlur =====>")

    if (!this.isFocused) return
    this.isFocused = false
    this.isFirstShelfSelected = false
    this.selectedShelfIndex = -1
    //this.setState({selectedShelfIndex : -1})
    this._removeKeyListener()

    const { onBlur } = this.props;
    if (onBlur) {
        console.log('INFO HomeShelvesPane :: onBlur calling back from HomeShelvesPane');
        onBlur();
    }
  }

  _doUp = () => {
    //console.log("---")
    console.log("\nINFO HomeShelvesPane :: _doUp, from HomeShelvesPane")

    if (this.selectedShelfIndex < 0) return

    this.selectedShelfIndex--
    if (this.selectedShelfIndex === -1) {
      //this.isFirstShelfSelected = false
      this.onBlur()
      return
    } else if (this.selectedShelfIndex === 0) {
      this.isFirstShelfSelected = true
      this.props.onFirstShelfSelected()
    }
    //-- do something here
    console.log("INFO HomeShelvesPane :: _doUp, from HomeShelvesPane, selectedShelfIndex is ? " + this.selectedShelfIndex)

  }//_doUp

  _doDown = () => {
    //console.log("---")
    console.log("\nINFO HomeShelvesPane :: _doDown, from HomeShelvesPane")

    this.isFirstShelfSelected = false
    this.selectedShelfIndex++
    if (this.selectedShelfIndex >= this.totalShelves) {
      this.selectedShelfIndex = this.totalShelves - 1
      return
    }

    //-- do something here
    console.log("INFO HomeShelvesPane :: _doDown, from HomeShelvesPane, selectedShelfIndex is ? " + this.selectedShelfIndex)
    if (this.selectedShelfIndex === 1) {
      this.props.onSecondShelfSelected()
    }

    if (this.selectedShelfIndex >= 1) {
      this.props.onShelvesDown()
    }

    //this.setState({selectedShelfIndex : this.state.selectedShelfIndex + 1})
    //console.log("\nINFO HomeShelvesPane :: onDown, from HomeShelvesPane, this.state.selectedShelfIndex ?? " + this.state.selectedShelfIndex )

    // switch (this._currFocusLocIndex) {
    //   case GLOBAL_NAV_INDEX:
    //     this._currFocusLocIndex += 1
    //     this._changeOpacity(GLOBAL_NAV_INDEX, .6)
    //     this._changeOpacity(HOME_HERO_INDEX, 1)
    //     this._changeOpacity(HOME_SHELVES_INDEX, .6)
    //     //-- TODO: reset homeShelves y location
    //     break;
    //   case HOME_HERO_INDEX:
    //     this._currFocusLocIndex += 1
    //     this._changeOpacity(HOME_HERO_INDEX, .6)
    //     this._changeOpacity(HOME_SHELVES_INDEX, 1)
    //     break;
    //   case HOME_SHELVES_INDEX:
    //     //-- handle inside of homeShelves pane
    // }//switch

    //console.log("INFO HomeShelvesPane :: doDown, to ")
    // console.log("INFO HomeShelvesPane :: _doDown, to " + FOCUS_LOC_ARR[this._currFocusLocIndex])
    //console.log(" ")
  }//_doDown

  _doLeft = () => {
    console.log('INFO HomeShelvesPane :: _onLeft, from HomeShelvesPane');
  }//_doLeft

  _doRight = () => {
    console.log('INFO HomeShelvesPane :: _onRight, from HomeShelvesPane');
  }//_doRight

  _doSelect = () => {
    console.log('INFO HomeShelvesPane :: _doSelect, from HomeShelvesPane');
  }//_doSelect

  _onLargeBloomStart = () => {
    //console.log("INFO HomeShelvesPane :: onLargeBloomStart")
    console.log("INFO HomeShelvesPane :: _onLargeBloomStart, this.state.selectedShelfIndex? " + this.state.selectedShelfIndex)
    // let prevY
    // let nextY
    // if (this.state.selectedShelfIndex === 0) {
    //   //-- when the first shelf is selected, move up the homeHeroCarousel
    //   if (this.upMidHomeHeroY === this.initHomeHeroY) this.upMidHomeHeroY = this.upHomeHeroY - bloomedShelfShiftY
    //   TL.to(this.elts[homeHero], stdDuration, {top: this.upMidHomeHeroY+'px', ease:Power3.easeOut})
    // } else {
    //   const prevShelfIndex = this.state.selectedShelfIndex - 1;
    //   this.prevShelf = this.shelves[prevShelfIndex]
    //   if (this.prevShelf !== null) {
    //     console.log("INFO HomeShelvesPane :: onLargeBloomStart, this.prevShelf !== null")
    //     prevY = this.prevShelf.props.y - bloomedShelfShiftY
    //     this.prevShelf.moveTo(prevY, stdDuration)
    //     this.isPrevMoved = true
    //   }
    // }
    // const nextShelfIndex = this.state.selectedShelfIndex + 1;
    // this.nextShelf = this.shelves[nextShelfIndex]
    // if (this.nextShelf !== null) {
    //   console.log("INFO HomeShelvesPane :: onLargeBloomStart, this.nextShelf !== null")
    //   nextY = this.nextShelf.props.y + bloomedShelfShiftY
    //   this.nextShelf.moveTo(nextY, stdDuration)
    //   this.isNextMoved = true
    // }
  }//_onLargeBloomStart

  _moveBackAdjacentShelves = () => {
    console.log("INFO HomeShelvesPane :: _moveBackAdjacentShelves, callBackOnBackToFocused")
    // this.moveBackPrevShelf()
    // this.moveBackNextShelf()
  }//_moveBackAdjacentShelves

  // _getNodeInfo(e) {
  //   //console.log('INFO HomeShelvesPane :: getNodeInfo, ever??? event is ', e)
  //   //console.log('INFO HomeShelvesPane :: getNodeInfo, node is ', this.node)
  // }

  _renderEachHomeShelf = (shelfObj, i) => {
    // console.log("INFO HomeShelvesPane :: _eachHomeShelf, i ? " + i)
    // console.log("INFO HomeShelvesPane :: _eachHomeShelf, topY ? " + (INIT_SHELF_Y + i*FOCUSED_SHELF_H))
    console.log("INFO HomeShelvesPane :: _eachHomeShelf, FOCUSED_SHELF_H ? " + FOCUSED_SHELF_H)
    return (
        <HomeShelf  
              key={(i + 1).toString()}
              index={i}
              // id={"HomeShelf" + i} 
              title={shelfObj.title}
              shows={shelfObj.shows}
              topY={INIT_SHELF_Y + i*FOCUSED_SHELF_H}
              ref={node => this.shelves.push(node)}
              callBackOnLargeBloomStart={this._onLargeBloomStart}
              callBackOnBackToFocused={this._moveBackAdjacentShelves} >
        </HomeShelf>
    )
  }//_renderEachHomeShelf

  // _onPress = () => {
  //   console.log("INFO HomeShelvesPane :: _onPress")
  //   this.props.onPress()
  // }

  // _onPressIn = () => {
  //   console.log("INFO HomeShelvesPane :: _onPressIn")
  //   //this.props.onPressCallBack()
  // }

  // _onPressOut = () => {
  //   console.log("INFO HomeShelvesPane :: _onPressOut")
  //   //this.props.onPressCallBack()
  // }

  //---- both onTouchableHanldePress and touchableHandlePress are working ----//
  // _onTouchableHandlePress = () => {
  //   console.log("INFO HomeShelvesPane :: _onTouchableHandlePress")
  //   //this.props.onPressCallBack()
  // }

  // _onTouchableHandleActivePressIn = () => {
  //   console.log("INFO HomeShelvesPane :: _onTouchableHandleActivePressIn")
  //   //this.props.onPressCallBack()
  // }

  // _onTouchableHandleActivePressOut = () => {
  //   console.log("INFO HomeShelvesPane :: _onTouchableHandleActivePressOut")
  //   //this.props.onPressCallBack()
  // }
  //--------------------------------------------------------------------------//

  render() {
    //let pPosition = (this.props.index == 0)? 'relative' : 'absolute'
            //onTouchableHandleActivePressIn={this.props.onPressCallBack()} 
            //onTouchableHandleActivePressOut={console.log('INFO HomeShelvesPane :: test pressOut')} 
    return (
      <TouchableWithoutFeedback 
            //ref={node => this.node = node} 
            onPress={this.onFocus()}
      >
        <View>
            {SHELVES_DATA_ARR.map(this._renderEachHomeShelf)}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

HomeShelvesPane.propTypes = {
  isFocused : PropTypes.bool,
  onFocus : PropTypes.func,
  onBlur : PropTypes.func,
  onFirstShelfSelected : PropTypes.func,
  onFirstShelfBloomed : PropTypes.func,
  onSecondShelfSelected : PropTypes.func,
  onShelvesDown : PropTypes.func,
}

HomeShelvesPane.defaultProps = {
  isFocused : false,
  onFocus: () => {console.log("INFO HomeShelvesPane :: please pass a function for onFocus")},
  onBlur: () => {console.log("INFO HomeShelvesPane :: please pass a function for onBlur")},
  onFirstShelfSelected : () => {console.log("INFO HomeShelvesPane :: please pass a function for onFirstShelfSelected")},
  onFirstShelfBloomed : () => {console.log("INFO HomeShelvesPane :: please pass a function for onFirstShelfBloomed")},
  onSecondShelfSelected : () => {console.log("INFO HomeShelvesPane :: please pass a function for onSecondShelfSelected")},
  onShelesDown : () => {console.log("INFO HomeShelvesPane :: please pass a function for onShelvesDown")},
}