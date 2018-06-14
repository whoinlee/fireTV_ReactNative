import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  Image,
  Text,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  View
} from 'react-native';
import KeyEvent from 'react-native-keyevent';
import HomeShelf from './ui/HomeShelfK';

import config from '../config';
import keyCodes from '../keyCodes';
import styles from '../styles/styles';



const RATIO                 = config.density;
const STD_DURATION          = config.stdDuration;
const SHORT_DURATION        = config.shortDuration;
//
const UNSELECTED_OPACITY    = config.unselectedOpacity;
const SELECTED_OPACITY      = config.selectedOpacity;

//----------------//
//-- test data -- //
//----------------//
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
const TOTAL_SHELVES         = SHELVES_DATA_ARR.length;
const MAX_INDEX             = TOTAL_SHELVES - 1;


const INIT_SHELF_Y          = config.homeShelves.initShelfY/RATIO;

//-- title (headline)
const BASE_TITLE_H          = config.homeShelves.baseTitleH/RATIO;         
const TITLE_TO_TILE_OFFSET  = config.homeShelves.titleToTileOffset/RATIO;

//-- tile (slide) height
const BASE_TILE_H           = config.homeShelves.baseTileH/RATIO;
const FOCUSED_TILE_H        = config.homeShelves.focusedTileH/RATIO; 

//-- shelf related
const BASE_SHELF_OFFSET_Y   = config.homeShelves.baseShelfOffsetY/RATIO;
const BASE_SHELF_H          = config.homeShelves.baseShelfH/RATIO;

const FOCUSED_SHELF_SHIFT_Y = config.homeShelves.focusedShelfShiftY/RATIO;
const BLOOMED_SHELF_SHIFT_Y = config.homeShelves.bloomedShelfShiftY/RATIO;

const FOCUSED_SHELF_OFFSET_Y= config.homeShelves.focusedShelfOffsetY/RATIO;
const FOCUSED_SHELF_H       = config.homeShelves.focusedShelfH/RATIO; 


export default class HomeShelvesPane extends Component {
  constructor(props){
    super(props);
    this.state = {
      //isFocused: false,
      //onFocusShelf: null,   //TODO: need to be here?
      //selectedShelfIndex: -1, //TODO: need to be here?
      //isFirstShelfSelected: false,
      //shelvesTopY: initContainerY + 'px',
    }

    this.containerShiftOffsetY = 0
    this.selectedShelfIndex = -1

    this.isFocused = false
    this.isFirstShelfSelected = false

    this.shelves = []
    this.animsArr = []
    this.prevShelf = null
    this.currShelf = null
    this.nextShelf = null
    this.isPrevMoved = false
    this.isNextMoved = false
    
    this.totalMenu = 3
    this.totalShelves = TOTAL_SHELVES
  }

  componentDidMount() {
    this.totalShelves = this.shelves.length
  }//componentDidMount

  componentWillUnmount() {
    this._removeKeyListener()
  }//componentWillUnmount

  // doDown = () => {
  //   console.log("INFO HomeShelvesPane, doDown :: testing ............................................")
  // }//doDown

  // doUp = () => {
  //   console.log("INFO HomeShelvesPane, doUp :: testing ............................................")
  // }//doUp

  _onBlur = () => {
    console.log("INFO HomeShelvesPane :: _onBlur")

    const { onBlur } = this.props;
    if (onBlur) {
      onBlur()
    }
  }

  doUp = () => {
    console.log("INFO HomeShelvesPane :: doUp")

    if (this.selectedShelfIndex < 0) return

    this.selectedShelfIndex--
    if (this.selectedShelfIndex < 0) {
      this._onBlur()
    } else {
      this._onShelfFocus(this.selectedShelfIndex)
    }
    this.isFirstShelfSelected = (this.selectedShelfIndex === 0) //TODO: CHECK need??
    

    // if (this.selectedShelfIndex < 0) return

    // this.selectedShelfIndex--
    // if (this.selectedShelfIndex === -1) {
    //   //this.isFirstShelfSelected = false
    //   //this.setState({selectedShelfIndex:-1})
    //   this.onBlur()
    //   return
    // } else if (this.selectedShelfIndex === 0) {
    //   this.isFirstShelfSelected = true
    //   this.props.onFirstShelfSelected()
    // } else if (this.selectedShelfIndex === 1) {
    //   this.props.onSecondShelfSelected()
    // }

    // //this.setState({selectedShelfIndex:this.selectedShelfIndex})

    // if (this.selectedShelfIndex >= 1) {
    //   this.props.onShelvesUp()
    // }
    // //-- do something here
    // console.log("INFO HomeShelvesPane :: doUp, from HomeShelvesPane, selectedShelfIndex is ? " + this.selectedShelfIndex)
  }//doUp

