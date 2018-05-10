import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native';
import KeyEvent from 'react-native-keyevent';
import ImageButton from './ImageButton';

import config from '../../config';
import keyCodes from '../../keyCodes';
import styles from '../../styles/styles';


const STD_DURATION        = config.stdDuration;
const SHORT_DURATION      = config.shortDuration;
//
const tileKindObj = {
  ORIGINAL: 0,
  EXPANDED: 1,
  FOCUSED: 2,
  MED_BLOOMED: 3,
  LG_BLOOMED: 4
};
const tileSizeArr = [
  [320, 180],	//0.303 of the largest
  [375, 211],	//0.355 (375x211) of the largest
  [590, 332],	//.559 of the largest
  [782, 440],	//.741 of the largest
  [1056, 594]
];
const waitToLargeBloomDuration	= 4;
const toExpandedScale = Math.round(tileSizeArr[tileKindObj.EXPANDED][0]*100/tileSizeArr[tileKindObj.ORIGINAL][0])/100;		//1.17
const toFocusedScale = Math.round(tileSizeArr[tileKindObj.FOCUSED][0]*100/tileSizeArr[tileKindObj.ORIGINAL][0])/100;		//1.84
const toMedBloomedScale = Math.round(tileSizeArr[tileKindObj.MED_BLOOMED][0]*100/tileSizeArr[tileKindObj.ORIGINAL][0])/100;	//2.44
const toLgBloomedScale = Math.round(tileSizeArr[tileKindObj.LG_BLOOMED][0]*100/tileSizeArr[tileKindObj.ORIGINAL][0])/100;	//3.30
const infoIconPath = '../assets/images/icons/infoIcon.png';
const playIconPath = '../assets/images/icons/playIcon.png';
const addToIconPath = '../assets/images/icons/addToIcon.png';
const selectedInfoIconPath = '../assets/images/icons/infoIconSelected.png';
const selectedPlayIconPath = '../assets/images/icons/playIconSelected.png';
const selectedAddToIconPath = '../assets/images/icons/addToIconSelected.png';



class ShelfTile extends Component {
	constructor(props) {
		super(props)
		this.state = {
			tileKind: tileKindObj.ORIGINAL,
			selectedMenuIndex: -1
		}

		this.bloomToLargeTimerID = null
		this.renderContent = this.renderContent.bind(this)
		this.updateState = this.updateState.bind(this)
		this.menus= []

		this.backToOrg = this.backToOrg.bind(this)
		this.toFocused = this.toFocused.bind(this)
		this.toExpanded = this.toExpanded.bind(this)
		this.toMedBloomed = this.toMedBloomed.bind(this)
		this.toLargeBloomed = this.toLargeBloomed.bind(this)
		this.showFocusedContent = this.showFocusedContent.bind(this)
		this.hideFocusedContent = this.hideFocusedContent.bind(this)
		this.showBloomedContent = this.showBloomedContent.bind(this)
		this.waitToLargeBloom = this.waitToLargeBloom.bind(this)
		this.killToLargeBloom = this.killToLargeBloom.bind(this)
		this.changeXLocTo = this.changeXLocTo.bind(this)
		this.fadeInAt = this.fadeInAt.bind(this)
		this.doLeft = this.doLeft.bind(this)
		this.doRight = this.doRight.bind(this)
		this.doSelect = this.doSelect.bind(this)
	}

	componentWillMount() {
		this.style = {
			left: this.props.leftX + 'px'
		}
	}

	updateState = (tileKind) => {
		//console.log("INFO ShelfTile :: updateState, index: " + this.props.index)
		let newSelectedMenuIndex
		if (tileKind === tileKindObj.LG_BLOOMED) {
			newSelectedMenuIndex = 1	//playMenu
		} else {
			newSelectedMenuIndex = -1	//noMenu
		}
		this.setState({tileKind: tileKind, selectedMenuIndex: newSelectedMenuIndex})
	}

	backToOrg = (targetX) => {
		//console.log("INFO ShelfTile :: backToOrg, index: " + this.props.index)
		this.updateState(tileKindObj.ORIGINAL)
		TL.to(this.containerDiv, stdDuration, {left: targetX+'px'})
		TL.to(this.imageContainer, stdDuration, {css: { '-webkit-filter': 'brightness(1)', scale: 1 }})
	}//backToOrg

