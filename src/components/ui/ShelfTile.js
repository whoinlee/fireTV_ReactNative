import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
	Image,
  	Text,
  	TouchableNativeFeedback,
  	View
} from 'react-native';
import KeyEvent from 'react-native-keyevent';
import ImageButton from './ImageButton';

import config from '../../config';
import keyCodes from '../../keyCodes';
import styles from '../../styles/styles';
import homeShelvesStyle from '../../styles/homeShelvesStyle';


const RATIO                 = config.density;
const STD_DURATION        	= config.stdDuration;
const SHORT_DURATION      	= config.shortDuration;
const WAIT_TO_LARGE_BLOOM_DURATION	= config.waitToLargeBloomDuration/1000;	//in seconds
const ASSET_URL				= '../../assets/';
//
const TILE_KIND_OBJ 		= {
  ORIGINAL: 0,				//-- base row
  EXPANDED: 1,				//-- focused row, unfocused tile
  FOCUSED: 2,				//-- focused row, focused tile
  MED_BLOOMED: 3,			//-- bloomed row, unfocused tile
  LG_BLOOMED: 4				//-- bloomed row, focused tile
};
const TILE_SIZE_ARR 		= [
  [320/RATIO, 180/RATIO],				//-- original tile size: 0.303 of the largeBloomed
  [375/RATIO, 211/RATIO],				//-- expanded tile size: 0.355 (375x211) of the largeBloomed
  [590/RATIO, 332/RATIO],				//-- focused tile size:  0.559 of the largeBloomed
  [782/RATIO, 440/RATIO],				//-- medBloomed tile size: 0.741 of the largeBloomed
  [1056/RATIO, 594/RATIO]				//-- largeBloomed tile size
];
//
const toExpandedScale = Math.round(TILE_SIZE_ARR[TILE_KIND_OBJ.EXPANDED][0]*100/TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][0])/100;		//1.17
const toFocusedScale = Math.round(TILE_SIZE_ARR[TILE_KIND_OBJ.FOCUSED][0]*100/TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][0])/100;		//1.84
const toMedBloomedScale = Math.round(TILE_SIZE_ARR[TILE_KIND_OBJ.MED_BLOOMED][0]*100/TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][0])/100;	//2.44
const toLgBloomedScale = Math.round(TILE_SIZE_ARR[TILE_KIND_OBJ.LG_BLOOMED][0]*100/TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][0])/100;	//3.30
//
const infoIconPath = '../../assets/images/icons/infoIcon.png';
const playIconPath = '../../assets/images/icons/playIcon.png';
const addToIconPath = '../../assets/images/icons/addToIcon.png';
const selectedInfoIconPath = '../../assets/images/icons/infoIconSelected.png';
const selectedPlayIconPath = '../../assets/images/icons/playIconSelected.png';
const selectedAddToIconPath = '../../assets/images/icons/addToIconSelected.png';

class ShelfTile extends Component {
	constructor(props) {
		super(props)
		this.state = {
			tileKind: TILE_KIND_OBJ.ORIGINAL,
			selectedMenuIndex: -1		//no selection (??? or playIcon?)
		}

		this.menus= []
		this.bloomToLargeTimerID = null

		// this.renderContent = this.renderContent.bind(this)
		// this.updateState = this.updateState.bind(this)
		// this.backToOrg = this.backToOrg.bind(this)
		// this.toFocused = this.toFocused.bind(this)
		// this.toExpanded = this.toExpanded.bind(this)
		// this.toMedBloomed = this.toMedBloomed.bind(this)
		// this.toLargeBloomed = this.toLargeBloomed.bind(this)
		// this.showFocusedContent = this.showFocusedContent.bind(this)
		// this.hideFocusedContent = this.hideFocusedContent.bind(this)
		// this.showBloomedContent = this.showBloomedContent.bind(this)
		// this.waitToLargeBloom = this.waitToLargeBloom.bind(this)
		// this.killToLargeBloom = this.killToLargeBloom.bind(this)
		// this.changeXLocTo = this.changeXLocTo.bind(this)
		// this.fadeInAt = this.fadeInAt.bind(this)
		// this.doLeft = this.doLeft.bind(this)
		// this.doRight = this.doRight.bind(this)
		// this.doSelect = this.doSelect.bind(this)
	}

	componentWillMount() {
		// this.style = {
		// 	left: this.props.leftX + 'px'
		// }
	}//componentWillMount