  doDown = () => {
    console.log("INFO HomeShelvesPane :: doDown")

    this.selectedShelfIndex++
    if (this.selectedShelfIndex >= this.totalShelves) {
      this.selectedShelfIndex = this.totalShelves - 1
      return
    }

    this.isFirstShelfSelected = (this.selectedShelfIndex === 0) //TODO: CHECK need??
    this._onShelfFocus(this.selectedShelfIndex)

    // //-- do something here
    // console.log("INFO HomeShelvesPane :: _doDown, from HomeShelvesPane, selectedShelfIndex is ? " + this.selectedShelfIndex)
    // //this.setState({selectedShelfIndex:this.selectedShelfIndex})
    // if (this.selectedShelfIndex === 1) {
    //   this.props.onSecondShelfSelected()
    // }

    // if (this.selectedShelfIndex >= 1) {
    //   this.props.onShelvesDown()
    // }

    // //this.setState({selectedShelfIndex : this.state.selectedShelfIndex + 1})
    // //console.log("\nINFO HomeShelvesPane :: onDown, from HomeShelvesPane, this.state.selectedShelfIndex ?? " + this.state.selectedShelfIndex )

    // // switch (this._currFocusLocIndex) {
    // //   case GLOBAL_NAV_INDEX:
    // //     this._currFocusLocIndex += 1
    // //     this._changeOpacity(GLOBAL_NAV_INDEX, .6)
    // //     this._changeOpacity(HOME_HERO_INDEX, 1)
    // //     this._changeOpacity(HOME_SHELVES_INDEX, .6)
    // //     //-- TODO: reset homeShelves y location
    // //     break;
    // //   case HOME_HERO_INDEX:
    // //     this._currFocusLocIndex += 1
    // //     this._changeOpacity(HOME_HERO_INDEX, .6)
    // //     this._changeOpacity(HOME_SHELVES_INDEX, 1)
    // //     break;
    // //   case HOME_SHELVES_INDEX:
    // //     //-- handle inside of homeShelves pane
    // // }//switch

    // //console.log("INFO HomeShelvesPane :: doDown, to ")
    // // console.log("INFO HomeShelvesPane :: _doDown, to " + FOCUS_LOC_ARR[this._currFocusLocIndex])
    // //console.log(" ")
  }//doDown

  doLeft = () => {
    console.log('INFO HomeShelvesPane :: doLeft, from HomeShelvesPane');
  }//doLeft

  doRight = () => {
    console.log('INFO HomeShelvesPane :: doRight, from HomeShelvesPane');
  }//doRight

  doSelect = () => {
    console.log('INFO HomeShelvesPane :: doSelect, from HomeShelvesPane ====>      ');
  }//doSelect

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

  _onShelfFocus = (pIndex) => {
    console.log("INFO HomeShelvesPane :: _onShelfFocus, ===========> selectedShelfIndex is ? " + pIndex)

    // if (this.selectedShelfIndex !== pIndex) {
    //   this.selectedShelfIndex = pIndex

      //-- do something here
    // }
    // if (pIndex == 0) {
    //   this.onFocus()
    // }
  }//_onShelfFocus

  // selectTheFirstShelf = () => {
  //   console.log("INFO HomeShelvesPane, selectTheFirstShelf :: testing ............................................")

  //   if (this.selectedShelfIndex !== 0) {
  //     this.selectedShelfIndex = 0
  //     this._onShelfFocus(0)
  //   }
    
  // }

  // _onShelfBlur = (pIndex) => {
  //   console.log("INFO HomeShelvesPane :: _onShelfBlur")
  // }//_onShelfBlur

  // _onShelfSelect = (pIndex) => {
  //   console.log("INFO HomeShelvesPane :: _onShelfSelect, pIndex is ? " + pIndex)

  //   if (pIndex !== this.state.selectedShelfIndex)
  //   this.setState({selectedShelfIndex : pIndex})
  // }//_onShelfBlur

  // _selectTheFirstShelf = () => {
  //   console.log("INFO HomeShelvesPane :: _selectTheFirstShelf")
  //   this._onShelfFocus(0)
  // }

