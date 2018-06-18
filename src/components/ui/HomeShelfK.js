import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import KeyEvent from 'react-native-keyevent';
import ShelfTile from './ShelfTile';

import config from '../../config';
import keyCodes from '../../keyCodes';



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
const INIT_X				= config.initX/RATIO;							//-- UI element left alignment location
const INIT_SHELF_Y          = config.homeShelves.initShelfY/RATIO;          //-- distance from the top of homeShelvesPane container to the top of 1st shelf container

//-- title (headline)
const BASE_TITLE_H          = config.homeShelves.baseTitleH/RATIO;          //-- unselected shelf title height (!!!not same as the font size, 28)  
const TITLE_TO_TILE_OFFSET  = config.homeShelves.titleToTileOffset/RATIO;   //-- distance from the bottom of shelf title to the top of shelf tile

//-- tile (slide) dimension
const BASE_TILE_W           = config.homeShelves.baseTileW/RATIO;           //-- base tile width, on an unselected shelf, 320x180
const BASE_TILE_H           = config.homeShelves.baseTileH/RATIO;           //-- base tile height, on an unselected shelf
const FOCUSED_TILE_W        = config.homeShelves.focusedTileW/RATIO;        //-- focused tile width, on a selected shelf, 590x332
const FOCUSED_TILE_H        = config.homeShelves.focusedTileH/RATIO;        //-- focused tile height, on a selected shelf
const BLOOMED_TILE_W        = config.homeShelves.bloomedTileW/RATIO;        //-- large bloomed tile width, on a selected shelf, 1056x594
const BLOOMED_TILE_H        = config.homeShelves.bloomedTileH/RATIO;        //-- large bloomed tile height, on a selected shelf
const FOCUSED_BASE_TILE_W   = config.homeShelves.focusedBaseTileW/RATIO;    //-- focused tile width, on a selected shelf, 590x332
const FOCUSED_BASE_TILE_H   = config.homeShelves.focusedBaseTileH/RATIO;    //-- focused tile height, on a selected shelf
const BLOOMED_BASE_TILE_W   = config.homeShelves.bloomedBaseTileW/RATIO;    //-- focused tile width, on a selected shelf, 590x332
const BLOOMED_BASE_TILE_H   = config.homeShelves.bloomedBaseTileH/RATIO;    //-- focused tile height, on a selected shelf

//-- shelf related
const BASE_SHELF_H          = config.homeShelves.baseShelfH/RATIO;          //-- baseTitleH (40) + titleToTileOffset (10) + baseTileH (180) + baseShelfOffsetY (106) = 336
const FOCUSED_SHELF_H       = config.homeShelves.focusedShelfH/RATIO;       //-- focusedTitleH (60) + titleToTileOffset (10) + focusedTileH (332) + focusedShelfOffsetY (182) = 584
//
const BASE_SHELF_OFFSET_X   = config.homeShelves.baseShelfOffsetX/RATIO;    //-- distance between tiles on an unselected shelf
const FOCUSED_SHELF_OFFSET_X= config.homeShelves.focusedShelfOffsetX/RATIO; //-- distance between tiles on a focused shelf
const BLOOMED_SHELF_OFFSET_X= config.homeShelves.bloomedShelfOffsetX/RATIO; //-- distance between tiles on a bloomed shelf
//	
const BASE_SHELF_OFFSET_Y   = config.homeShelves.baseShelfOffsetY/RATIO;    //-- TODO: not used
const FOCUSED_SHELF_OFFSET_Y= config.homeShelves.focusedShelfOffsetY/RATIO; //-- baseShelfOffsetY (106) + focusedShelfShiftY (76) = 182
//
const FOCUSED_SHELF_SHIFT_Y = config.homeShelves.focusedShelfShiftY/RATIO;  //-- the y location shift of unselected shelves on selected shelf being focused: (focusedTileH (332) - baseTileH (180))/2 = 76
const BLOOMED_SHELF_SHIFT_Y = config.homeShelves.bloomedShelfShiftY/RATIO;  //-- the y location shift of unselected shelves on selected shelf being large bloomed: (bloomedTileH (594) - focusedTileH (332))/2 = 131


