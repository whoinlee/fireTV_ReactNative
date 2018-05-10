import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native';
import KeyEvent from 'react-native-keyevent';
// import ShelfTile from './ShelfTile';

import config from '../../config';
import keyCodes from '../../keyCodes';
import styles from '../../styles/styles';



const STD_DURATION        = config.stdDuration;
const SHORT_DURATION      = config.shortDuration;
//
const SHELF_KIND_OBJ = {
  BASE: 0,
  FOCUSED: 1,
  BLOOMED: 2
};

const initX				= 200;
const tileBaseWidth		= [320, 375, 782];                	//shelfTile: 320x180, 375x210, 782x440
const tileBaseOffset	= [0, 24, 58];                   	//offset between tiles adjacent
const focusedTileWidth	= 590;
const bloomedTileWidth	= 1056;
//
const maxTileIndex		= Math.floor(1920/320);				//stageWidth/tileBaseWidth, max number of tiles in a row
const titleSelectedY 	= -90;
const titleUnselectedY	= 0;

export default class HomeShelf extends Component {
	constructor(props) {
		super(props)
		this.state = {
			shelfKind: SHELF_KIND_OBJ.BASE        //-- CHECK: need???
		}

		this.tiles = []							//original tiles

		//-- prevTileIndex: tileIndexQueue[0], currentTileIndex: tileIndexQueue[1], nextTileIndex: tileIndexQueue[2], and so on
		// this.tileIndexQueue = [-1]				//tile index array based on current location, from prev, current, to next etc (staring from entering no index for the prev tile)
		
		// this.prevTile = null
		// this.currTile = null
		// this.nextTile = null
		// this.totalTiles = props.shows.length	//-- CHECK???? totalTiles=0 case?????

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

	buildTileIndexQueue = () => {
		// console.log("INFO HomeShelf :: buildTileIndexQueue, this.props.shows.length ? ", this.props.shows.length)
		// for (var i=0; i<this.totalTiles; i++) {
		// 	const leftX = ( (i < maxTileIndex) || (i < (this.totalTiles - 1)) )? initX + tileBaseWidth[shelfKindObj.BASE]*i : initX - tileBaseWidth[shelfKindObj.BASE];
		// 	if (leftX < initX) {
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
	}

	reset = () => {
		// console.log("INFO HomeShelf :: reset", this.props.index)
		// this.clearBloomTimer()
	}//reset

	select = () => {
		//console.log("INFO HomeShelf :: select, shelf", this.props.index)
		// this.clearBloomTimer()

		// // this.setState({shelfKind: shelfKindObj.FOCUSED, isSelected:true})	//TO CHECK:: topContainerTop
		// this.setState({shelfKind: shelfKindObj.FOCUSED})	//TO CHECK:: topContainerTop
		// this.opacityChange(1)

		// //-- shelf "title" animation: location & font size change
		// TL.to(this.titleNode, stdDuration, {top: titleSelectedY + 'px', scale: 1.5})	//-90

		// //const totalTiles = this.totalTiles
	 //    //-- prev tile
	 //    const prevTileIndex = this.tileIndexQueue[0]
	 //    //console.log("INFO HomeShelf :: select, prevTileIndex is ", prevTileIndex)

	 //    if (prevTileIndex !== -1) {
	 //    	this.prevTile = this.tiles[prevTileIndex]
	 //    	const prevX = initX - tileBaseWidth[shelfKindObj.FOCUSED] - tileBaseOffset[shelfKindObj.FOCUSED]
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
		//     nextX = initX + focusedTileWidth + tileBaseOffset[shelfKindObj.FOCUSED]
		//     this.nextTile.toExpanded(nextX)

		//     const lastTileIndex = (prevTileIndex === -1)? this.totalTiles : this.totalTiles - 1
		//     for (var j = 3; j <= lastTileIndex; j++) {
		//     	nextTileIndex = this.tileIndexQueue[j]
		//     	//console.log("INFO HomeShelf :: select, nextTileIndex is ??? ", nextTileIndex)
		//     	let targetTile = this.tiles[nextTileIndex]
		//     	nextX += tileBaseWidth[shelfKindObj.FOCUSED] + tileBaseOffset[shelfKindObj.FOCUSED]
		//     	targetTile.toExpanded(nextX)
		//     }
		// }
		//console.log("INFO HomeShelf :: select, nextTileIndex is ", nextTileIndex)
	}//select

	unselect = () => {
		//console.log("INFO HomeShelf :: unselect, shelf", this.props.index)
		// this.clearBloomTimer()

		// // this.setState({shelfKind: shelfKindObj.BASE, isSelected:false})	//TO CHEC
		// this.setState({shelfKind: shelfKindObj.BASE})	//TO CHECK:: topContainerTop
		// this.opacityChange(.6)

		// //-- shelf title animation: location & font size change
		// TL.to(this.titleNode, stdDuration, {top: titleUnselectedY + 'px', scale: 1})	//-90

		// //-- prev tile
		// const prevTileIndex = this.tileIndexQueue[0]
	 //    if (prevTileIndex !== -1) {
	 //    	this.prevTile = this.tiles[prevTileIndex]
	 //    	const prevX = initX - tileBaseWidth[shelfKindObj.BASE] - tileBaseOffset[shelfKindObj.BASE]
	 //    	this.prevTile.backToOrg(prevX)
	 //    }

		// //-- current tile
	 //    const currTileIndex = this.tileIndexQueue[1]
	 //    this.currTile = this.tiles[currTileIndex]
	 //    this.currTile.backToOrg(initX)

	 //    //-- next tile and the rest of tiles
	 //    let nextTileIndex
	 //    let nextX 
	 //    if (this.tileIndexQueue.length > 2) {
		//     nextTileIndex = this.tileIndexQueue[2]
		//     this.nextTile  = this.tiles[nextTileIndex]
		//     nextX = initX + tileBaseWidth[shelfKindObj.BASE] + tileBaseOffset[shelfKindObj.BASE]
		//     this.nextTile.backToOrg(nextX)

		//     //-- the rest (CHECK the last one, when inited)
		//     const lastTileIndex = (prevTileIndex === -1)? this.totalTiles : this.totalTiles - 1
		//     for (var j = 3; j <= lastTileIndex; j++) {
		//     	nextTileIndex = this.tileIndexQueue[j]
		//     	let targetTile = this.tiles[nextTileIndex]
		//     	nextX += tileBaseWidth[shelfKindObj.BASE] + tileBaseOffset[shelfKindObj.BASE]
		//     	targetTile.backToOrg(nextX)
		//     }
		// }
	}//unselect

	doLeft = () => {
		//console.log("INFO HomeShelf :: doLeft/moveToRight, shelf", this.props.index)
		//console.log("INFO HomeShelf :: doLeft/moveToRight, this.state.shelfKind ? ", this.state.shelfKind)
		// this.clearBloomTimer()

		// if (this.state.shelfKind === shelfKindObj.BLOOMED) {
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
		// 	const leftOffset = tileBaseWidth[shelfKindObj.FOCUSED] + tileBaseOffset[shelfKindObj.FOCUSED]
		// 	const prevX = initX - leftOffset
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
		// 	this.currTile.toFocused(initX)

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
		// 	let nextX = initX + focusedTileWidth + tileBaseOffset[shelfKindObj.FOCUSED]
		// 	this.nextTile.toExpanded(nextX)

		// 	//-- then start animating all tiles to the right
		// 	let lastTileIndex = (this.prevTile === null)? this.totalTiles : this.totalTiles - 1
		// 	//if (lastTileIndex > maxTileIndex) lastTileIndex = maxTileIndex	//-- don't need to animate the tiles beyond stage width
		// 	//if (lastTileIndex !== undefined) {
		// 	    for (var j = 2; j < lastTileIndex; j++) {
		// 	    	console.log("INFO HomeShelf :: doLeft/moveToRight, j ", j)
		// 	    	let nextTileIndex = this.tileIndexQueue[j]
		// 	    	//console.log("INFO HomeShelf :: select, nextTileIndex is ??? ", nextTileIndex)
		// 	    	let targetTile = this.tiles[nextTileIndex]
		// 	    	nextX += tileBaseWidth[shelfKindObj.FOCUSED] + tileBaseOffset[shelfKindObj.FOCUSED]
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
		//console.log("\nINFO HomeShelf :: doRight, shelf", this.props.index)
		//console.log("INFO HomeShelf :: doRight, this.state.shelfKind ? ", this.state.shelfKind)

		// this.clearBloomTimer()

		// if (this.state.shelfKind === shelfKindObj.BLOOMED) {
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
		// 	const leftOffset = tileBaseWidth[shelfKindObj.FOCUSED] + tileBaseOffset[shelfKindObj.FOCUSED]
		// 	const prevX = initX - leftOffset

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
		// 		this.currTile.toFocused(initX)
		// 		let nextX = initX + focusedTileWidth + tileBaseOffset[shelfKindObj.FOCUSED]
		// 		//-- then start animating all tiles to the right
		// 		let lastTileIndex = (this.tileIndexQueue[0] === -1)? this.totalTiles : this.totalTiles - 1
		// 		//if (lastTileIndex > maxTileIndex) lastTileIndex = maxTileIndex	//-- don't need to animate the tiles beyond stage width
		// 		//if (lastTileIndex) {
		// 		    for (var j = 3; j <= lastTileIndex; j++) {
		// 		    	//console.log("INFO HomeShelf :: doRight, j ", j)
		// 		    	let nextTileIndex = this.tileIndexQueue[j]
		// 		    	//console.log("INFO HomeShelf :: select, nextTileIndex is ??? ", nextTileIndex)
		// 		    	let targetTile = this.tiles[nextTileIndex]
		// 		    	if (j === 3) this.nextTile = targetTile
		// 		    	targetTile.toExpanded(nextX)
		// 		    	//targetTile.toExpanded(nextX, noScale)
		// 		    	nextX += tileBaseWidth[shelfKindObj.FOCUSED] + tileBaseOffset[shelfKindObj.FOCUSED]
		// 		    }
		// 	   // }
			   
		// 	    // console.log("prevPrevTile???? " + prevPrevTile)
		// 	    if (prevPrevTile !== undefined) {
		// 	    	//-- give delay, then show as the last element
		// 	    	prevPrevTile.fadeInAt(nextX, .3, .2)	//stdDuration after
		// 	    }
		// 	} else {
		// 		if (prevPrevTile !== undefined) {
		// 	    	prevPrevTile.changeXLocTo(initX + initX + focusedTileWidth + tileBaseOffset[shelfKindObj.FOCUSED])
		// 	    	prevPrevTile.toFocused(initX)
		// 	    }
		// 	}

		//     //-- updateQueue
		//     let prevTileIndex = this.tileIndexQueue.shift()
		//     if (prevTileIndex !== -1) this.tileIndexQueue.push(prevTileIndex)
		//     //console.log("INFO HomeShelf :: doRight, this.tileIndexQueue  after ? ", this.tileIndexQueue)
		// }
	}//doRight

	moveTo = (targetY = this.props.y, pDuration = STD_DURATION) => {
		// console.log("INFO HomeShelf :: moveTo")
		// TL.to(this.homeShelfContainer, pDuration, {top: targetY+'px', ease:Power3.easeOut})
		// this.setState({topY: targetY, isMoved: true})
	}//moveTo

	// backTo = (targetY = this.props.y, pDuration = stdDuration) => {
	// 	console.log("INFO HomeShelf :: backTo")
	// 	this.moveTo(targetY, pDuration)
	// 	//TL.to(this.homeShelfContainer, pDuration, {top: targetY+'px', ease:Power3.easeOut})
	// }//backTo

	opacityChange = (val) => {
		// this.topContainerStyle = {
		// 	top: this.state.topContainerTop + 'px',
		// 	opacity: val
		// }
		// TL.to(this.homeShelfContainer, 0, {opacity: val})
	}//opacityChange

	onLargeBloomStart = () => {
		console.log("INFO HomeShelf :: onLargeBloomStart")
		// this.setState({shelfKind: shelfKindObj.BLOOMED})
		// this.props.callBackOnLargeBloomStart()

		// let prevX
		// let nextX
		// if (this.prevTile !== null) {
		// 	prevX = initX - (tileBaseWidth[shelfKindObj.BLOOMED] + tileBaseOffset[shelfKindObj.BLOOMED])
		// 	this.prevTile.toMedBloomed(prevX)
		// }
		// if (this.nextTile !== null) {
		// 	nextX = initX + (bloomedTileWidth + tileBaseOffset[shelfKindObj.BLOOMED])
		// 	this.nextTile.toMedBloomed(nextX)
		// }

		// //-- the rest of tiles in the current shelf
		// //console.log("INFO HomeShelf :: onLargeBloomStart, this.tileIndexQueue ?? " + this.tileIndexQueue)
		// const lastTileIndex = (this.tileIndexQueue[0] === -1)? this.totalTiles : this.totalTiles - 1
		// for (var j = 3; j <= lastTileIndex; j++) {
	 //    	let nextTileIndex = this.tileIndexQueue[j]
	 //    	let targetTile = this.tiles[nextTileIndex]
	 //    	nextX += tileBaseWidth[shelfKindObj.BLOOMED] + tileBaseOffset[shelfKindObj.BLOOMED]
	 //    	targetTile.toMedBloomed(nextX, false, 0)
	 //    }
	}

	clearBloomTimer = () => {
		console.log("INFO HomeShelf :: clearBloomTimer")
		// if (this.currTile !== null) this.currTile.killToLargeBloom()
	}

	backToFocused = (pDir = "left") => {
		console.log("INFO HomeShelf :: backToFocused, callBackOnNoMenuLeft")
		// this.setState({shelfKind: shelfKindObj.FOCUSED})
		// if (pDir === "left") {
		// 	this.doLeft()
		// } else {
		// 	this.doRight()
		// }
		// this.props.callBackOnBackToFocused()
	}

	eachShelfTile = (tileObj, i) => {
		//const leftX = ( (i < maxTileIndex) || (i < (this.totalTiles - 1)) )? initX + tileBaseWidth[shelfKindObj.BASE]*i : initX - tileBaseWidth[shelfKindObj.BASE];
		return (
			<View />
			// <ShelfTile 	key={(i + 1).toString()}
			// 	  		index={i}
			// 	  		showTitle={tileObj.showTitle}
			// 	  		episodeTitle={tileObj.episodeTitle}
			// 	  		episodeID={tileObj.episode}
			// 	  		episodeDesc={" " + tileObj.episodeDesc}
			// 	  		imageURL={tileObj.imageURL}
			// 	  		leftX={leftX} 
			// 	  		homeShelfIndex={this.props.index}
			// 	  		ref={node => this.tiles.push(node)}
			// 	  		callBackOnLargeBloomStart={this.onLargeBloomStart}
			// 	  		callBackOnNoMenuLeft={this.backToFocused}>
		 //    </ShelfTile>
		)
	}//eachShelfTile

	render() {
		if (this.props.index === 0) {
			console.log("INFO HomeShelf :: render ", this.props.index)
			console.log("INFO HomeShelf :: render, tileIndexQueue : ", this.tileIndexQueue)
		}
		return (
			<View />
			// <div className="HomeShelf" 
			// 	 id={"homeShelfContainer" + this.props.index} 
			// 	 //style={this.topContainerStyle}
			// 	 style={{top: this.props.y + 'px', opacity:1}}
			// 	 ref={node => {this.homeShelfContainer = node}}>
			// 	<div className="homeShelfTitleContainer" 
			// 		 ref={node => {this.titleNode = node}}>
			// 		{this.props.title}
			// 	</div>
			// 	<div className="homeShelfTilesContainer" 
			// 		 style={this.tileContainerStyle}>
			// 		{this.props.shows.map(this.eachShelfTile)}
			// 	</div>
			// </div>
		)
	}//render
}

HomeShelf.propTypes = {
	index: PropTypes.number,
	id: PropTypes.string,
	title: PropTypes.string,
	shows: PropTypes.array,
	y: PropTypes.number,
	callBackOnLargeBloomStart: PropTypes.func,
	callBackOnBackToFocused: PropTypes.func
};

HomeShelf.defaultProps = {
	index: 0,
	id: "HomeShelf0",
	title: "",
	shows: [],
	y: 62,
	callBackOnLargeBloomStart: () => {console.log("INFO HomeShelf :: please pass a function for callBackOnLargeBloomStart")},
	callBackOnBackToFocused: () => {console.log("INFO HomeShelf :: please pass a function for callBackOnBackToFocused")}
};