  onFocus = () => {
   // if (this.props.isFocused) {
      console.log("INFO HomeShelvesPane :: onFocus =====================================> HomeShelvesPane")
      this._selectTheFirstShelf()

      const { onFocus } = this.props
      if (onFocus) {
        //console.log('INFO HomeShelvesPane :: onFocus calling back from HomeHeroPane');
        onFocus()
      }
    //}
  }

  onBlur = () => {
    console.log("INFO HomeShelvesPane :: onBlur =================================> HomeShelvesPane")

    const { onBlur } = this.props;
      if (onBlur) {
        //console.log('INFO HomeShelvesPane :: onBlur calling back from HomeHeroPane');
        onBlur()
      }
  }

  onSelect = () => {
    console.log("INFO HomeShelvesPane :: onSelect =================================> HomeShelvesPane")
    const { onSelect } = this.props;
      if (onSelect) {
        //console.log('INFO HomeShelvesPane :: onSelect calling back from HomeHeroPane');
        onSelect();
      }
  }

  _find_dimesions = (layout) => {
      const {height} = layout;
      // console.warn(x);
      // console.warn(height);
      console.log('INFO HomeShelvesPane :: _find_dimensions, height is ' + height);
  }//_find_dimensions

  _renderEachHomeShelf = (shelfObj, i) => {
    //console.log("INFO HomeShelvesPane :: _eachHomeShelf, i ? " + i)
    // console.log("INFO HomeShelvesPane :: _eachHomeShelf, this.selectedShelfIndex ? " + this.selectedShelfIndex)
    // console.log("INFO HomeShelvesPane :: _eachHomeShelf, (this.selectedShelfIndex === i) ? " + (this.selectedShelfIndex === i))
    return (
      <Animated.View key={(i + 1).toString()}>
          <HomeShelf  
        
                index={i}
                // id={"HomeShelf" + i} 
                title={shelfObj.title}
                shows={shelfObj.shows}
                topY={INIT_SHELF_Y + i*FOCUSED_SHELF_H}
                ref={node => this.shelves.push(node)}
                //callBackOnLargeBloomStart={this._onLargeBloomStart}
                //callBackOnBackToFocused={this._moveBackAdjacentShelves} 
                //isFocused={this.selectedShelfIndex === i}

                // onFocus={this._onShelfFocus.bind(this,i)}
                //onBlur={this._onShelfBlur}
          />
      </Animated.View>
    )
  }//_renderEachHomeShelf



  render() {
    console.log("INFO HomeShelvesPane :: render ------------------------------------------------------------>")
    return (
        <View
          //onFocus={this.onFocus}
            //onLayout={(event) => { this._find_dimesions(event.nativeEvent.layout) }} 
        >
            {SHELVES_DATA_ARR.map(this._renderEachHomeShelf)}
        </View>
    )//return
  }//render
}

HomeShelvesPane.propTypes = {
  
  //onFocus : PropTypes.func,
  onBlur : PropTypes.func,
  //onSelect: PropTypes.func,

  // isFocused : PropTypes.bool,
  // onFirstShelfSelected : PropTypes.func,
  // onFirstShelfBloomed : PropTypes.func,
  // onSecondShelfSelected : PropTypes.func,
  // onShelvesDown : PropTypes.func,
  // onShelvesUp : PropTypes.func,
}

HomeShelvesPane.defaultProps = {
  
  // onFocus: () => {console.log("INFO HomeShelvesPane :: please pass a function for onFocus")},
  onBlur: () => {console.log("INFO HomeShelvesPane :: please pass a function for onBlur")},
  // onSelect: () => {console.log("INFO HomeShelvesPane :: please pass a function for onSelect")},

  // isFocused : false,
  // onFirstShelfSelected : () => {console.log("INFO HomeShelvesPane :: please pass a function for onFirstShelfSelected")},
  // onFirstShelfBloomed : () => {console.log("INFO HomeShelvesPane :: please pass a function for onFirstShelfBloomed")},
  // onSecondShelfSelected : () => {console.log("INFO HomeShelvesPane :: please pass a function for onSecondShelfSelected")},
  // onShelesDown : () => {console.log("INFO HomeShelvesPane :: please pass a function for onShelvesDown")},
  // onShelesUP : () => {console.log("INFO HomeShelvesPane :: please pass a function for onShelvesUp")},
}