	_updateState = (tileKind) => {
		console.log("INFO ShelfTile :: _updateState, index: " + this.props.index)
		// let newSelectedMenuIndex
		// if (tileKind === TILE_KIND_OBJ.LG_BLOOMED) {
		// 	newSelectedMenuIndex = 1	//playMenu
		// } else {
		// 	newSelectedMenuIndex = -1	//noMenu
		// }
		// this.setState({tileKind: tileKind, selectedMenuIndex: newSelectedMenuIndex})
	}//_updateState

	_backToOrg = (targetX) => {
		console.log("INFO ShelfTile :: _backToOrg, index: " + this.props.index)
		// this.updateState(TILE_KIND_OBJ.ORIGINAL)
		// TL.to(this.containerDiv, stdDuration, {left: targetX+'px'})
		// TL.to(this.imageContainer, stdDuration, {css: { '-webkit-filter': 'brightness(1)', scale: 1 }})
	}//_backToOrg

	_toExpanded = (targetX, noScale=false, pDuration=stdDuration) => {
		console.log("INFO ShelfTile :: _toExpanded, index: " + this.props.index)
		// this.updateState(TILE_KIND_OBJ.EXPANDED)
		// TL.to(this.containerDiv, pDuration, {left: targetX+'px'})
		
		// if (noScale) {
		// 	TL.to(this.imageContainer, pDuration, {css: { '-webkit-filter': 'brightness(1)'}})
		// } else {
		// 	TL.to(this.imageContainer, pDuration, {css: { '-webkit-filter': 'brightness(1)', scale: toExpandedScale}})
		// }
	}//_toExpanded

	_toFocused = (targetX = undefined) => {
		console.log("INFO ShelfTile :: _toFocused, index: " + this.props.index)
		// this.killToLargeBloom()
		// this.updateState(TILE_KIND_OBJ.FOCUSED)
		// if (targetX !== undefined) {
		// 	TL.to(this.containerDiv, stdDuration, {left: targetX+'px'})
		// }
		// //.7 to .5
		// TL.to(this.imageContainer, stdDuration, {css: {'-webkit-filter': 'brightness(.5)', scale: toFocusedScale}, onComplete: this.showFocusedContent()})
	}//_toFocused

	_toMedBloomed = (targetX, noScale=false, pDuration=stdDuration) => {
		console.log("INFO ShelfTile :: _toMedBloomed")
		// this.updateState(TILE_KIND_OBJ.MED_BLOOMED)
		// TL.to(this.containerDiv, stdDuration, {left: targetX+'px'})
		// if (noScale) {
		// 	TL.to(this.imageContainer, pDuration, {css: { '-webkit-filter': 'brightness(1)'}})
		// } else {
		// 	TL.to(this.imageContainer, pDuration, {css: {'-webkit-filter': 'brightness(1)', scale: toMedBloomedScale}})
		// }
	}//_toMedBloomed

	_toLargeBloomed = () => {
		console.log("INFO ShelfTile :: _toLargeBloomed")
		// this.killToLargeBloom()
		// this.updateState(TILE_KIND_OBJ.LG_BLOOMED)
		// this.props.callBackOnLargeBloomStart()
		// TL.to(this.imageContainer, stdDuration, {css: {scale: toLgBloomedScale}, onComplete: this.showBloomedContent()})
	}//_toLargeBloomed

	_showFocusedContent = () => { 
		console.log("INFO ShelfTile :: _showFocusedContent")
		// TL.to(this.focusedContent, stdDuration, {delay:.2, opacity:1, onComplete: this.waitToLargeBloom()}) 
	}//_showFocusedContent

	_hideFocusedContent = () => { 
		console.log("INFO ShelfTile :: _hideFocusedContent")
		// TL.to(this.focusedContent, 0, {opacity:0}) 
	}//_hideFocusedContent

	_showBloomedContent = () => {
		console.log("INFO ShelfTile :: _showBloomedContent")
		// TL.to(this.bloomedContent, stdDuration, {delay:stdDuration, css: {visibility: 'visible', opacity: 1}})
	}//_showBloomedContent

	_waitToLargeBloom = () => {
		console.log("INFO ShelfTile :: _waitToLargeBloom")
		this._killToLargeBloom()
		this.bloomToLargeTimerID = setTimeout(() => this._toLargeBloomed(), WAIT_TO_LARGE_BLOOM_DURATION*1000)
	}//_waitToLargeBloom

