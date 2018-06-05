import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native';
import KeyEvent from 'react-native-keyevent';
import ShelfTile from './ShelfTile';

import config from '../../config';
import keyCodes from '../../keyCodes';
// import homeShelvesStyle from '../../styles/homeShelvesStyle';


const RATIO                 = config.density;
const STD_DURATION			= config.stdDuration;
const SHORT_DURATION		= config.shortDuration;
//
const SHELF_KIND_OBJ		= {
  BASE: 0,
  FOCUSED: 1,
  BLOOMED: 2
};
//
const INIT_X				= 200/RATIO;
const TITLE_N_TILE_OFFSET   = 10/RATIO;         			//-- offset between title & tiles
//
const TILE_WIDTH_ARR		= [320/RATIO, 375/RATIO, 782/RATIO];		//-- the array of unfocused tile width: 320x180(on a base shelf), 375x210(on a focused shelf), 782x440(on a bloomed shelf)
const TILE_OFFSET_ARR		= [0/RATIO, 24/RATIO, 58/RATIO];			//-- the array of offset between tiles adjacent, on a base/focused/bloomed shelf
const FOCUSED_TILE_W		= 590/RATIO;					//-- focused tile: 590x332
const BLOOMED_TILE_W		= 1056/RATIO;					//-- largeBloomed tile: 1056x594
//
const MAX_TILE_INDEX		= Math.floor(1920/320);			//-- stageWidth/baseTileWidth, max number of base tiles in a row
const TITLE_SELECTED_Y 		= -90/RATIO;					//-- title location for a selected shelf
const TITLE_UNSELECTED_Y	= 0/RATIO;						//-- title location for unselected shelves
//
const ASSET_URL				= '../../assets/';

