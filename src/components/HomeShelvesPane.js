import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  Image,
  Text,
  View
} from 'react-native';
import KeyEvent from 'react-native-keyevent';
import HomeShelf from './ui/HomeShelf';

import config from '../config';
import keyCodes from '../keyCodes';
import styles from '../styles/styles';



/* --------- from config -------------------------------------------//
//-- density, animation duration, and opacity
//----------------------------------------------------------------- */
const RATIO                 = config.density;
const STD_DURATION          = config.stdDuration;
const SHORT_DURATION        = config.shortDuration;
const UNSELECTED_OPACITY    = config.unselectedOpacity;
const SELECTED_OPACITY      = config.selectedOpacity;


/* ---------- from config ------------------------------------------//
//-- homeShelvesPane location & dimension related
//----------------------------------------------------------------- */
const INIT_SHELF_Y          = config.homeShelves.initShelfY/RATIO;          //-- distance from the top of homeShelvesPane container to the top of 1st shelf container

//-- title (headline)
const BASE_TITLE_H          = config.homeShelves.baseTitleH/RATIO;          //-- unselected shelf title height (!!!not same as the font size, 28)  
const TITLE_TO_TILE_OFFSET  = config.homeShelves.titleToTileOffset/RATIO;   //-- distance from the bottom of shelf title to the top of shelf tile

//-- tile (slide) height
const BASE_TILE_H           = config.homeShelves.baseTileH/RATIO;           //-- base tile height, on an unselected shelf
const FOCUSED_TILE_H        = config.homeShelves.focusedTileH/RATIO;        //-- focused tile height, on a selected shelf
const BLOOMED_TILE_H        = config.homeShelves.bloomedTileH/RATIO;        //-- bloomed tile height, on a selected shelf

//-- shelf related
const FOCUSED_SHELF_SHIFT_Y = config.homeShelves.focusedShelfShiftY/RATIO;  //-- the y location shift of unselected shelves on selected shelf being focused: (focusedTileH (332) - baseTileH (180))/2 = 76
const BLOOMED_SHELF_SHIFT_Y = config.homeShelves.bloomedShelfShiftY/RATIO;  //-- the y location shift of unselected shelves on selected shelf being large bloomed: (bloomedTileH (594) - focusedTileH (332))/2 = 131

const SHELF_H               = BLOOMED_TILE_H;
const NEXT_SHELF_OFFSET     = Math.round(-(BLOOMED_TILE_H-BASE_TILE_H)/2);  //-- (BLOOMED_TILE_H - BASE_TILE_H)/2 : distance (offset) between prev and next shelf tiles


