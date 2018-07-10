import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
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
const INIT_Y          		= config.homeShelves.initShelfY/RATIO;          //-- distance from the top of homeShelvesPane container to the top of 1st shelf container

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
const BASE_SHELF_OFFSET_X   = config.homeShelves.baseShelfOffsetX/RATIO;    //-- distance between tiles on an unselected shelf
const FOCUSED_SHELF_OFFSET_X= config.homeShelves.focusedShelfOffsetX/RATIO; //-- distance between tiles on a focused shelf
const BLOOMED_SHELF_OFFSET_X= config.homeShelves.bloomedShelfOffsetX/RATIO; //-- distance between tiles on a bloomed shelf

const FOCUSED_SHELF_SHIFT_Y = config.homeShelves.focusedShelfShiftY/RATIO;  //-- the y location shift of unselected shelves on selected shelf being focused: (focusedTileH (332) - baseTileH (180))/2 = 76
const BLOOMED_SHELF_SHIFT_Y = config.homeShelves.bloomedShelfShiftY/RATIO;  //-- the y location shift of unselected shelves on selected shelf being large bloomed: (bloomedTileH (594) - focusedTileH (332))/2 = 131

const SHELF_H 				= BLOOMED_TILE_H;
const TILE_TOP 				= Math.floor((BLOOMED_TILE_H - BASE_TILE_H)/2);
const BASE_TITLE_TOP 		= Math.floor(TILE_TOP - (TITLE_TO_TILE_OFFSET + BASE_TITLE_H));


/* ------------------------------------------ */
/* HomeShelf specific contants                */
/* ------------------------------------------ */
const SHELF_KIND_OBJ		= {
  BASE: 0,
  FOCUSED: 1,
  BLOOMED: 2
};
const TILE_WIDTH_ARR		= [BASE_TILE_W, FOCUSED_BASE_TILE_W, BLOOMED_BASE_TILE_W];						//-- the array of unfocused tile width: 320x180(on a base shelf), 375x210(on a focused shelf), 782x440(on a bloomed shelf)
const TILE_OFFSET_ARR		= [BASE_SHELF_OFFSET_X, FOCUSED_SHELF_OFFSET_X, BLOOMED_SHELF_OFFSET_X];		//-- the array of offset between tiles adjacent, on a base/focused/bloomed shelf
const MAX_TILE_INDEX		= Math.floor((config.stageW - config.initX)/config.homeShelves.baseTileW);		//-- stageWidth/baseTileWidth, max number of base tiles in a row(shelf) - 1 (for 0 based index)
const TITLE_SELECTED_Y 		= -90/RATIO;																	//-- title location for a selected shelf, TODO: CHECK
const TITLE_UNSELECTED_Y	= 0/RATIO;																		//-- title location for unselected shelves, TODO: CHECK
const ASSET_URL				= '../../assets/';