export default class HomeShelf extends Component {
	constructor(props) {
		super(props)
		this.state = {
			shelfKind: SHELF_KIND_OBJ.BASE      //-- CHECK: need???
		}

		this.tiles = []							//original tiles

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

	_buildTileIndexQueue = () => {
		console.log("INFO HomeShelf :: _buildTileIndexQueue, this.props.shows.length ? ", this.props.shows.length)
		// for (var i=0; i<this.totalTiles; i++) {
		// 	const leftX = ( (i < MAX_TILE_INDEX) || (i < (this.totalTiles - 1)) )? INIT_X + TILE_WIDTH_ARR[SHELF_KIND_OBJ.BASE]*i : INIT_X - TILE_WIDTH_ARR[SHELF_KIND_OBJ.BASE];
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

	select = () => {
		console.log("INFO HomeShelf :: _select, shelf", this.props.index)
		// this.clearBloomTimer()

		// // this.setState({shelfKind: SHELF_KIND_OBJ.FOCUSED, isSelected:true})	//TO CHECK:: topContainerTop
		// this.setState({shelfKind: SHELF_KIND_OBJ.FOCUSED})	//TO CHECK:: topContainerTop
		// this.opacityChange(1)

		// //-- shelf "title" animation: location & font size change
		// TL.to(this.titleNode, stdDuration, {top: titleSelectedY + 'px', scale: 1.5})	//-90

		// //const totalTiles = this.totalTiles
	 //    //-- prev tile
	 //    const prevTileIndex = this.tileIndexQueue[0]
	 //    //console.log("INFO HomeShelf :: select, prevTileIndex is ", prevTileIndex)

	 //    if (prevTileIndex !== -1) {
	 //    	this.prevTile = this.tiles[prevTileIndex]
	 //    	const prevX = INIT_X - TILE_WIDTH_ARR[SHELF_KIND_OBJ.FOCUSED] - TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
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
		//     nextX = INIT_X + focusedTileWidth + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
		//     this.nextTile.toExpanded(nextX)

		//     const lastTileIndex = (prevTileIndex === -1)? this.totalTiles : this.totalTiles - 1
		//     for (var j = 3; j <= lastTileIndex; j++) {
		//     	nextTileIndex = this.tileIndexQueue[j]
		//     	//console.log("INFO HomeShelf :: select, nextTileIndex is ??? ", nextTileIndex)
		//     	let targetTile = this.tiles[nextTileIndex]
		//     	nextX += TILE_WIDTH_ARR[SHELF_KIND_OBJ.FOCUSED] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
		//     	targetTile.toExpanded(nextX)
		//     }
		// }
		//console.log("INFO HomeShelf :: select, nextTileIndex is ", nextTileIndex)
	}//_select

	unselect = () => {
		console.log("INFO HomeShelf :: unselect, shelf", this.props.index)
		// this.clearBloomTimer()

		// // this.setState({shelfKind: SHELF_KIND_OBJ.BASE, isSelected:false})	//TO CHEC
		// this.setState({shelfKind: SHELF_KIND_OBJ.BASE})	//TO CHECK:: topContainerTop
		// this.opacityChange(.6)

		// //-- shelf title animation: location & font size change
		// TL.to(this.titleNode, stdDuration, {top: TITLE_UNSELECTED_Y + 'px', scale: 1})	//-90

		// //-- prev tile
		// const prevTileIndex = this.tileIndexQueue[0]
	 //    if (prevTileIndex !== -1) {
	 //    	this.prevTile = this.tiles[prevTileIndex]
	 //    	const prevX = INIT_X - TILE_WIDTH_ARR[SHELF_KIND_OBJ.BASE] - TILE_OFFSET_ARR[SHELF_KIND_OBJ.BASE]
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
		//     nextX = INIT_X + TILE_WIDTH_ARR[SHELF_KIND_OBJ.BASE] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.BASE]
		//     this.nextTile.backToOrg(nextX)

		//     //-- the rest (CHECK the last one, when inited)
		//     const lastTileIndex = (prevTileIndex === -1)? this.totalTiles : this.totalTiles - 1
		//     for (var j = 3; j <= lastTileIndex; j++) {
		//     	nextTileIndex = this.tileIndexQueue[j]
		//     	let targetTile = this.tiles[nextTileIndex]
		//     	nextX += TILE_WIDTH_ARR[SHELF_KIND_OBJ.BASE] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.BASE]
		//     	targetTile.backToOrg(nextX)
		//     }
		// }
	}//_unselect

	doLeft = () => {
		console.log("INFO HomeShelf :: doLeft/moveToRight, shelf", this.props.index)
		//console.log("INFO HomeShelf :: doLeft/moveToRight, this.state.shelfKind ? ", this.state.shelfKind)
		// this.clearBloomTimer()

		// if (this.state.shelfKind === SHELF_KIND_OBJ.BLOOMED) {
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
		// 	const leftOffset = TILE_WIDTH_ARR[SHELF_KIND_OBJ.FOCUSED] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
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
		// 	let nextX = INIT_X + focusedTileWidth + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
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
		// 	    	nextX += TILE_WIDTH_ARR[SHELF_KIND_OBJ.FOCUSED] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
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
	}//_doLeft

	doRight = () => {
		console.log("\nINFO HomeShelf :: doRight, shelf", this.props.index)
		//console.log("INFO HomeShelf :: doRight, this.state.shelfKind ? ", this.state.shelfKind)

		// this.clearBloomTimer()

		// if (this.state.shelfKind === SHELF_KIND_OBJ.BLOOMED) {
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
		// 	const leftOffset = TILE_WIDTH_ARR[SHELF_KIND_OBJ.FOCUSED] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
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
		// 		let nextX = INIT_X + focusedTileWidth + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
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
		// 		    	nextX += TILE_WIDTH_ARR[SHELF_KIND_OBJ.FOCUSED] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED]
		// 		    }
		// 	   // }
			   
		// 	    // console.log("prevPrevTile???? " + prevPrevTile)
		// 	    if (prevPrevTile !== undefined) {
		// 	    	//-- give delay, then show as the last element
		// 	    	prevPrevTile.fadeInAt(nextX, .3, .2)	//stdDuration after
		// 	    }
		// 	} else {
		// 		if (prevPrevTile !== undefined) {
		// 	    	prevPrevTile.changeXLocTo(INIT_X + INIT_X + focusedTileWidth + TILE_OFFSET_ARR[SHELF_KIND_OBJ.FOCUSED])
		// 	    	prevPrevTile.toFocused(INIT_X)
		// 	    }
		// 	}

		//     //-- updateQueue
		//     let prevTileIndex = this.tileIndexQueue.shift()
		//     if (prevTileIndex !== -1) this.tileIndexQueue.push(prevTileIndex)
		//     //console.log("INFO HomeShelf :: doRight, this.tileIndexQueue  after ? ", this.tileIndexQueue)
		// }
	}//_doRight

	//_moveTo = (targetY = this.props.topY, pDuration = STD_DURATION) => {
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

	_opacityChange = (val) => {
		// this.topContainerStyle = {
		// 	top: this.state.topContainerTop + 'px',
		// 	opacity: val
		// }
		// TL.to(this.homeShelfContainer, 0, {opacity: val})
	}//_opacityChange

	_onLargeBloomStart = () => {
		console.log("INFO HomeShelf :: onLargeBloomStart")
		// this.setState({shelfKind: SHELF_KIND_OBJ.BLOOMED})
		// this.props.callBackOnLargeBloomStart()

		// let prevX
		// let nextX
		// if (this.prevTile !== null) {
		// 	prevX = INIT_X - (TILE_WIDTH_ARR[SHELF_KIND_OBJ.BLOOMED] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.BLOOMED])
		// 	this.prevTile.toMedBloomed(prevX)
		// }
		// if (this.nextTile !== null) {
		// 	nextX = INIT_X + (BLOOMED_TILE_W + TILE_OFFSET_ARR[SHELF_KIND_OBJ.BLOOMED])
		// 	this.nextTile.toMedBloomed(nextX)
		// }

		// //-- the rest of tiles in the current shelf
		// //console.log("INFO HomeShelf :: onLargeBloomStart, this.tileIndexQueue ?? " + this.tileIndexQueue)
		// const lastTileIndex = (this.tileIndexQueue[0] === -1)? this.totalTiles : this.totalTiles - 1
		// for (var j = 3; j <= lastTileIndex; j++) {
	 //    	let nextTileIndex = this.tileIndexQueue[j]
	 //    	let targetTile = this.tiles[nextTileIndex]
	 //    	nextX += TILE_WIDTH_ARR[SHELF_KIND_OBJ.BLOOMED] + TILE_OFFSET_ARR[SHELF_KIND_OBJ.BLOOMED]
	 //    	targetTile.toMedBloomed(nextX, false, 0)
	 //    }
	}//__onLargeBloomStart

	_clearBloomTimer = () => {
		console.log("INFO HomeShelf :: clearBloomTimer")
		// if (this.currTile !== null) this.currTile.killToLargeBloom()
	}//_clearBloomTimer

	_backToFocused = (pDir = "left") => {
		console.log("INFO HomeShelf :: _backToFocused, callBackOnNoMenuLeft")
		// this.setState({shelfKind: SHELF_KIND_OBJ.FOCUSED})
		// if (pDir === "left") {
		// 	this.doLeft()
		// } else {
		// 	this.doRight()
		// }
		this.props.callBackOnBackToFocused()
	}//_backToFocused

	_renderEachShelfTile = (tileObj, i) => {
		// console.log("INFO HomeShelf :: _renderEachShelfTile")
		const leftX = ( (i < MAX_TILE_INDEX) || (i < (this.totalTiles - 1)) )? INIT_X + TILE_WIDTH_ARR[SHELF_KIND_OBJ.BASE]*i : INIT_X - TILE_WIDTH_ARR[SHELF_KIND_OBJ.BASE];
		// const leftX = ( (i < MAX_TILE_INDEX) || (i < (this.totalTiles - 1)) )? INIT_X : INIT_X - TILE_WIDTH_ARR[SHELF_KIND_OBJ.BASE];
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
				  		callBackOnLargeBloomStart={this._onLargeBloomStart}
				  		callBackOnNoMenuLeft={this._backToFocused}>
		    	</ShelfTile>
		    // </View>
		)
	}//_renderEachShelfTile

	_find_dimesions = (layout) => {
	    const {height} = layout;
	    // console.warn(x);
	    // console.warn(y);
	    // console.warn(width);
	    // console.warn(height);
	    console.log('INFO HomeShelf :: _find_dimensions, height is ' + height);
	    console.log('INFO HomeShelf :: _find_dimensions, (28/RATIO) is ' + 28/RATIO);
	 }

	render() {
		let pPosition = (this.props.index === 0)? 'relative' : 'absolute'
		// console.log("INFO HomeShelf :: render, this.props.topY ? " + this.props.topY)

		//-- for testing
		const colorArr = ['darkcyan', 'darkred', 'darkorchid']
		let colorIndex = Math.floor(Math.random() * 3);
		let pColor = colorArr[colorIndex]
		//--------------
		return (
			<View 
				style={{ 
					position: pPosition,
					top: this.props.topY,
					width: '100%',
					height: '100%',
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


	//-- "tiles" ----------------------//
	homeShelfTilesContainer: {
		top: TITLE_N_TILE_OFFSET,
    	flex: 1,
    	borderWidth: .5,
    	borderColor: 'darkgreen',
	},
	//---------------------------------//
});

HomeShelf.propTypes = {
	index: PropTypes.number,
	// id: PropTypes.string,
	topY: PropTypes.number,
	title: PropTypes.string,
	shows: PropTypes.array,
	callBackOnLargeBloomStart: PropTypes.func,
	callBackOnBackToFocused: PropTypes.func,
	styleObj: PropTypes.object
};

HomeShelf.defaultProps = {
	callBackOnLargeBloomStart: () => {console.log("INFO HomeShelf :: please pass a function for callBackOnLargeBloomStart")},
	callBackOnBackToFocused: () => {console.log("INFO HomeShelf :: please pass a function for callBackOnBackToFocused")},
};