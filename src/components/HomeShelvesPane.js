import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native';
import HomeShelf from './ui/HomeShelf';
import KeyEvent from 'react-native-keyevent';

import config from '../config';
import keyCodes from '../keyCodes';
import styles from '../styles/styles';
import homeShelvesStyle from '../styles/homeShelvesStyle';


const STD_DURATION        = config.stdDuration;
const SHORT_DURATION      = config.shortDuration;
//
//-- hardcoded test data
const SHELVES_DATA_ARR    = [
  {
    title:'up next',
    shows:[
        {showTitle: "Top Chef", episodeTitle: "Now That's a lot of Schnitzel", episode: 'S15 E6', 
        episodeDesc: "For the Quickfire, Padma and Richard Blais inspire the chefs using Tasty online videos and challenge them to transform the most laborious dishes from their own menus into accessible thirty minute dishes for home cooks. For the Quickfire, Padma and Richard Blais inspire the chefs using Tasty online videos and challenge them to transform the most laborious dishes from their own menus into accessible thirty minute dishes for home cooks.",
        imageURL: '../assets/images/shows/topChef-s15e06-1056x594.jpg'}
        // , {showTitle: "Top Chef", episodeTitle: "Something Old, Something New", episode: 'S14 E1', 
        // episodeDesc: "Episode Description for S14 E1 goes here",
        // imageURL: '../assets/images/shows/topChef-s14e01-1056x594.jpg'}
        // , {showTitle: "Below Deck", episodeTitle: "Only Doing It for the Money", episode: 'S5 E11', 
        // episodeDesc: "Episode Description for S5 E11 goes here",
        // imageURL: '../assets/images/shows/belowDeck-s05e11-1056x594.jpg'}
        // , {showTitle: "Real Housewives", episodeTitle: "When Chairs Fly", episode: 'S8 E9', 
        // episodeDesc: "Episode Description for S8 E9 goes here",
        // imageURL: '../assets/images/shows/rhofNJ-s08e09-1056x594.jpg'}
        // , {showTitle: "Imposters", episodeTitle: "Always Forward, Never Back", episode: 'S1 E10', 
        // episodeDesc: "Episode Description for S1 E10 goes here",
        // imageURL: '../assets/images/shows/imposters-s01e10-1056x594.jpg'}
        // , {showTitle: "Real Housewives", episodeTitle: "Another Spin Around the Block", episode: 'S9 E4', 
        // episodeDesc: "Episode Description for S9 E4 goes here",
        // imageURL: '../assets/images/shows/rhofAT-s09e04-1056x594.jpg'}
        // , {showTitle: "Top Chef", episodeTitle: "Shrimp Boats and Hat Ladies", episode: 'S14 E10', 
        // episodeDesc: "Episode Description for S14 E10 goes here",
        // imageURL: '../assets/images/shows/topChef-s14e10-1056x594.jpg'}
      ]
  }
  // ,{
  //   title:'recently added (6)',
  //   shows:[
  //       {showTitle: "Top Chef", episodeTitle: "Now That's a lot of Schnitzel", episode: 'S15 E6', 
  //       episodeDesc: "For the Quickfire, Padma and Richard Blais inspire the chefs using Tasty online videos and challenge them to transform the most laborious dishes from their own menus into accessible thirty minute dishes for home cooks.",
  //       imageURL: '../assets/images/shows/topChef-s15e06-1056x594.jpg'},
  //       {showTitle: "Below Deck", episodeTitle: "Only Doing It for the Money", episode: 'S5 E11', 
  //       episodeDesc: "Episode Description for S15 E6 goes here",
  //       imageURL: '../assets/images/shows/belowDeck-s05e11-1056x594.jpg'},
  //       {showTitle: "Real Housewives", episodeTitle: "When Chairs Fly", episode: 'S8 E9', 
  //       episodeDesc: "Episode Description for S15 E6 goes here",
  //       imageURL: '../assets/images/shows/rhofNJ-s08e09-1056x594.jpg'},
  //       {showTitle: "Imposters", episodeTitle: "Always Forward, Never Back", episode: 'S1 E10', 
  //       episodeDesc: "Episode Description for S15 E6 goes here",
  //       imageURL: '../assets/images/shows/imposters-s01e10-1056x594.jpg'},
  //       {showTitle: "Real Housewives", episodeTitle: "Another Spin Around the Block", episode: 'S9 E4', 
  //       episodeDesc: "Episode Description for S9 E4 goes here",
  //       imageURL: '../assets/images/shows/rhofAT-s09e04-1056x594.jpg'},
  //       {showTitle: "Top Chef", episodeTitle: "Shrimp Boats and Hat Ladies", episode: 'S14 E10', 
  //       episodeDesc: "Episode Description for S14 E10 goes here",
  //       imageURL: '../assets/images/shows/topChef-s14e10-1056x594.jpg'}
  //     ]
  // }
  // ,{
  //   title:'category 3 (5)',
  //   shows:[
  //       {showTitle: "Top Chef", episodeTitle: "Episode Title", episode: 'S00 E0', 
  //       episodeDesc: "Episode Description for S00 E0 goes here",
  //       imageURL: '../assets/images/shows/topChef-general-1056x594.jpg'},
  //       {showTitle: "Top Chef", episodeTitle: "The Curse of the Bambino", episode: 'S12 E3', 
  //       episodeDesc: "Episode Description for S12 E3 goes here",
  //       imageURL: '../assets/images/shows/topChef-s12e03-1056x594.jpg'},
  //       {showTitle: "Real Housewives", episodeTitle: "House of Shade and Dust", episode: 'S9 E1', 
  //       episodeDesc: "Episode Description for S9 E1 goes here",
  //       imageURL: '../assets/images/shows/rhofAT-s09e01-1056x594.jpg'},
  //       {showTitle: "Real Housewives", episodeTitle: "Reunion, Part 3", episode: 'S9 E23', 
  //       episodeDesc: "Episode Description for S9 E23 goes here",
  //       imageURL: '../assets/images/shows/rhofAT-s09e23-1056x594.jpg'},
  //       {showTitle: "Top Chef", episodeTitle: "Shrimp Boats and Hat Ladies", episode: 'S14 E10', 
  //       episodeDesc: "Episode Description for S14 E10 goes here",
  //       imageURL: '../assets/images/shows/topChef-s14e10-1056x594.jpg'}
  //     ]
  // }
  // ,{
  //   title:'category 4 (4)',
  //   shows:[
  //       {showTitle: "Top Chef", episodeTitle: "The Curse of the Bambino", episode: 'S12 E3', 
  //       episodeDesc: "Episode Description goes here",
  //       imageURL: '../assets/images/shows/topChef-s12e03-1056x594.jpg'},
  //       {showTitle: "Imposters", episodeTitle: "Always Forward, Never Back", episode: 'S1 E10', 
  //       episodeDesc: "Episode Description goes here",
  //       imageURL: '../assets/images/shows/imposters-s01e10-1056x594.jpg'},
  //       {showTitle: "Real Housewives", episodeTitle: "When Chairs Fly", episode: 'S8 E9', 
  //       episodeDesc: "Episode Description goes here",
  //       imageURL: '../assets/images/shows/rhofNJ-s08e09-1056x594.jpg'},
  //       {showTitle: "Top Chef", episodeTitle: "Shrimp Boats and Hat Ladies", episode: 'S14 E10', 
  //       episodeDesc: "Episode Description goes here",
  //       imageURL: '../assets/images/shows/topChef-s14e10-1056x594.jpg'}
  //     ]
  // }
  // ,{
  //   title:'category 5 (3)',
  //   shows:[
  //       {showTitle: "Below Deck", episodeTitle: "Only Doing It for the Money", episode: 'S5 E11', 
  //       episodeDesc: "Episode Description goes here",
  //       imageURL: '../assets/images/shows/belowDeck-s05e11-1056x594.jpg'},
  //       {showTitle: "Real Housewives", episodeTitle: "When Chairs Fly", episode: 'S8 E9', 
  //       episodeDesc: "Episode Description goes here",
  //       imageURL: '../assets/images/shows/rhofNJ-s08e09-1056x594.jpg'},
  //       {showTitle: "Top Chef", episodeTitle: "Shrimp Boats and Hat Ladies", episode: 'S14 E10', 
  //       episodeDesc: "Episode Description goes here",
  //       imageURL: '../assets/images/shows/topChef-s14e10-1056x594.jpg'}
  //     ]
  // }
  // ,{
  //   title:'category 6 (2)',
  //   shows:[
  //       {showTitle: "Real Housewives", episodeTitle: "When Chairs Fly", episode: 'S8 E9', 
  //       episodeDesc: "Episode Description goes here",
  //       imageURL: '../assets/images/shows/rhofNJ-s08e09-1056x594.jpg'},
  //       {showTitle: "Top Chef", episodeTitle: "Shrimp Boats and Hat Ladies", episode: 'S14 E10', 
  //       episodeDesc: "Episode Description goes here",
  //       imageURL: '../assets/images/shows/topChef-s14e10-1056x594.jpg'}
  //     ]
  // }
  // ,{
  //   title:'category 7(1)',
  //   shows:[
  //      {showTitle: "Top Chef", episodeTitle: "Shrimp Boats and Hat Ladies", episode: 'S14 E10', 
  //      episodeDesc: "Episode Description goes here",
  //      imageURL: '../assets/images/shows/topChef-s14e10-1056x594.jpg'}
  //     ]
  // }
];//SHELVES_DATA_ARR
//
const INIT_SHELF_Y        = 62;         //-- from container top to the shelf title
//
const BASE_TITLE_H        = 28;         //-- title height for Helvetica Light 28px
const BASE_TILE_H         = 180;        //-- tile(ShelfTile) height for Helvetica Light 28px
const TITLE_N_TILE_OFFSET = 10;         //-- offset between title & tiles
const BASE_SHELF_OFFSET   = 106;        //-- offset between shelves: from the bottom of previous shelf image to the top of next shelf title
const BASE_SHELF_H        = BASE_TITLE_H + TITLE_N_TILE_OFFSET + BASE_TILE_H + BASE_SHELF_OFFSET;     //-- distance between unselected shelves
//
//-- from here
// const FOCUSED_SHELF_SHIFT_Y     = 76;   //-- 76 = (332-180)/2 (focusedH - baseH)
// const SHELF_BASE_TILE_H   = 28;