export default class HomeShelf extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isDimmed: false,
			shelfKind: SHELF_KIND_OBJ.BASE,
			titleYPosition: new Animated.Value(BASE_TITLE_TOP),
			tileXPositionArr: []
		}

		this.tiles = []							//-- original tile array by index
		this.totalTiles = props.shows.length

		//-- prevTileIndex: tileIndexQueue[0], currentTileIndex: tileIndexQueue[1], nextTileIndex: tileIndexQueue[2], and so on
		this.tileIndexQueue = [-1]				//-- tile index array ordered by the location
		
		this.selectedTileIndex = -1				
		this.prevTile = null
		this.currTile = null
		this.nextTile = null
	}

	componentDidMount() {
		this._buildTileIndexQueue()
		this._buildTileXPositionArr()
	}

	doLeft = () => {
		if (this.totalTiles < 1) return

		let currTileIndex = this.tileIndexQueue[1]
		this.currTile = this.tiles[currTileIndex]
		if (this.totalTiles == 1 || this.state.shelfKind === SHELF_KIND_OBJ.BLOOMED) {
			console.log("INFO HomeShelf :: doLeft, this.tileIndexQueue before doLeft ? ===> " + this.tileIndexQueue)
			this.currTile.doLeft()
			return
		}
		console.log("INFO HomeShelf :: doLeft, this.tileIndexQueue before doLeft ? ===> " + this.tileIndexQueue)

		const leftOffset = TILE_WIDTH_ARR[SHELF_KIND_OBJ.FOCUSED] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
		const prevX = INIT_X - leftOffset
		// if (this.state.shelfKind === SHELF_KIND_OBJ.BLOOMED) {
		// 	// console.log("INFO HomeShelf :: doRight, this.currTile.props.index ? " + this.currTile.props.index)
		// 	//currTileIndex = this.tileIndexQueue[1]
		// 	// console.log("INFO HomeShelf :: doLeft, currTileIndex ? " + currTileIndex)
		// 	//this.currTile = this.tiles[currTileIndex]
	 //  		this.currTile.doLeft()
	 //  		return
		// }

		let leftMostX
		let prevTileIndex
		let nextTileIndex = this.tileIndexQueue[1]
		this.nextTile = this.tiles[nextTileIndex]

		//-- move the rightMostTile to the leftEnd
		const rightMostTileIndex = this.tileIndexQueue[this.tileIndexQueue.length - 1]
		if (this.tileIndexQueue[0] === -1) {
			//-- no prev tile, so rightMostTile goes to the prevTile location and becomes the currTile
			leftMostX = prevX
			currTileIndex = rightMostTileIndex
			prevTileIndex = -1
			this.currTile = this.tiles[currTileIndex]
			this.prevTile = null
		} else {
			//-- prev tile exists, so rightMostTile goes to the prevPrevTile location and becomes the prevTile
			leftMostX = prevX - leftOffset
			currTileIndex = this.tileIndexQueue[0]
			prevTileIndex = (this.tileIndexQueue.length > 2)? rightMostTileIndex : -1
			this.currTile = this.tiles[currTileIndex]
			this.prevTile = this.tiles[prevTileIndex]
		}

		if (this.tileIndexQueue.length > 2)
		this._changeTileLocation(rightMostTileIndex, leftMostX, 0)

		//-- update currTile : prevTile becomes the currTile
		if (this.currTile) {
			this._changeTileLocation(currTileIndex, INIT_X)
			this.currTile.toFocused()
		}

		//-- update prevTile : prevPrev becomes the prevTile, or no prevTile
		if (this.prevTile) {
			this._changeTileLocation(prevTileIndex, prevX)
			this.prevTile.toExpanded()
		}

		//-- update nextTile : curr becomes the nextTile
		let nextX = INIT_X + FOCUSED_TILE_W + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
		if (this.nextTile) {
			this._changeTileLocation(nextTileIndex, nextX)
			this.nextTile.toExpanded()
		}

		//-- then start animating the rest of tiles to the right
		let lastTileIndex = (this.prevTile === null)? this.totalTiles : this.totalTiles - 1
		let targetX = nextX
	    for (var j = 2; j < lastTileIndex; j++) {
	    	let targetTileIndex = this.tileIndexQueue[j]
	    	let targetTile = this.tiles[targetTileIndex]
	    	targetX += TILE_WIDTH_ARR[SHELF_KIND_OBJ.FOCUSED] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
	    	this._changeTileLocation(targetTileIndex, targetX)
			targetTile.toExpanded()
	    }

	   let leftQueue = [-1]
	   if (this.tileIndexQueue[2] !== undefined) {
		    //-- updateQueue
		    if (this.prevTile !== null) {
		    	const prevIndex = this.tileIndexQueue.pop()
		    	this.tileIndexQueue.unshift(prevIndex)
		    } else {
		    	let rightQueue = this.tileIndexQueue.slice(1)
		    	const prevIndex = rightQueue.pop()
		    	rightQueue.unshift(prevIndex)
		    	this.tileIndexQueue = leftQueue.concat(rightQueue)
		    }
		} else {
			//-- special case with 2 tiles
			this.tileIndexQueue = leftQueue.concat(this.tileIndexQueue)
		}
		console.log("INFO HomeShelf :: doLeft, this.tileIndexQueue after doLeft ?  ===> " + this.tileIndexQueue)
	}//doLeft

	doRight = () => {
		if (this.totalTiles < 1) return

		let currTileIndex = this.tileIndexQueue[1]
		this.currTile = this.tiles[currTileIndex]
		if (this.totalTiles == 1 || this.state.shelfKind === SHELF_KIND_OBJ.BLOOMED) {
			console.log("INFO HomeShelf :: doRight, this.tileIndexQueue before doLeft ? ===> " + this.tileIndexQueue)
			this.currTile.doRight()
			return
		}

		console.log("INFO HomeShelf :: doRight, this.tileIndexQueue before doRight ?  ===> " + this.tileIndexQueue)

		// if (this.state.shelfKind === SHELF_KIND_OBJ.BLOOMED) {
		// 	// console.log("INFO HomeShelf :: doRight, this.currTile.props.index ? " + this.currTile.props.index)
		// 	// const currTileIndex = this.tileIndexQueue[1]
		// 	// console.log("INFO HomeShelf :: doRight, currTileIndex ? " + currTileIndex)
		// 	// this.currTile = this.tiles[currTileIndex]
	 //  		this.currTile.doRight()
	 //  		return
		// }

		//***** from HERE
		const leftOffset = TILE_WIDTH_ARR[SHELF_KIND_OBJ.FOCUSED] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
		const prevX = INIT_X - leftOffset

		let nextX = INIT_X + FOCUSED_TILE_W + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
		let leftMostX
		let prevTileIndex = this.tileIndexQueue[1]	//-- currTileIndex becomes the prevTileIndex
		currTileIndex = this.tileIndexQueue[2]	//-- nextTileIndex becomes the currTileIndex
		let nextTileIndex

		//-- prevTile, if there is, becomes prevPrevTile
		const prevPrevTileIndex = this.tileIndexQueue[0]
		const prevPrevX = prevX - leftOffset
		const prevPrevTile = this.tiles[prevPrevTileIndex]
		if (prevPrevTileIndex !== -1) {
			this._changeTileLocation(prevPrevTileIndex, prevPrevX)
			prevPrevTile.toExpanded()
		}

		//-- update prevTile : currTile becomes the prevTile
		this.prevTile = this.tiles[prevTileIndex]
		this._changeTileLocation(prevTileIndex, prevX)
		this.prevTile.toExpanded()	//TODO: CHECK, didn't work on 2nd try

		//-- update currTile : nextTile becomes the currTile
		if (currTileIndex !== undefined) {
			this.currTile = this.tiles[currTileIndex]
			this._changeTileLocation(currTileIndex, INIT_X)
			this.currTile.toFocused()

			//-- then start animating the rest of tiles to the left
			let lastTileIndex = (this.tileIndexQueue[0] === -1)? this.totalTiles : this.totalTiles - 1
			let targetX = nextX
		    for (var j = 3; j <= lastTileIndex; j++) {
		    	let targetTileIndex = this.tileIndexQueue[j]
		    	let targetTile = this.tiles[targetTileIndex]
		    	if (j === 3) this.nextTile = targetTile
		    	this._changeTileLocation(targetTileIndex, targetX)
		    	targetTile.toExpanded()
		    	targetX += TILE_WIDTH_ARR[SHELF_KIND_OBJ.FOCUSED] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
		    }
		   
		    if (prevPrevTile) {
		    	//-- give delay, then show as the last element
		    	if (this.changeTileLocationID) clearTimeout(this.changeTileLocationID)
		    	this.changeTileLocationID = setTimeout(() => this._changeTileLocation(prevPrevTileIndex, targetX, 0), (SHORT_DURATION - 100))
		    }
		} else {
			if (prevPrevTile !== undefined) {
				this._changeTileLocation(prevPrevTileIndex, nextX, 0)
				this._changeTileLocation(prevPrevTileIndex, INIT_X)
		    	prevPrevTile.toFocused()
		    }
		}

	    //-- updateQueue
	    let prevIndex = this.tileIndexQueue.shift()
	    if (prevIndex !== -1) this.tileIndexQueue.push(prevIndex)
	    console.log("INFO HomeShelf :: doRight, this.tileIndexQueue after doRight ?  ===> " + this.tileIndexQueue)
	}//doRight

	doSelect = () => {
		console.log("\nINFO HomeShelf :: doSelect, shelf", this.props.index)
	}//doSelect

	onFocus = () => {
		// console.log("INFO HomeShelf :: onFocus, =================> focusedShelfIndex is ? " + this.props.index)
		this.setState({isDimmed: false, shelfKind: SHELF_KIND_OBJ.FOCUSED})

		//-- update title
		const titleShiftOffset = Math.fround((FOCUSED_TILE_H - BASE_TILE_H)/2 + 16/RATIO)	//tileHeight increase + titleHeight increase (fontSize increase)
		const titleUpY = BASE_TITLE_TOP - titleShiftOffset
		this._changeTitleLocation(titleUpY)

		//-- update prev, curr, and next tiles
		const prevTileIndex = this.tileIndexQueue[0]
		const currTileIndex = this.tileIndexQueue[1]
		if (prevTileIndex >= 0) {
			this.prevTile = this.tiles[prevTileIndex]
			this.prevTile.toExpanded()
			const prevX = INIT_X - TILE_WIDTH_ARR[SHELF_KIND_OBJ.FOCUSED] - TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
			this._changeTileLocation(prevTileIndex, prevX)
		}
		if (currTileIndex >= 0) {
			this.currTile = this.tiles[currTileIndex]
			//this.currTile.onFocus()
			this.currTile.toFocused()
		}
		//
		let nextX = INIT_X + FOCUSED_TILE_W + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
		let nextTileIndex = this.tileIndexQueue[2]
		if (nextTileIndex >= 0) {
			this.nextTile = this.tiles[nextTileIndex]
			this.nextTile.toExpanded()
			this._changeTileLocation(nextTileIndex, nextX)
		}

		const lastTileIndex = this.tileIndexQueue.length - 1
		for (var j = 3; j <= lastTileIndex; j++) {
	    	nextTileIndex = this.tileIndexQueue[j]
	    	let targetTile = this.tiles[nextTileIndex]
	    	nextX += TILE_WIDTH_ARR[SHELF_KIND_OBJ.FOCUSED] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
	    	targetTile.toExpanded()
	    	this._changeTileLocation(nextTileIndex, nextX)
	    }
	}//onFocus

	onBlur = (pIsDimmed = true) => {
		// console.log("INFO HomeShelf :: onBlur, shelf index is ? " + this.props.index + ", isDimmed ? " + pIsDimmed)
		this.setState({isDimmed: pIsDimmed, shelfKind: SHELF_KIND_OBJ.BASE})

		//-- update title
		this._changeTitleLocation(BASE_TITLE_TOP)

		//-- update prev, curr, and next tiles
		//-- prev
		const prevTileIndex = this.tileIndexQueue[0]
		if (prevTileIndex >= 0 && this.prevTile) {
			this.prevTile.backToOrg()
			const prevX = INIT_X - TILE_WIDTH_ARR[SHELF_KIND_OBJ.BASE]
			this._changeTileLocation(prevTileIndex, prevX)
		}
		//-- curr
		if (this.currTile) this.currTile.backToOrg()
		//-- next
		let nextX = INIT_X + BASE_TILE_W
		let nextTileIndex = this.tileIndexQueue[2]
		if (nextTileIndex >= 0 && this.nextTile) {
			this.nextTile.backToOrg()
			this._changeTileLocation(nextTileIndex, nextX)
		}
		//-- the rest of tiles
		const lastTileIndex = this.tileIndexQueue.length - 1
		for (var j = 3; j <= lastTileIndex; j++) {
	    	nextTileIndex = this.tileIndexQueue[j]
	    	let targetTile = this.tiles[nextTileIndex]
	    	nextX += TILE_WIDTH_ARR[SHELF_KIND_OBJ.BASE]
	    	targetTile.backToOrg()
	    	this._changeTileLocation(nextTileIndex, nextX)
	    }
	}//onBlur

	_reset = () => {
		// console.log("INFO HomeShelf :: _reset", this.props.index)
		this._backToOrg()
		this._buildTileQueue()

		this.setState({isDimmed: false, titleYPosition: new Animated.Value(BASE_TITLE_TOP)})
		this.selectedTileIndex = -1
		this.prevTile = null
		this.currTile = null
		this.nextTile = null
	}//_reset

	_buildTileIndexQueue = () => {
		// console.log("INFO HomeShelf :: _buildTileIndexQueue, this.totalTiles ?? " + this.totalTiles)
		const lastIndex = this.totalTiles - 1

		//-- for the 1st element, -1: no prevTileIndex
		this.tileIndexQueue[0] = -1	
		//-- from the 2nd to the (lastIndex - 1) element
		for (var i=0; i<lastIndex; i++) {
			this.tileIndexQueue.push(i)
		}
		//-- for the last element
		if (lastIndex > MAX_TILE_INDEX) {
			//-- circular, the last index becomes the prevIndex
			this.tileIndexQueue[0] = lastIndex      
		} else {
			//-- last index goes to the last element
			this.tileIndexQueue.push(lastIndex)
		}
	}//_buildTileIndexQueue

	_buildTileXPositionArr = () => {
		// console.log("INFO HomeShelf :: _buildTileXPositionArr, this.totalTiles ?? " + this.totalTiles)
		let leftX
		let tileXPositionArr = []
		for (var i=0; i<this.totalTiles; i++) {
			leftX = ( (i <= MAX_TILE_INDEX) || (i < (this.totalTiles - 1)) )? INIT_X + TILE_WIDTH_ARR[SHELF_KIND_OBJ.BASE]*i : INIT_X - TILE_WIDTH_ARR[SHELF_KIND_OBJ.BASE];
			tileXPositionArr.push(new Animated.Value(leftX))
		}
		this.setState({tileXPositionArr : tileXPositionArr})
	}//_buildTileXPositionArr

	_changeTitleLocation = (targetValue, pDuration=SHORT_DURATION) => {
	    // console.log("INFO HomeShelf :: _changeTitleLocation, to " + targetValue)
	    Animated.timing(this.state.titleYPosition).stop()
	    Animated.timing(
	      this.state.titleYPosition, 
	      {
	        toValue: targetValue,
	        duration: pDuration,
	        easing: Easing.out(Easing.quad),
	      }
	    ).start()
	}//_changeTitleLocation

	_changeTileLocation = (targetIndex, targetValue, pDuration=SHORT_DURATION, pDelay=0) => {
		if (targetIndex === undefined) return
		if (this.state.shelfKind !== SHELF_KIND_OBJ.BASE)
	    console.log("INFO HomeShelf :: _changeTileLocation " + targetIndex + " location to " + targetValue) 

		Animated.timing(this.state.tileXPositionArr[targetIndex]).stop()
	    Animated.timing(
	      this.state.tileXPositionArr[targetIndex], 
	      {
	        toValue: targetValue,
	        delay:pDelay,
	        duration: pDuration,
	        easing: Easing.out(Easing.quad),
	      }
	    ).start()
	}//_changeTitleLocation

	_onBloomToLargeStart = () => {
		console.log("INFO HomeShelf :: _onBloomToLargeStart, shelfIndex ? " + this.props.index + ", calling onBloomToLargeStart")

		this.setState({shelfKind: SHELF_KIND_OBJ.BLOOMED})

		const { onBloomToLargeStart } = this.props;
      	if (onBloomToLargeStart) onBloomToLargeStart()

		let prevX
		let nextX
		if (this.tileIndexQueue[0] !== -1) {
			prevX = INIT_X - ((TILE_WIDTH_ARR[SHELF_KIND_OBJ.BLOOMED] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.BLOOMED]))
			const prevIndex = this.tileIndexQueue[0]
			this.prevTile = this.tiles[prevIndex]
			// console.log("INFO HomeShelf :: _onBloomToLargeStart, prevIndex ? " + prevIndex + ", prevX ? " + prevX)
			this._changeTileLocation(prevIndex, prevX)
			this.prevTile.toMedBloomed()
		} else {
			this.prevTile = null
		}

		if (this.tileIndexQueue[2] !== undefined) {
			nextX = INIT_X + (BLOOMED_TILE_W + TILE_OFFSET_ARR[SHELF_KIND_OBJ.BLOOMED])
			const nextIndex = this.tileIndexQueue[2]
			this.nextTile = this.tiles[nextIndex]
			// console.log("INFO HomeShelf :: _onBloomToLargeStart, nextIndex ? " + nextIndex + ", nextX ? " + nextX)
			this._changeTileLocation(nextIndex, nextX)
			this.nextTile.toMedBloomed()
		} else {
			this.nextTile = null
		}

		//-- the rest of tiles in the current shelf
		const lastTileIndex = (this.tileIndexQueue[0] === -1)? this.totalTiles : this.totalTiles - 1
		for (var j = 3; j <= lastTileIndex; j++) {
	    	let nextTileIndex = this.tileIndexQueue[j]
	    	let targetTile = this.tiles[nextTileIndex]
	    	nextX += TILE_WIDTH_ARR[SHELF_KIND_OBJ.BLOOMED] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.BLOOMED]
	    	if (targetTile !== null) {
		    	this._changeTileLocation(nextTileIndex, nextX)
		    	targetTile.toMedBloomed()
	    	}
	    }
	}//_onBloomToLargeStart

	_onNoTileMenuLeft = (pDir="right") => {
		if (this.totalTiles <= 1) return
		console.log("INFO HomeShelf :: _onNoTileMenuLeft, pDir ??  " + pDir)

		this.setState({isDimmed: false, shelfKind: SHELF_KIND_OBJ.FOCUSED})
		const { onBackToFocused } = this.props
      	if (onBackToFocused) onBackToFocused()
		if (pDir === "right") {
			this.doRight()
		} else {
			this.doLeft()
		}
	}//_onNoTileMenuLeft

	_find_dimesions = (layout) => {
	    const {width, height} = layout;
	    console.log('INFO HomeShelf :: _find_dimensions (testing), height is ' + height)
	    //console.log('INFO HomeShelf :: _find_dimensions (testing), width is ' + width)
	}//_find_dimesions

	_renderEachShelfTile = (tileObj, i) => {
		// console.log("INFO HomeShelf :: _renderEachShelfTile")
		const pPosition = (i === 0)? 'relative' : 'absolute'
		const leftX = this.state.tileXPositionArr[i]
		return (
			<Animated.View 	key={(i + 1).toString()}
					style={ { 
							position: pPosition,
							left: leftX,
						} } >
				<ShelfTile 	
						ref={node => this.tiles.push(node)}
				  		index={i}
				  		showTitle={tileObj.showTitle}
				  		episodeTitle={tileObj.episodeTitle}
				  		episodeID={tileObj.episode}
				  		episodeDesc={" " + tileObj.episodeDesc}
				  		imageURL={tileObj.imageURL}
				  		callBackOnBloomToLargeStart={this._onBloomToLargeStart}
				  		callBackOnNoMenuLeft={this._onNoTileMenuLeft} />
		    </Animated.View>
		)
	}//_renderEachShelfTile

	render() {
		// console.log("INFO HomeShelf :: render --------------------------------------------------------------->")
		const { shelfKind, titleYPosition } = this.state
		const titleStyle = (shelfKind === SHELF_KIND_OBJ.BASE) ? homeShelfStyles.shelfTitleBase : homeShelfStyles.shelfTitleFocused
		return (
			<View 
				style={{ 
					opacity: this.state.isDimmed ? UNSELECTED_OPACITY:SELECTED_OPACITY,	//TODO: CHECK, from here? or from HomeShelvesPane
					width: '100%',
					height: BLOOMED_TILE_H,
    		}} >
				<Animated.View 
					//onLayout={(event) => { this._find_dimesions(event.nativeEvent.layout) }}
					style={ {...StyleSheet.flatten(homeShelfStyles.homeShelfTitleContainer),
								top: titleYPosition,
						 	} }>
					<Text style={ titleStyle }>
						{this.props.title}
					</Text>
				</Animated.View>

				<View style={ homeShelfStyles.homeShelfTilesContainer }>
					{this.props.shows.map(this._renderEachShelfTile)}
				</View>
			</View>
		)
	}//render
};