	toExpanded = (targetX, noScale=false, pDuration=stdDuration) => {
		//console.log("INFO ShelfTile :: toExpanded, index: " + this.props.index)
		this.updateState(tileKindObj.EXPANDED)
		TL.to(this.containerDiv, pDuration, {left: targetX+'px'})
		
		if (noScale) {
			TL.to(this.imageContainer, pDuration, {css: { '-webkit-filter': 'brightness(1)'}})
		} else {
			TL.to(this.imageContainer, pDuration, {css: { '-webkit-filter': 'brightness(1)', scale: toExpandedScale}})
		}
	}//toExpanded

	toFocused = (targetX = undefined) => {
		//console.log("INFO ShelfTile :: toFocused, index: " + this.props.index)
		this.killToLargeBloom()
		this.updateState(tileKindObj.FOCUSED)
		if (targetX !== undefined) {
			TL.to(this.containerDiv, stdDuration, {left: targetX+'px'})
		}
		//.7 to .5
		TL.to(this.imageContainer, stdDuration, {css: {'-webkit-filter': 'brightness(.5)', scale: toFocusedScale}, onComplete: this.showFocusedContent()})
	}//toFocused

	toMedBloomed = (targetX, noScale=false, pDuration=stdDuration) => {
		// console.log("INFO ShelfTile :: toMedBloomed")
		this.updateState(tileKindObj.MED_BLOOMED)
		TL.to(this.containerDiv, stdDuration, {left: targetX+'px'})
		if (noScale) {
			TL.to(this.imageContainer, pDuration, {css: { '-webkit-filter': 'brightness(1)'}})
		} else {
			TL.to(this.imageContainer, pDuration, {css: {'-webkit-filter': 'brightness(1)', scale: toMedBloomedScale}})
		}
	}//toMedBloomed

	toLargeBloomed = () => {
		// console.log("INFO ShelfTile :: toLargeBloomed")
		this.killToLargeBloom()
		this.updateState(tileKindObj.LG_BLOOMED)
		this.props.callBackOnLargeBloomStart()
		TL.to(this.imageContainer, stdDuration, {css: {scale: toLgBloomedScale}, onComplete: this.showBloomedContent()})
	}//toLargeBloomed

	showFocusedContent = () => { TL.to(this.focusedContent, stdDuration, {delay:.2, opacity:1, onComplete: this.waitToLargeBloom()}) }

	hideFocusedContent = () => { TL.to(this.focusedContent, 0, {opacity:0}) }

	showBloomedContent = () => {
		// console.log("INFO ShelfTile :: showBloomedContent")
		TL.to(this.bloomedContent, stdDuration, {delay:stdDuration, css: {visibility: 'visible', opacity: 1}})
	}//showBloomedContent

	waitToLargeBloom = () => {
		this.killToLargeBloom()
		this.bloomToLargeTimerID = setTimeout(() => this.toLargeBloomed(), waitToLargeBloomDuration*1000)
	}//waitToLargeBloom

	killToLargeBloom = () => { if (this.bloomToLargeTimerID !== null) clearTimeout(this.bloomToLargeTimerID) }

	changeXLocTo = (targetX) => { TL.to(this.containerDiv, 0, {left: targetX+'px'}) }

	fadeInAt = (targetX, pDelay=0, pDuration=stdDuration) => {
		TL.to(this.containerDiv, 0, {opacity: 0, left: targetX+'px', delay:pDelay})	//CHECK
		TL.to(this.containerDiv, pDuration, {opacity: 1, delay:pDelay+.1})
	}//fadeInAt

	doLeft = () => {
		console.log("INFO ShelfTile :: doLeft, to the menu in the left, this.state.selectedMenuIndex? " + this.state.selectedMenuIndex)
		if (this.state.tileKind !== tileKindObj.LG_BLOOMED) return
		if (this.state.selectedMenuIndex !== 0) {
			this.setState({selectedMenuIndex: this.state.selectedMenuIndex - 1 })
			console.log("INFO ShelfTile :: doLeft, after setState, this.state.selectedMenuIndex? " + this.state.selectedMenuIndex)
		} else {
			console.log("INFO ShelfTile :: doLeft, calling callBackOnNoMenuLeft")
			this.props.callBackOnNoMenuLeft("left")
		}
	}

	doRight = () => {
		console.log("INFO ShelfTile :: doRight, to the menu in the right")
		// const totalMenu = this.menus.length
		const totalMenu = 3
		console.log("INFO ShelfTile :: doRight, totalMenu ?? " + totalMenu)
		if (this.state.tileKind !== tileKindObj.LG_BLOOMED) return
		if (this.state.selectedMenuIndex < (totalMenu - 1)) {
			this.setState({selectedMenuIndex: this.state.selectedMenuIndex + 1 })
			console.log("INFO ShelfTile :: doRight, after setState, this.state.selectedMenuIndex? " + this.state.selectedMenuIndex)
		} else {
			console.log("INFO ShelfTile :: doRight, calling callBackOnNoMenuLeft")
			this.props.callBackOnNoMenuLeft("right")
		}
	}