export default class HomeShelvesPane extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedShelfIndex: -1,
      //shelvesTopY: initContainerY + 'px',
    }
    this.shelves = [];

    // //-- distance between unselected shelves
    // const baseShelfOffsetY      = shelfBaseTitleHeight + shelfTitleTileOffset + shelfBaseTileHeight + shelfBaseOffset;
    // //-- distance between the focused(selected) shelf and the next unselected shelf
    // const focusedShelfShiftY    = 76;       //76 = (332-180)/2 (focusedH - baseH)
    // const focusedShelfOffsetY   = baseShelfOffsetY + focusedShelfShiftY;  
    // const bloomedShelfShiftY    = 131;

    // const totalShelves = SHELVES_DATA_ARR.length;
    // const maxIndex = totalShelves - 1;


    //let node;
    //this.getNodeInfo = this.getNodeInfo.bind(this);

    console.log("INFO HomeShelvesPane :: INIT_SHELF_Y ?? " + INIT_SHELF_Y)
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
            console.log('INFO HomeShelvesPane :: componentDidMount, keyCode ? : ' + keyEvent.keyCode);
        }//switch
    });//onKeyDownListener
  }//componentDidMount

  componentWillUnmount() {
    KeyEvent.removeKeyDownListener();
  }//componentWillUnmount

  _doUp = () => {
    console.log("---")
    console.log("INFO HomeShelvesPane :: _doUp, from ")

    // switch (this._currFocusLocIndex) {
    //   case HOME_SHELVES_INDEX:
    //     //-- TODO: do this only if the 1st shelf is selected inside of HomeShelvesPane
    //     this._currFocusLocIndex -= 1
    //     this._changeOpacity(HOME_HERO_INDEX, 1)
    //     this._changeOpacity(HOME_SHELVES_INDEX, .6)
    //     break;
    //   case HOME_HERO_INDEX:
    //     this._currFocusLocIndex -= 1
    //     this._changeOpacity(GLOBAL_NAV_INDEX, 1)
    //     this._changeOpacity(HOME_HERO_INDEX, .6)
    //     break;
    //   case GLOBAL_NAV_INDEX: 
    // }//switch

    console.log("INFO HomeShelvesPane :: _doUp, to ")
    console.log(" ")
  }//_doUp

  _doDown = () => {
    console.log("---")
    console.log("INFO HomeShelvesPane :: _doDown, from ")

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

    console.log("INFO HomeShelvesPane :: _doDown, to ")
    // console.log("INFO HomeShelvesPane :: _doDown, to " + FOCUS_LOC_ARR[this._currFocusLocIndex])
    console.log(" ")
  }//_doDown

  _doLeft = () => {
    console.log('INFO HomeShelvesPane :: _doLeft');
  }

  _doRight = () => {
    console.log('INFO HomeShelvesPane :: _doRight');
  }

  _doSelect = () => {
    console.log('INFO HomeShelvesPane :: _doSelect');
  }

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

  _getNodeInfo(e) {
    //console.log('INFO HomeShelvesPane :: getNodeInfo, ever??? event is ', e)
    //console.log('INFO HomeShelvesPane :: getNodeInfo, node is ', this.node)
  }

  _eachHomeShelf = (shelfObj, i) => {
    return (
      <HomeShelf  key={(i + 1).toString()}
                  index={i}
                  id={"HomeShelf" + i} 
                  title={shelfObj.title}
                  shows={shelfObj.shows}
                  y={initShelfY + i*focusedShelfOffsetY}
                  ref={node => this.shelves.push(node)}
                  callBackOnLargeBloomStart={this.onLargeBloomStart}
                  callBackOnBackToFocused={this.moveBackAdjacentShelves}>
      </HomeShelf>
    )
  }//_eachHomeShelf

  render() {
    return (
      <TouchableNativeFeedback 
            ref={node => this.node = node} 
            // onPress={(e) => this._getNodeInfo(e)} 
            // onTouchableHandleActivePressIn={console.log('INFO HomeShelvesPane :: test pressIn')} 
            // onTouchableHandleActivePressOut={console.log('INFO HomeShelvesPane :: test pressOut')} 
            >
        <View>
            <Text style={styles.comment}>

            </Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

HomeShelvesPane.propTypes = {

}

HomeShelvesPane.defaultProps = {

}