	_killToLargeBloom = () => {
		console.log("INFO ShelfTile :: _killToLargeBloom")
		//if (this.bloomToLargeTimerID !== null) clearTimeout(this.bloomToLargeTimerID) 
	}

	changeXLocTo = (targetX) => { TL.to(this.containerDiv, 0, {left: targetX+'px'}) }

	fadeInAt = (targetX, pDelay=0, pDuration=stdDuration) => {
		TL.to(this.containerDiv, 0, {opacity: 0, left: targetX+'px', delay:pDelay})	//CHECK
		TL.to(this.containerDiv, pDuration, {opacity: 1, delay:pDelay+.1})
	}//fadeInAt

	_doLeft = () => {
		console.log("INFO ShelfTile :: _doLeft, to the menu in the left, this.state.selectedMenuIndex? " + this.state.selectedMenuIndex)
		// if (this.state.tileKind !== TILE_KIND_OBJ.LG_BLOOMED) return
		// if (this.state.selectedMenuIndex !== 0) {
		// 	this.setState({selectedMenuIndex: this.state.selectedMenuIndex - 1 })
		// 	console.log("INFO ShelfTile :: doLeft, after setState, this.state.selectedMenuIndex? " + this.state.selectedMenuIndex)
		// } else {
		// 	console.log("INFO ShelfTile :: doLeft, calling callBackOnNoMenuLeft")
		// 	this.props.callBackOnNoMenuLeft("left")
		// }
	}//_doLeft

	_doRight = () => {
		console.log("INFO ShelfTile :: _doRight, to the menu in the right")
		// const totalMenu = this.menus.length
		// const totalMenu = 3
		// console.log("INFO ShelfTile :: _doRight, totalMenu ?? " + totalMenu)
		// if (this.state.tileKind !== TILE_KIND_OBJ.LG_BLOOMED) return
		// if (this.state.selectedMenuIndex < (totalMenu - 1)) {
		// 	this.setState({selectedMenuIndex: this.state.selectedMenuIndex + 1 })
		// 	console.log("INFO ShelfTile :: _doRight, after setState, this.state.selectedMenuIndex? " + this.state.selectedMenuIndex)
		// } else {
		// 	console.log("INFO ShelfTile :: _doRight, calling callBackOnNoMenuLeft")
		// 	this.props.callBackOnNoMenuLeft("right")
		// }
	}//_doRight

	_doSelect = () => {

	}//_doSelect

	_onInfoButtonClicked = (e) => {
		console.log("INFO ShelfTile :: _onInfoButtonClicked")
	}//_onInfoButtonClicked

	_onPlayButtonClicked = (e) => {
		console.log("INFO ShelfTile :: _onPlayButtonClicked")
	}//_onPlayButtonClicked

	_onAddToButtonClicked = (e) => {
		console.log("INFO ShelfTile :: _onAddToButtonClicked")
	}//_onAddToButtonClicked