/* ------------------------------------------ */
/* HomeShelf specific contants                */
/* ------------------------------------------ */
const SHELF_KIND			= {
  BASE: 0,
  FOCUSED: 1,
  BLOOMED: 2
};
const TILE_WIDTH_ARR		= [BASE_TILE_W, FOCUSED_BASE_TILE_W, BLOOMED_BASE_TILE_W];						//-- the array of unfocused tile width: 320x180(on a base shelf), 375x210(on a focused shelf), 782x440(on a bloomed shelf)
const TILE_OFFSET_ARR		= [BASE_SHELF_OFFSET_X, FOCUSED_SHELF_OFFSET_X, BLOOMED_SHELF_OFFSET_X];		//-- the array of offset between tiles adjacent, on a base/focused/bloomed shelf
const MAX_TILE_INDEX		= Math.floor(config.stageW/config.homeShelves.baseTileW);						//-- stageWidth/baseTileWidth, max number of base tiles in a row(shelf)
const TITLE_SELECTED_Y 		= -90/RATIO;																	//-- title location for a selected shelf, TODO: CHECK
const TITLE_UNSELECTED_Y	= 0/RATIO;																		//-- title location for unselected shelves, TODO: CHECK
const ASSET_URL				= '../../assets/';


export default class HomeShelf extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isDimmed: false,
			isFocused: false,					//-- CHECK: need???
			isBloomed: false,					//-- CHECK: need???
			shelfKind: SHELF_KIND.BASE      	//-- CHECK: need???
		}

		this.tiles = []							//original tiles
		this.selectedTileIndex = -1

		this.isFocused = false

		//-- prevTileIndex: tileIndexQueue[0], currentTileIndex: tileIndexQueue[1], nextTileIndex: tileIndexQueue[2], and so on
		// this.tileIndexQueue = [-1]			//tile index array based on current location, from prev, current, to next etc (staring from entering no index for the prev tile)
		
		// this.prevTile = null
		// this.currTile = null
		// this.nextTile = null
		this.totalTiles = props.shows.length	//-- TODO: totalTiles=0 case?????

		// this.reset = this.reset.bind(this)
		// this.select = this.select.bind(this)
		// this.unselect = this.unselect.bind(this)
		// this.doLeft = this.doLeft.bind(this)
		// this.doRight = this.doRight.bind(this)

		// this.buildTileIndexQueue = this.buildTileIndexQueue.bind(this)
		// this.moveTo = this.moveTo.bind(this)

		// this.opacityChange = this.opacityChange.bind(this)
		// this.onLargeBloomStart = this.onLargeBloomStart.bind(this)
		// this.backToFocused = this.backToFocused.bind(this)
		// this.eachShelfTile = this.eachShelfTile.bind(this)
		// this.clearBloomTimer = this.clearBloomTimer.bind(this)

		// this.buildTileIndexQueue()
	}

	componentWillMount() {}//componentWillMount

	doLeft = () => {
		console.log("INFO HomeShelf :: doLeft/moveToRight, shelf", this.props.index)
		//console.log("INFO HomeShelf :: doLeft/moveToRight, this.state.shelfKind ? ", this.state.shelfKind)
		// this.clearBloomTimer()

		// if (this.state.shelfKind === SHELF_KIND.BLOOMED) {
		// 	console.log("INFO HomeShelf :: doLeft, menu change!! ") 
		// 	// console.log("INFO HomeShelf :: doLeft, this.currTile.props.index? " + this.currTile.props.index) 
		// 	console.log("INFO HomeShelf :: doLeft, this.currTile.props.episodeTitle? " + this.currTile.props.episodeTitle) 
		// 	this.currTile.doLeft()
		// 	//
		// 	return
		// }

		// if (this.totalTiles > 1) {
		// 	console.log("\n")
		// 	//console.log("INFO HomeShelf :: doLeft//moveToRight, this.totalTiles ?? ", this.totalTiles)
		// 	console.log("INFO HomeShelf :: doLeft/moveToRight, this.tileIndexQueue  before ? ", this.tileIndexQueue)

		// 	//-- move the rightMostTile to the leftEnd
		// 	const leftOffset = TILE_WIDTH_ARR[SHELF_KIND.FOCUSED] + TILE_OFFSET_ARR[SHELF_KIND.FOCUSED]
		// 	const prevX = INIT_X - leftOffset
		// 	let rightMostTile
		// 	let prevPrevTile
		// 	console.log("this.tileIndexQueue[2] ?? " + this.tileIndexQueue[2])
		// 	if (this.tileIndexQueue[2] !== undefined) {
		// 		//-- exclude the case of 2 tiles at previous and current(focused) location
		// 		const rightMostTileIndex = this.tileIndexQueue[this.tileIndexQueue.length - 1]
		// 		rightMostTile = this.tiles[rightMostTileIndex]
		// 		let leftMostX = prevX
		// 		if (this.tileIndexQueue[0] === -1) {
		// 			//-- rightMostTile goes to a prevPrev location, instead of prev location
		// 			//leftMostX = prevX - leftOffset
		// 			//this.tileIndexQueue[0] = this.tileIndexQueue.pop()	//CHECK!!!
		// 			this.prevTile = rightMostTile
		// 		} else {
		// 			console.log("this.prevTile ?? " + this.prevTile)
		// 			leftMostX = prevX - leftOffset
		// 			prevPrevTile = rightMostTile
		// 		}
		// 		rightMostTile.changeXLocTo(leftMostX)
		// 	}

		// 	//-- update currTile (prev to curr)
		// 	this.currTile = (this.tileIndexQueue[0] === -1)? rightMostTile : this.tiles[this.tileIndexQueue[0]]
		// 	console.log("this.currTile ?? " +this.currTile)
		// 	if (this.currTile !== undefined)
		// 	this.currTile.toFocused(INIT_X)

		// 	//-- prevPrevTile
		// 	//-- update prevTile (prevPrev to prev, or no prev)
		// 	console.log("prevPrevTile ?? " + prevPrevTile)
		// 	if (prevPrevTile !== undefined) {
		// 		//prevPrevTile.toExpanded(prevX, noScale)
		// 		prevPrevTile.toExpanded(prevX)
		// 		this.prevTile = prevPrevTile
		// 	} else {
		// 		this.prevTile = null
		// 	}

		// 	//-- update nextTile (curr to next)
		// 	//this.nextTile = this.currTile
		// 	this.nextTile = this.tiles[this.tileIndexQueue[1]]
		// 	let nextX = INIT_X + focusedTileWidth + TILE_OFFSET_ARR[SHELF_KIND.FOCUSED]
		// 	this.nextTile.toExpanded(nextX)

		// 	//-- then start animating all tiles to the right
		// 	let lastTileIndex = (this.prevTile === null)? this.totalTiles : this.totalTiles - 1
		// 	//if (lastTileIndex > MAX_TILE_INDEX) lastTileIndex = MAX_TILE_INDEX	//-- don't need to animate the tiles beyond stage width
		// 	//if (lastTileIndex !== undefined) {
		// 	    for (var j = 2; j < lastTileIndex; j++) {
		// 	    	console.log("INFO HomeShelf :: doLeft/moveToRight, j ", j)
		// 	    	let nextTileIndex = this.tileIndexQueue[j]
		// 	    	//console.log("INFO HomeShelf :: select, nextTileIndex is ??? ", nextTileIndex)
		// 	    	let targetTile = this.tiles[nextTileIndex]
		// 	    	nextX += TILE_WIDTH_ARR[SHELF_KIND.FOCUSED] + TILE_OFFSET_ARR[SHELF_KIND.FOCUSED]
		// 	    	targetTile.toExpanded(nextX)
		// 	    }
		//    // }

		//    let leftQueue = [-1]
		//    if (this.tileIndexQueue[2] !== undefined) {
		// 	    //-- updateQueue
		// 	    if (this.prevTile !== null) {
		// 	    	const prevIndex = this.tileIndexQueue.pop()
		// 	    	this.tileIndexQueue.unshift(prevIndex)
		// 	    } else {
		// 	    	//let leftQueue = [-1]	//for null prevTile index
		// 	    	let rightQueue = this.tileIndexQueue.slice(1)
		// 	    	const prevIndex = rightQueue.pop()
		// 	    	rightQueue.unshift(prevIndex)
		// 	    	this.tileIndexQueue = leftQueue.concat(rightQueue)
		// 	    }
		// 	} else {
		// 		//-- special case with 2 tiles
		// 		this.tileIndexQueue = leftQueue.concat(this.tileIndexQueue)
		// 	}
		//     console.log("INFO HomeShelf :: doLeft/moveToRight, this.tileIndexQueue  after ? ", this.tileIndexQueue)
		// }
	}//doLeft

	doRight = () => {
		console.log("\nINFO HomeShelf :: doRight, shelf", this.props.index)
		//console.log("INFO HomeShelf :: doRight, this.state.shelfKind ? ", this.state.shelfKind)

		// this.clearBloomTimer()

		// if (this.state.shelfKind === SHELF_KIND.BLOOMED) {
		// 	console.log("INFO HomeShelf :: doRight, menu change!! ")
		// 	// console.log("INFO HomeShelf :: doRight, this.currTile.props.index? " + this.currTile.props.index) 
		// 	console.log("INFO HomeShelf :: doRight, this.currTile.props.episodeTitle? " + this.currTile.props.episodeTitle) 
		// 	this.currTile.doRight()
		// 	//
		// 	return
		// }

		// if (this.totalTiles > 1) {
		// 	//console.log("INFO HomeShelf :: doRight, this.tileIndexQueue  before ? ", this.tileIndexQueue)
		// 	//-- move the rightMostTile to the leftEnd
		// 	const leftOffset = TILE_WIDTH_ARR[SHELF_KIND.FOCUSED] + TILE_OFFSET_ARR[SHELF_KIND.FOCUSED]
		// 	const prevX = INIT_X - leftOffset

		// 	// -- update prevTile, currTile, and nextTile
		// 	let prevPrevTile
		// 	if (this.tileIndexQueue[0] !== -1) {
		// 		prevPrevTile = this.tiles[this.tileIndexQueue[0]]
		// 		const prevPrevX = prevX - leftOffset
		// 		//prevPrevTile.toExpanded(prevPrevX, noScale)
		// 		prevPrevTile.toExpanded(prevPrevX)
		// 	}

		// 	this.prevTile = this.tiles[this.tileIndexQueue[1]]
		// 	this.prevTile.toExpanded(prevX)	//didn't work on 2nd try

		// 	if (this.tileIndexQueue[2] !== undefined) {
		// 		console.log("this.tileIndexQueue[2]???? " + this.tileIndexQueue[2])
		// 		this.currTile = this.tiles[this.tileIndexQueue[2]]
		// 		this.currTile.toFocused(INIT_X)
		// 		let nextX = INIT_X + focusedTileWidth + TILE_OFFSET_ARR[SHELF_KIND.FOCUSED]
		// 		//-- then start animating all tiles to the right
		// 		let lastTileIndex = (this.tileIndexQueue[0] === -1)? this.totalTiles : this.totalTiles - 1
		// 		//if (lastTileIndex > MAX_TILE_INDEX) lastTileIndex = MAX_TILE_INDEX	//-- don't need to animate the tiles beyond stage width
		// 		//if (lastTileIndex) {
		// 		    for (var j = 3; j <= lastTileIndex; j++) {
		// 		    	//console.log("INFO HomeShelf :: doRight, j ", j)
		// 		    	let nextTileIndex = this.tileIndexQueue[j]
		// 		    	//console.log("INFO HomeShelf :: select, nextTileIndex is ??? ", nextTileIndex)
		// 		    	let targetTile = this.tiles[nextTileIndex]
		// 		    	if (j === 3) this.nextTile = targetTile
		// 		    	targetTile.toExpanded(nextX)
		// 		    	//targetTile.toExpanded(nextX, noScale)
		// 		    	nextX += TILE_WIDTH_ARR[SHELF_KIND.FOCUSED] + TILE_OFFSET_ARR[SHELF_KIND.FOCUSED]
		// 		    }
		// 	   // }
			   
		// 	    // console.log("prevPrevTile???? " + prevPrevTile)
		// 	    if (prevPrevTile !== undefined) {
		// 	    	//-- give delay, then show as the last element
		// 	    	prevPrevTile.fadeInAt(nextX, .3, .2)	//stdDuration after
		// 	    }
		// 	} else {
		// 		if (prevPrevTile !== undefined) {
		// 	    	prevPrevTile.changeXLocTo(INIT_X + INIT_X + focusedTileWidth + TILE_OFFSET_ARR[SHELF_KIND.FOCUSED])
		// 	    	prevPrevTile.toFocused(INIT_X)
		// 	    }
		// 	}

		//     //-- updateQueue
		//     let prevTileIndex = this.tileIndexQueue.shift()
		//     if (prevTileIndex !== -1) this.tileIndexQueue.push(prevTileIndex)
		//     //console.log("INFO HomeShelf :: doRight, this.tileIndexQueue  after ? ", this.tileIndexQueue)
		// }
	}//doRight

	doSelect = () => {
		console.log("\nINFO HomeShelf :: doSelect, shelf", this.props.index)
	}//doSelect

	onFocus = () => {
		console.log("INFO HomeShelf :: onFocus, =================> focusedShelfIndex is ? " + this.props.index)

		this.setState({isDimmed: false, isFocused:true, shelfKind: SHELF_KIND.FOCUSED})	//TO CHECK:: topContainerTop
		this._clearBloomTimer()

		// //-- shelf "title" animation: location & font size change
		// TL.to(this.titleNode, stdDuration, {top: titleSelectedY + 'px', scale: 1.5})	//-90

		// //const totalTiles = this.totalTiles
	 //    //-- prev tile
	 //    const prevTileIndex = this.tileIndexQueue[0]
	 //    //console.log("INFO HomeShelf :: select, prevTileIndex is ", prevTileIndex)

	 //    if (prevTileIndex !== -1) {
	 //    	this.prevTile = this.tiles[prevTileIndex]
	 //    	const prevX = INIT_X - TILE_WIDTH_ARR[SHELF_KIND.FOCUSED] - TILE_OFFSET_ARR[SHELF_KIND.FOCUSED]
	 //    	this.prevTile.toExpanded(prevX)
	 //    }

	 //    //-- current tile
	 //    const currTileIndex = this.tileIndexQueue[1]
	 //    this.currTile = this.tiles[currTileIndex]
	 //    this.currTile.toFocused()
	 //    //console.log("INFO HomeShelf :: select, currTileIndex is ", currTileIndex)

	 //    //-- next tile and the rest of tiles
	 //    let nextTileIndex
	 //    let nextX 
	 //    //console.log("INFO HomeShelf :: select, this.tileIndexQueue.length is ", this.tileIndexQueue.length)
	 //    //console.log("INFO HomeShelf :: select, this.tileIndexQueue is ", this.tileIndexQueue)

	 //    if (this.tileIndexQueue.length > 2) {
		//     nextTileIndex = this.tileIndexQueue[2]
		//     //console.log("INFO HomeShelf :: select, nextTileIndex is ??? ", nextTileIndex)
		//     this.nextTile  = this.tiles[nextTileIndex]
		//     nextX = INIT_X + focusedTileWidth + TILE_OFFSET_ARR[SHELF_KIND.FOCUSED]
		//     this.nextTile.toExpanded(nextX)

		//     const lastTileIndex = (prevTileIndex === -1)? this.totalTiles : this.totalTiles - 1
		//     for (var j = 3; j <= lastTileIndex; j++) {
		//     	nextTileIndex = this.tileIndexQueue[j]
		//     	//console.log("INFO HomeShelf :: select, nextTileIndex is ??? ", nextTileIndex)
		//     	let targetTile = this.tiles[nextTileIndex]
		//     	nextX += TILE_WIDTH_ARR[SHELF_KIND.FOCUSED] + TILE_OFFSET_ARR[SHELF_KIND.FOCUSED]
		//     	targetTile.toExpanded(nextX)
		//     }
		// }
		//console.log("INFO HomeShelf :: select, nextTileIndex is ", nextTileIndex)
	}//onFocus

	onBlur = () => {
		console.log("INFO HomeShelf :: onBlur, shelf index is ? " +  this.props.index + ", isFocused ? " + this.state.isFocused)

		if (this.state.isFocused) this._backTo()
		this.setState({isDimmed: true})
		//this._opacityChange(UNSELECTED_OPACITY)
		// this.clearBloomTimer()

		// // this.setState({shelfKind: SHELF_KIND.BASE, isFocused:false})	//TO CHEC
		// this.setState({shelfKind: SHELF_KIND.BASE})	//TO CHECK:: topContainerTop
		// this.opacityChange(.6)

		// //-- shelf title animation: location & font size change
		// TL.to(this.titleNode, stdDuration, {top: TITLE_UNSELECTED_Y + 'px', scale: 1})	//-90

		// //-- prev tile
		// const prevTileIndex = this.tileIndexQueue[0]
	 //    if (prevTileIndex !== -1) {
	 //    	this.prevTile = this.tiles[prevTileIndex]
	 //    	const prevX = INIT_X - TILE_WIDTH_ARR[SHELF_KIND.BASE] - TILE_OFFSET_ARR[SHELF_KIND.BASE]
	 //    	this.prevTile.backToOrg(prevX)
	 //    }

		// //-- current tile
	 //    const currTileIndex = this.tileIndexQueue[1]
	 //    this.currTile = this.tiles[currTileIndex]
	 //    this.currTile.backToOrg(INIT_X)

	 //    //-- next tile and the rest of tiles
	 //    let nextTileIndex
	 //    let nextX 
	 //    if (this.tileIndexQueue.length > 2) {
		//     nextTileIndex = this.tileIndexQueue[2]
		//     this.nextTile  = this.tiles[nextTileIndex]
		//     nextX = INIT_X + TILE_WIDTH_ARR[SHELF_KIND.BASE] + TILE_OFFSET_ARR[SHELF_KIND.BASE]
		//     this.nextTile.backToOrg(nextX)

		//     //-- the rest (CHECK the last one, when inited)
		//     const lastTileIndex = (prevTileIndex === -1)? this.totalTiles : this.totalTiles - 1
		//     for (var j = 3; j <= lastTileIndex; j++) {
		//     	nextTileIndex = this.tileIndexQueue[j]
		//     	let targetTile = this.tiles[nextTileIndex]
		//     	nextX += TILE_WIDTH_ARR[SHELF_KIND.BASE] + TILE_OFFSET_ARR[SHELF_KIND.BASE]
		//     	targetTile.backToOrg(nextX)
		//     }
		// }
	}//onBlur

	_backTo = () => {
		console.log("INFO HomeShelf :: _backTo, shelf index is ? " +  this.props.index + ", isBloomed ? " + this.state.isBloomed)
		//this.setState({isFocused: false, isBloomed: false, shelfKind: SHELF_KIND.BASE})
	}

	_opacityChange = (val) => {
		// this.topContainerStyle = {
		// 	top: this.state.topContainerTop + 'px',
		// 	opacity: val
		// }
		// TL.to(this.homeShelfContainer, 0, {opacity: val})
	}//_opacityChange

	_moveTo = (targetY = 0, pDuration = STD_DURATION) => {
		console.log("INFO HomeShelf :: _moveTo")
		// TL.to(this.homeShelfContainer, pDuration, {top: targetY+'px', ease:Power3.easeOut})
		// this.setState({topY: targetY, isMoved: true})
	}//_moveTo

	// backTo = (targetY = this.props.topY, pDuration = stdDuration) => {
	// 	console.log("INFO HomeShelf :: backTo")
	// 	this.moveTo(targetY, pDuration)
	// 	//TL.to(this.homeShelfContainer, pDuration, {top: targetY+'px', ease:Power3.easeOut})
	// }//backTo

	_onLargeBloomStart = () => {
		console.log("INFO HomeShelf :: onLargeBloomStart")
		// this.setState({isDimmed: false, isFocused: false, isBloomed: false, shelfKind: SHELF_KIND.BLOOMED})
		// this.setState({shelfKind: SHELF_KIND.BLOOMED})

		// this.props.callBackOnLargeBloomStart()

		// let prevX
		// let nextX
		// if (this.prevTile !== null) {
		// 	prevX = INIT_X - (TILE_WIDTH_ARR[SHELF_KIND.BLOOMED] + TILE_OFFSET_ARR[SHELF_KIND.BLOOMED])
		// 	this.prevTile.toMedBloomed(prevX)
		// }
		// if (this.nextTile !== null) {
		// 	nextX = INIT_X + (BLOOMED_TILE_W + TILE_OFFSET_ARR[SHELF_KIND.BLOOMED])
		// 	this.nextTile.toMedBloomed(nextX)
		// }

		// //-- the rest of tiles in the current shelf
		// //console.log("INFO HomeShelf :: onLargeBloomStart, this.tileIndexQueue ?? " + this.tileIndexQueue)
		// const lastTileIndex = (this.tileIndexQueue[0] === -1)? this.totalTiles : this.totalTiles - 1
		// for (var j = 3; j <= lastTileIndex; j++) {
	 //    	let nextTileIndex = this.tileIndexQueue[j]
	 //    	let targetTile = this.tiles[nextTileIndex]
	 //    	nextX += TILE_WIDTH_ARR[SHELF_KIND.BLOOMED] + TILE_OFFSET_ARR[SHELF_KIND.BLOOMED]
	 //    	targetTile.toMedBloomed(nextX, false, 0)
	 //    }
	}//__onLargeBloomStart

	_clearBloomTimer = () => {
		console.log("INFO HomeShelf :: clearBloomTimer")
		// if (this.currTile !== null) this.currTile.killToLargeBloom()
	}//_clearBloomTimer

	_backToFocused = (pDir = "left") => {
		console.log("INFO HomeShelf :: _backToFocused, callBackOnNoMenuLeft")
		// this.setState({shelfKind: SHELF_KIND.FOCUSED})
		// if (pDir === "left") {
		// 	this.doLeft()
		// } else {
		// 	this.doRight()
		// }
		//this.props.callBackOnBackToFocused()
	}//_backToFocused

	_buildTileIndexQueue = () => {
		console.log("INFO HomeShelf :: _buildTileIndexQueue, this.props.shows.length ? ", this.props.shows.length)
		// for (var i=0; i<this.totalTiles; i++) {
		// 	const leftX = ( (i < MAX_TILE_INDEX) || (i < (this.totalTiles - 1)) )? INIT_X + TILE_WIDTH_ARR[SHELF_KIND.BASE]*i : INIT_X - TILE_WIDTH_ARR[SHELF_KIND.BASE];
		// 	if (leftX < INIT_X) {
		// 		//-- if prev tile exists
		// 		if (this.tileIndexQueue[0] === -1) {
		// 			this.tileIndexQueue[0] = i	//-- replace '-1' with 'i'
		// 		}
		// 	} else {
		// 		if (this.tileIndexQueue[i+1] === undefined) {
		// 			this.tileIndexQueue[i+1] = i
		// 		}
		// 	}
		// }
		// console.log("INFO HomeShelf :: buildTileIndexQueue, this.tileIndexQueue ? ", this.tileIndexQueue)
	}//_buildTileIndexQueue

	_reset = () => {
		// console.log("INFO HomeShelf :: reset", this.props.index)
		// this.clearBloomTimer()
	}//_reset

	_renderEachShelfTile = (tileObj, i) => {
		// console.log("INFO HomeShelf :: _renderEachShelfTile")
		const leftX = ( (i < MAX_TILE_INDEX) || (i < (this.totalTiles - 1)) )? INIT_X + TILE_WIDTH_ARR[SHELF_KIND.BASE]*i : INIT_X - TILE_WIDTH_ARR[SHELF_KIND.BASE];
		// const leftX = ( (i < MAX_TILE_INDEX) || (i < (this.totalTiles - 1)) )? INIT_X : INIT_X - TILE_WIDTH_ARR[SHELF_KIND.BASE];
		// const leftX = (i==0)? INIT_X : 0;
		//const leftX = INIT_X;
		// console.log("INFO HomeShelf :: _renderEachShelfTile, i: " + i + ", leftX ? " + leftX)
		return (
			// <View 	key={(i + 1).toString()}
			// 		style={ { left: leftX, width: (320/RATIO+2), borderColor: '#000000', borderWidth: 1} } >
				<ShelfTile 	
						key={(i + 1).toString()}
						ref={node => this.tiles.push(node)}
				  		index={i}
				  		homeShelfIndex={this.props.index}
				  		leftX={leftX}
				  		showTitle={tileObj.showTitle}
				  		episodeTitle={tileObj.episodeTitle}
				  		episodeID={tileObj.episode}
				  		episodeDesc={" " + tileObj.episodeDesc}
				  		imageURL={tileObj.imageURL}
				  		// callBackOnLargeBloomStart={this._onLargeBloomStart}
				  		// callBackOnNoMenuLeft={this._backToFocused}
				  		// isFocused={false}
				  		>
		    	</ShelfTile>
		    // </View>
		)
	}//_renderEachShelfTile

	_find_dimesions = (layout) => {
	    const {height} = layout;
	    // console.warn(height);
	    console.log('INFO HomeShelf :: _find_dimensions, height is ' + height);
	 }//_find_dimesions

	render() {
		console.log("INFO HomeShelf :: render --------------------------------------------------------------->")
		let pPosition = (this.props.index === 0)? 'relative' : 'absolute'
		// console.log("INFO HomeShelf :: render, this.props.topY ? " + this.props.topY)

		//-- for testing
		const colorArr = ['darkcyan', 'darkred', 'darkorchid']
		let colorIndex = Math.floor(Math.random() * 3)
		let pColor = colorArr[colorIndex]
		//let pOpacity = this.props.isFocused ? 1:.6
		let pOpacity = this.state.isDimmed ? UNSELECTED_OPACITY:SELECTED_OPACITY
		//--------------
		return (
			<View 
				style={{ 
					position: pPosition,
					top: this.props.topY,
					width: '100%',
					height: '100%',
					opacity: pOpacity,
					// borderWidth: 1,
    				// borderColor: 'red',
    				// backgroundColor: pColor,
    				// backgroundColor: 'darkgreen'
    		}} >
				<View 
					style={ homeShelfStyles.homeShelfTitleContainer } 
					// onLayout={(event) => { this._find_dimesions(event.nativeEvent.layout) }} 
				>
					<Text style={ homeShelfStyles.shelfTitle }>
						{this.props.title}
					</Text>
				</View>

				<View style={ homeShelfStyles.homeShelfTilesContainer }>
					{this.props.shows.map(this._renderEachShelfTile)}
				</View>
			</View>
		)
	}//render
}


const homeShelfStyles = StyleSheet.create({
	//-- "title" ----------------------//
	homeShelfTitleContainer: {
	    borderWidth: .5,
    	borderColor: 'darkgreen',
	},
		shelfTitle: {
			left: INIT_X,
			fontSize: 28/RATIO,
		    fontFamily: 'Helvetica-Light',
		    fontWeight: '100',	/*HelveticaLight*/
		    textAlign: 'left',
		    color: '#fff',
		},
	//---------------------------------//


	//-- "tile" ----------------------//
	homeShelfTilesContainer: {
		top: TITLE_TO_TILE_OFFSET,
    	flex: 1,
    	borderWidth: .5,
    	borderColor: 'darkgreen',
	},
	//---------------------------------//
});

HomeShelf.propTypes = {
	index: PropTypes.number,
	topY: PropTypes.number,
	title: PropTypes.string,
	shows: PropTypes.array,
};

HomeShelf.defaultProps = {

};