const homeShelfStyles = StyleSheet.create({
	//-- "title" ----------------------//
	homeShelfTitleContainer: {
		position: 'absolute',
		left: INIT_X,
		top: BASE_TITLE_TOP,
	},

	shelfTitleBase: {
		fontSize: 28/RATIO,
	    fontFamily: 'Helvetica-Light',
	    fontWeight: '100',	/*HelveticaLight*/
	    textAlign: 'left',
	    color: '#fff',
	},

	shelfTitleFocused: {
		fontSize: 40/RATIO,
	    fontFamily: 'Helvetica-Light',
	    fontWeight: '100',	/*HelveticaLight*/
	    textAlign: 'left',
	    color: '#fff',
	},
	//---------------------------------//


	//-- "tile" ----------------------//
	homeShelfTilesContainer: {
		position: 'absolute',
		top: TILE_TOP,
    	flex: 1,
	},
	//---------------------------------//
});

HomeShelf.propTypes = {
	index: PropTypes.number,
	title: PropTypes.string,
	shows: PropTypes.array,
	onBloomToLargeStart: PropTypes.func,
	onBackToFocused: PropTypes.func,
};

ShelfTile.defaultProps = {
	onBloomToLargeStart: () => {console.log("INFO HomeShelf :: please pass a function for onBloomToLargeStart")},
	onBackToFocused: () => {console.log("INFO HomeShelf :: please pass a function for onBackToFocused")},
};