	_renderContent = () => {
		console.log("INFO ShelfTile :: _renderContent, this.state.tileKind is " + this.state.tileKind)
		// switch (this.state.tileKind) {
		// 	case TILE_KIND_OBJ.EXPANDED:
		// 		return (
		// 	    	<div className="expandedTileContent">
		// 			{this.props.episodeID}  <span className="baseEpisodeID">{this.props.showTitle}</span>
		// 			</div>
		// 		)
		// 	case TILE_KIND_OBJ.FOCUSED:
		// 		this.selectedMenuIndex = -1;
		// 		this.menus = []
		// 		return (
		//          	<div className="focusedTileContent" ref={node => this.focusedContent = node}>
		//          		<div className="focusedShowTitle">{this.props.showTitle}</div>
		//          		<div className="focusedEpisodeTitle">{this.props.episodeTitle}</div>
		//             	<div className="focusedEpisodeID">{this.props.episodeID}</div>
		//           	</div>
		//       	)
		// 	case TILE_KIND_OBJ.LG_BLOOMED:
		// 		console.log("INFO ShelfTile :: renderContent, TILE_KIND_OBJ.LG_BLOOMED, this.state.selectedMenuIndex?? " + this.state.selectedMenuIndex)
		// 		this.menus = []
		// 		return (
		//          	<div className="bloomedTileContent" ref={node => this.bloomedContent = node}>
		//          		<div className="bloomedShowTitle">{this.props.showTitle}</div>
		//          		<div className="bloomedEpisodeTitle">{this.props.episodeTitle}</div>
		//          		<div className="bloomedButtons">
		//          			<ImageButton id="infoButton" top={0} left={0} 
		//          				isSelected={(this.state.selectedMenuIndex === 0)? true: false} 
		//          				imageURL={infoIconPath}
		//          				selectedImageURL={selectedInfoIconPath}
		//          				onSelect={this.onInfoButtonClicked} 
		//          				ref={node => this.menus.push(node)} />
		//          			<ImageButton id="playButton" top={0} left={94} 
		//          				isSelected={(this.state.selectedMenuIndex === 1)? true: false} 
		//          				imageURL={playIconPath}
		//          				selectedImageURL={selectedPlayIconPath}
		//          				onSelect={this.onPlayButtonClicked} 
		//          				ref={node => this.menus.push(node)} />
		//          			<ImageButton id="addToButton" top={0} left={188} 
		//          				isSelected={(this.state.selectedMenuIndex === 2)? true: false} 
		//          				imageURL={addToIconPath}
		//          				selectedImageURL={selectedAddToIconPath}
		//          				onSelect={this.onAddToButtonClicked} 
		//          				ref={node => this.menus.push(node)} />
		//          		</div>
		//             	<div className="bloomedEpisodeID">{this.props.episodeID}&nbsp;<span className="bloomedEpisodeDesc">{this.props.episodeDesc}</span></div>
		//           	</div>
		//       	)
		//     case TILE_KIND_OBJ.MED_BLOOMED:
		//     	console.log("ever????????????")
		//     	//return null
		//     	break;
		//     default:
		// 		return null
		// }//switch
	}//renderContent

	render() {
		console.log("INFO ShelfTile :: render, this.props.imageURL ? " + this.props.imageURL)
		console.log("INFO ShelfTile :: render, this.props.leftX ? " + this.props.leftX)
		const imageSRC = this.props.imageURL;
		const imageURL = '../../assets/images/shows/topChef-s15e06-1056x594.jpg'
		// const imageURL = require(imageSRC);
		//<Image source={require(imageURL)} style={{width: 320/RATIO, height: 180/RATIO}}/>	/*working*/
		//<Image source={require(imageURL)} style={{width: 320/RATIO, height: 180/RATIO}}/>	/*working*/
		// let pWidth = (this.props.index == 0)? 640/RATIO : 320/RATIO;
		let pWidth = (this.props.index == 0)? 640/RATIO : 320/RATIO;
		/*
						<Image 	source={	require(imageURL)	} 
						style={{	
									width: 	320/RATIO, 				
									height: 180/RATIO,	
									borderColor: '#000000', borderWidth: 1	
						}}	/>	
		*/
		let pPosition = (this.props.index == 0)? 'relative' : 'absolute'
		return (
			<View style={{	
							backgroundColor: 'green', 
							position: pPosition,
							width: 320/RATIO, 
							height: 180/RATIO,  
							//left: 0, 
							left: this.props.leftX, 
							// top: 0,
							// display: 'none'
							borderColor: '#000000', borderWidth: .5	
						}}	>
				<Text style={styles.comment}>{this.props.index}</Text>		
			</View>
		)
	}//render
}

/*
<ShelfTile 	ref={node => this.tiles.push(node)}
						key={(i + 1).toString()}
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
*/

ShelfTile.propTypes = {
	index:  PropTypes.number,
	homeShelfIndex: PropTypes.number,
	//leftX: PropTypes.number,
	showTitle: PropTypes.string,
	episodeTitle: PropTypes.string,
	episodeID: PropTypes.string,
	episodeDesc: PropTypes.string,
	imageURL: PropTypes.string,
	callBackOnLargeBloomStart: PropTypes.func,
	callBackOnNoMenuLeft: PropTypes.func
};

ShelfTile.defaultProps = {
	//leftX: 200,
	callBackOnLargeBloomStart: () => {console.log("INFO ShelfTile :: please pass a function for callBackOnLargeBloomStart")},
	callBackOnNoMenuLeft: () => {console.log("INFO ShelfTile :: please pass a function for callBackOnNoMenuLeft")}
};

export default ShelfTile