	doSelect = () => {

	}

	onInfoButtonClicked = (e) => {
		console.log("INFO ShelfTile :: onInfoButtonClicked")
	}

	onPlayButtonClicked = (e) => {
		console.log("INFO ShelfTile :: onPlayButtonClicked")
	}

	onAddToButtonClicked = (e) => {
		console.log("INFO ShelfTile :: onAddToButtonClicked")
	}

	renderContent = () => {
		// console.log("INFO ShelfTile :: renderContent, this.state.tileKind is " + this.state.tileKind)
		switch (this.state.tileKind) {
			case tileKindObj.EXPANDED:
				return (
			    	<div className="expandedTileContent">
					{this.props.episodeID}  <span className="baseEpisodeID">{this.props.showTitle}</span>
					</div>
				)
			case tileKindObj.FOCUSED:
				this.selectedMenuIndex = -1;
				this.menus = []
				return (
		         	<div className="focusedTileContent" ref={node => this.focusedContent = node}>
		         		<div className="focusedShowTitle">{this.props.showTitle}</div>
		         		<div className="focusedEpisodeTitle">{this.props.episodeTitle}</div>
		            	<div className="focusedEpisodeID">{this.props.episodeID}</div>
		          	</div>
		      	)
			case tileKindObj.LG_BLOOMED:
				console.log("INFO ShelfTile :: renderContent, tileKindObj.LG_BLOOMED, this.state.selectedMenuIndex?? " + this.state.selectedMenuIndex)
				this.menus = []
				return (
		         	<div className="bloomedTileContent" ref={node => this.bloomedContent = node}>
		         		<div className="bloomedShowTitle">{this.props.showTitle}</div>
		         		<div className="bloomedEpisodeTitle">{this.props.episodeTitle}</div>
		         		<div className="bloomedButtons">
		         			<ImageButton id="infoButton" top={0} left={0} 
		         				isSelected={(this.state.selectedMenuIndex === 0)? true: false} 
		         				imageURL={infoIconPath}
		         				selectedImageURL={selectedInfoIconPath}
		         				onSelect={this.onInfoButtonClicked} 
		         				ref={node => this.menus.push(node)} />
		         			<ImageButton id="playButton" top={0} left={94} 
		         				isSelected={(this.state.selectedMenuIndex === 1)? true: false} 
		         				imageURL={playIconPath}
		         				selectedImageURL={selectedPlayIconPath}
		         				onSelect={this.onPlayButtonClicked} 
		         				ref={node => this.menus.push(node)} />
		         			<ImageButton id="addToButton" top={0} left={188} 
		         				isSelected={(this.state.selectedMenuIndex === 2)? true: false} 
		         				imageURL={addToIconPath}
		         				selectedImageURL={selectedAddToIconPath}
		         				onSelect={this.onAddToButtonClicked} 
		         				ref={node => this.menus.push(node)} />
		         		</div>
		            	<div className="bloomedEpisodeID">{this.props.episodeID}&nbsp;<span className="bloomedEpisodeDesc">{this.props.episodeDesc}</span></div>
		          	</div>
		      	)
		    case tileKindObj.MED_BLOOMED:
		    	console.log("ever????????????")
		    	//return null
		    	break;
		    default:
				return null
		}
	}//renderContent

	render() {
		return (
			<div className="ShelfTile"	style={{left: this.props.leftX + 'px'}} 
										ref={node => this.containerDiv = node}>
				<div className="tileImageContainer" ref={node => this.imageContainer = node}>
					<img src={this.props.imageURL} width={tileSizeArr[tileKindObj.ORIGINAL][0]} height={tileSizeArr[tileKindObj.ORIGINAL][1]} alt='tileImage'></img>
				</div>
				{this.renderContent()}
			</div>
		)
	}//render
}

ShelfTile.propTypes = {
	index:  PropTypes.number,
	homeShelfIndex: PropTypes.number,
	showTitle: PropTypes.string,
	episodeTitle: PropTypes.string,
	episodeID: PropTypes.string,
	episodeDesc: PropTypes.string,
	imageURL: PropTypes.string,
	leftX: PropTypes.number,
	callBackOnLargeBloomStart: PropTypes.func,
	callBackOnNoMenuLeft: PropTypes.func
};

ShelfTile.defaultProps = {
	leftX: 200
};

export default ShelfTile