/* ------------------------------------------ */
/* HomeShelvesPane test data                  */
/* ------------------------------------------ */
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
          ,{ showTitle: "The Real Housewives of New Jersey", episodeTitle: "When Chairs Fly", episode: 'S8 E9', 
            episodeDesc: "Episode Description for S8 E9 goes here",
            imageURL: require('../assets/images/shows/rhofNJ-s08e09-1056x594.jpg') }
          ,{ showTitle: "Imposters", episodeTitle: "Always Forward, Never Back", episode: 'S1 E10', 
            episodeDesc: "Episode Description for S1 E10 goes here",
            imageURL: require('../assets/images/shows/imposters-s01e10-1056x594.jpg') }
          ,{ showTitle: "The Real Housewives of Atlanta", episodeTitle: "Another Spin Around the Block", episode: 'S9 E4', 
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
        ,{ showTitle: "The Real Housewives of New Jersey", episodeTitle: "When Chairs Fly", episode: 'S8 E9', 
          episodeDesc: "Episode Description for S15 E6 goes here",
          imageURL: require('../assets/images/shows/rhofNJ-s08e09-1056x594.jpg') }
        ,{ showTitle: "Imposters", episodeTitle: "Always Forward, Never Back", episode: 'S1 E10', 
          episodeDesc: "Episode Description for S15 E6 goes here",
          imageURL: require('../assets/images/shows/imposters-s01e10-1056x594.jpg') }
        ,{ showTitle: "The Real Housewives of Atlanta", episodeTitle: "Another Spin Around the Block", episode: 'S9 E4', 
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
        {showTitle: "The Real Housewives of New Jersey", episodeTitle: "House of Shade and Dust", episode: 'S9 E1', 
        episodeDesc: "Episode Description for S9 E1 goes here",
        imageURL: require('../assets/images/shows/rhofAT-s09e01-1056x594.jpg') },
        {showTitle: "The Real Housewives of New Jersey", episodeTitle: "Reunion, Part 3", episode: 'S9 E23', 
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
        {showTitle: "The Real Housewives of New Jersey", episodeTitle: "When Chairs Fly", episode: 'S8 E9', 
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
        {showTitle: "The Real Housewives of New Jersey", episodeTitle: "When Chairs Fly", episode: 'S8 E9', 
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
        {showTitle: "The Real Housewives of New Jersey", episodeTitle: "When Chairs Fly", episode: 'S8 E9', 
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
];//-- hardcoded test data
const TOTAL_SHELVES         = SHELVES_DATA_ARR.length;
const MAX_SHELF_INDEX       = TOTAL_SHELVES - 1;


export default class HomeShelvesPane extends Component {
  constructor(props){
    super(props);
    this.state = {
      shelfYPositionArr: []
    }

    this.shelves = []
    this.totalShelves = TOTAL_SHELVES

    this.selectedShelfIndex = -1
    this.prevShelf = null
    this.currShelf = null
    this.nextShelf = null

    this.shelfYPositionOrgArr = []
    // this.isPrevShifted = false
    // this.isNextShifted = false
  }

  componentDidMount() {
    this._buildShelfYPositionArr()
  }//componentDidMount

  _buildShelfYPositionArr = () => {
    // console.log("INFO HomeShelvesPane :: _buildShelfYPositionArr, this.totalShelves ?? " + this.totalShelves)
    let topY
    let shelfYPositionArr = []
    for (var i=0; i<this.totalShelves; i++) {
      topY = i*NEXT_SHELF_OFFSET
      shelfYPositionArr.push(new Animated.Value(topY))
      this.shelfYPositionOrgArr.push(topY)
    }
    this.setState({shelfYPositionArr : shelfYPositionArr})
  }//_buildTileXPositionArr

  doUp = () => {
    if (this.selectedShelfIndex < 0) return

    this.selectedShelfIndex--
    if (this.selectedShelfIndex < 0) {
      this.onBlur()
    } else {
      this._onShelfFocus(this.selectedShelfIndex)
    }
  }//doUp

  doDown = () => {
    if (this.selectedShelfIndex >= MAX_SHELF_INDEX) return

    this.selectedShelfIndex++
    this._onShelfFocus(this.selectedShelfIndex)
  }//doDown

  doLeft = () => {
    this.shelves[this.selectedShelfIndex].doLeft()
  }//doLeft

  doRight = () => {
    this.shelves[this.selectedShelfIndex].doRight()
  }//doRight

  doSelect = () => {
    this.shelves[this.selectedShelfIndex].doSelect()
  }//doSelect

/*
  //-- TODO: CHECK, need?
  onFocus = () => {
    // console.log("INFO HomeShelvesPane :: onFocus")
    //-- on homeShelves pane focus, i.e. the 1st shelf of the pane gets focused
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus()
    }
  }//onFocus
  */

  //-- TODO: CHECK, need?
  onBlur = () => {
    // console.log("INFO HomeShelvesPane :: onBlur")
    //-- on homeShelves pane blur, i.e. the 1st shelf gets unfocused and focus moves up (to the heroPane)
    const isDimmed = false
    if (this.currShelf) this.currShelf.onBlur(isDimmed)

    const { onBlur } = this.props;
    if (onBlur) {
      onBlur()
    }
  }//onBlur

  _onShelfFocus = (pIndex) => {
    if (pIndex < 0) return

    //console.log("INFO HomeShelvesPane :: _onShelfFocus, ===========> selectedShelfIndex is ? " + pIndex)
    this.selectedShelfIndex = pIndex    //-- to confirm (duplicate, as it's already done in doUp/doDown)
    this.currShelf = this.shelves[pIndex]
    this.prevShelf = (pIndex > 0)? this.shelves[pIndex - 1] : null
    this.nextShelf = (pIndex >= MAX_SHELF_INDEX)? null : this.shelves[pIndex + 1]

    this._changeShelfLocation(this.selectedShelfIndex, this.shelfYPositionOrgArr[this.selectedShelfIndex])
    this.currShelf.onFocus()
    
    if (this.prevShelf) {
      //this._changeShelfLocation(this.selectedShelfIndex-1, this.shelfYPositionOrgArr[this.selectedShelfIndex-1])
      this.prevShelf.onBlur()
    }
    //
    if (this.nextShelf) {
      //this._changeShelfLocation(this.selectedShelfIndex+1, this.shelfYPositionOrgArr[this.selectedShelfIndex+1])
      this.nextShelf.onBlur()
    }
    this._moveBackAdjacentShelves()

    //-- when the 1st/2nd shelf is selected/bloomed, homeHeroPane changes its location
    if (pIndex <= 1) this.props.updateHomeHeroLocation(pIndex,false)  

    this.props.updateHomeShelvesLocation(pIndex)
  }//_onShelfFocus

  _onBloomToLargeStart = () => {
    console.log("INFO HomeShelvesPane :: _onBloomToLargeStart, this.selectedShelfIndex ? " + this.selectedShelfIndex)

    if (this.selectedShelfIndex == 0) {
      //-- when the 1st shelf is bloomed
      const isBloomed = true
      this.props.updateHomeHeroLocation(this.selectedShelfIndex, isBloomed)
    } 

    //-- handle prevShelf
    if (this.prevShelf) {
      // console.log("INFO HomeShelvesPane :: _onBloomToLargeStart, this.prevShelf.props.index ? " + this.prevShelf.props.index)
      const prevShelfIndex = this.selectedShelfIndex-1
      const prevY = prevShelfIndex*NEXT_SHELF_OFFSET - BLOOMED_SHELF_SHIFT_Y
      this._changeShelfLocation(prevShelfIndex, prevY)
    }
    
    //-- handle nextShelf
    if (this.nextShelf) {
      // console.log("INFO HomeShelvesPane :: _onBloomToLargeStart, this.nextShelf.props.index ? " + this.nextShelf.props.index)
      const nextShelfIndex = this.selectedShelfIndex+1
      const nextY = nextShelfIndex*NEXT_SHELF_OFFSET + BLOOMED_SHELF_SHIFT_Y
      this._changeShelfLocation(nextShelfIndex, nextY)
    }
  }//_onLargeBloomStart

  _changeShelfLocation = (targetIndex, targetValue, pDuration=SHORT_DURATION, pDelay=0) => {
    if (targetIndex === undefined) return
      // console.log("INFO HomeShelvesPane :: _changeShelfLocation " + targetIndex + " yLocation, to " + targetValue)
    Animated.timing(this.state.shelfYPositionArr[targetIndex]).stop()
      Animated.timing(
        this.state.shelfYPositionArr[targetIndex], 
        {
          toValue: targetValue,
          delay:pDelay,
          duration: pDuration,
          easing: Easing.out(Easing.quad),
        }
      ).start()
  }//_changeShelfLocation

  _moveBackAdjacentShelves = () => {
    console.log("INFO HomeShelvesPane :: _moveBackAdjacentShelves")

    
    if (this.selectedShelfIndex == 0) {
      //-- when the 1st shelf is backTo Focused from Bloomed
      const isBloomed = false
      this.props.updateHomeHeroLocation(this.selectedShelfIndex, isBloomed)
    } 

    if (this.prevShelf) {
      this._changeShelfLocation(this.selectedShelfIndex-1, this.shelfYPositionOrgArr[this.selectedShelfIndex-1])
    }
    //
    if (this.nextShelf) {
      this._changeShelfLocation(this.selectedShelfIndex+1, this.shelfYPositionOrgArr[this.selectedShelfIndex+1])
    }
  }//_moveBackAdjacentShelves

  _find_dimesions = (layout) => {
    //-- used for testing
    const {height} = layout;
    console.log('INFO HomeShelvesPane :: _find_dimensions, height is ' + height);
  }//_find_dimensions

  _renderEachHomeShelf = (shelfObj, i) => {
    //console.log("INFO HomeShelvesPane :: _renderEachHomeShelf, i ? " + i)
    const topY = this.state.shelfYPositionArr[i]  //-- Jul05
    return (
      <Animated.View  key={(i + 1).toString()}
          style={ { 
              top: topY,
              // borderColor: '#f00', borderWidth: 1
            } } >
        <HomeShelf
              ref={node => this.shelves.push(node)}
              // key={(i + 1).toString()}         //-- Jul05
              index={i}
              title={shelfObj.title}
              shows={shelfObj.shows}
              // topY={i*NEXT_SHELF_OFFSET}       //-- Jul05
              onBloomToLargeStart={this._onBloomToLargeStart}
              onBackToFocused={this._moveBackAdjacentShelves}
        />
      </Animated.View>
    )
  }//_renderEachHomeShelf

  render() {
    // console.log("INFO HomeShelvesPane :: render ------------------------------------------------------------>")
    return (
      <View>
          {SHELVES_DATA_ARR.map(this._renderEachHomeShelf)}
      </View>
    )//return
  }//render
}


HomeShelvesPane.propTypes = {
  onBlur : PropTypes.func,
  updateHomeHeroLocation : PropTypes.func.isRequired,
  updateHomeShelvesLocation : PropTypes.func.isRequired,
}