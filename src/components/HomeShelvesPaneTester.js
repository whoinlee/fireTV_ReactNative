import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
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
const TOP                   = config.initHomeShelvesY/RATIO;
//
const SHELVES_DATA_ARR      = [
  {
    title:'up next (7)',
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
//const BASE_TITLE_H          = 28/RATIO;       //-- title height for Helvetica Light 28px
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
      //onFocusShelf: null,     //TODO: need to be here?
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
  }//_setKeyListener

  _removeKeyListener = () => {
    console.log('INFO HomeShelvesPane :: _removeKeyListener')
    KeyEvent.removeKeyDownListener();
  }//_removeKeyListener

  _doUp = () => {
    //console.log("---")
    console.log("\nINFO HomeShelvesPane :: _doUp, from HomeShelvesPane updated for test")

    if (this.selectedShelfIndex < 0) return

    this.selectedShelfIndex--
    if (this.selectedShelfIndex === -1) {
      //this.isFirstShelfSelected = false
      //this.setState({selectedShelfIndex:-1})
      this.onBlur()
      return
    } else if (this.selectedShelfIndex === 0) {
      this.isFirstShelfSelected = true
      this.props.onFirstShelfSelected()
    } else if (this.selectedShelfIndex === 1) {
      this.props.onSecondShelfSelected()
    }

    //this.setState({selectedShelfIndex:this.selectedShelfIndex})

    if (this.selectedShelfIndex >= 1) {
      this.props.onShelvesUp()
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
      //this.setState({selectedShelfIndex:this.selectedShelfIndex})
      return
    }

    //-- do something here
    console.log("INFO HomeShelvesPane :: _doDown, from HomeShelvesPane, selectedShelfIndex is ? " + this.selectedShelfIndex)
    //this.setState({selectedShelfIndex:this.selectedShelfIndex})
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
    console.log('INFO HomeShelvesPane :: _doSelect, from HomeShelvesPane ====>      ');
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

  _onShelfFocus = () => {
    console.log("INFO HomeShelvesPane :: _onShelfFocus")
  }//_onShelfFocus

  _onShelfBlur = () => {
    console.log("INFO HomeShelvesPane :: _onShelfBlur")
  }//_onShelfBlur

  _renderEachHomeShelf = (shelfObj, i) => {
    //console.log("INFO HomeShelvesPane :: _eachHomeShelf, i ? " + i)
    // console.log("INFO HomeShelvesPane :: _eachHomeShelf, this.selectedShelfIndex ? " + this.selectedShelfIndex)
    // console.log("INFO HomeShelvesPane :: _eachHomeShelf, (this.selectedShelfIndex === i) ? " + (this.selectedShelfIndex === i))
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
              callBackOnBackToFocused={this._moveBackAdjacentShelves} 
              isFocused={this.selectedShelfIndex === i}
              //onFocus={this._onShelfFocus}
              //onBlur={this._onShelfBlur}
        >
        </HomeShelf>
    )
  }//_renderEachHomeShelf

  _find_dimesions = (layout) => {
      const {height} = layout;
      // console.warn(x);
      // console.warn(y);
      // console.warn(width);
      // console.warn(height);
      console.log('INFO HomeShelvesPane :: _find_dimensions, height is ' + height);
  }//_find_dimensions


  onFocus = () => {
   // if (this.props.isFocused) {
      console.log('INFO HomeShelvesPane :: onFocus =======================>');

      // if (!this.isFocused) {
      //   this.isFocused = true
      //   this.isFirstShelfSelected = true
      //   this.selectedShelfIndex = 0
      //   //this.setState({selectedShelfIndex:0})
      //   this._setKeyListener()
      // }

      const { onFocus } = this.props;
      if (onFocus) {
        //console.log('INFO HomeShelvesPane :: onFocus calling back from HomeShelvesPane');
        onFocus();
      }
    //}
  }//onFocus

  onBlur = () => {
    console.log("INFO HomeShelvesPane :: onBlur =======================>")

    // if (!this.isFocused) return
    // this.isFocused = false
    // this.isFirstShelfSelected = false
    // this.selectedShelfIndex = -1
    // //this.setState({selectedShelfIndex : -1})
    // this._removeKeyListener()

    const { onBlur } = this.props;
    if (onBlur) {
        //console.log('INFO HomeShelvesPane :: onBlur calling back from HomeShelvesPane');
        onBlur();
    }
  }//onBlur

  onSelect = () => {
    console.log("INFO HomeShelvesPane :: onSelect =======================>")
    const { onSelect } = this.props;
    if (onSelect) {
        //console.log('INFO HomeShelvesPane :: onSelect calling back from HomeShelvesPane');
        onSelect();
    }
  }

  render() {
    return (
      <TouchableNativeFeedback 
        onPress={this.onSelect}
          onPressIn={this.onFocus}
          onPressOut={this.onBlur}
      >
        <View style={ {...this.props.styleObj, top:TOP} }
            //onLayout={(event) => { this._find_dimesions(event.nativeEvent.layout) }} 
        >
            {SHELVES_DATA_ARR.map(this._renderEachHomeShelf)}
        </View>
      </TouchableNativeFeedback>
    );
  }
}

HomeShelvesPane.propTypes = {
  styleObj: PropTypes.object,
  isFocused : PropTypes.bool,
  onFocus : PropTypes.func,
  onBlur : PropTypes.func,
  onSelect : PropTypes.func,
  onFirstShelfSelected : PropTypes.func,
  onFirstShelfBloomed : PropTypes.func,
  onSecondShelfSelected : PropTypes.func,
  onShelvesDown : PropTypes.func,
  onShelvesUp : PropTypes.func,
}

HomeShelvesPane.defaultProps = {
  styleObj: StyleSheet.flatten(styles.homeShelvesContainer),
  isFocused : false,
  onFocus: () => {console.log("INFO HomeShelvesPane :: please pass a function for onFocus")},
  onBlur: () => {console.log("INFO HomeShelvesPane :: please pass a function for onBlur")},
  onSelect: () => {console.log("INFO HomeShelvesPane :: please pass a function for onSelect")},
  onFirstShelfSelected : () => {console.log("INFO HomeShelvesPane :: please pass a function for onFirstShelfSelected")},
  onFirstShelfBloomed : () => {console.log("INFO HomeShelvesPane :: please pass a function for onFirstShelfBloomed")},
  onSecondShelfSelected : () => {console.log("INFO HomeShelvesPane :: please pass a function for onSecondShelfSelected")},
  onShelesDown : () => {console.log("INFO HomeShelvesPane :: please pass a function for onShelvesDown")},
  onShelesUP : () => {console.log("INFO HomeShelvesPane :: please pass a function for onShelvesUp")},
}