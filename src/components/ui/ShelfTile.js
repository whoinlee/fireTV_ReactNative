import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
	Animated,
	Easing,
	Image,
  	Text,
  	// TouchableWithoutFeedback,
  	View
} from 'react-native';
import KeyEvent from 'react-native-keyevent';
import ImageButton from './ImageButton';

import config from '../../config';
import keyCodes from '../../keyCodes';
import styles from '../../styles/styles';


const RATIO                 = config.density;
const STD_DURATION        	= config.stdDuration;
const SHORT_DURATION      	= config.shortDuration;
const WAIT_TO_LARGE_BLOOM_DURATION	= config.waitToLargeBloomDuration/1000;	//-- in seconds
const ASSET_URL				= '../../assets/';


/* ------------------------------------------ */
/* ShelfTile specific contants                */
/* ------------------------------------------ */
const TILE_KIND_OBJ 		= {
  ORIGINAL: 0,							//-- base row
  EXPANDED: 1,							//-- focused row, unfocused tile
  FOCUSED: 2,							//-- focused row, focused tile
  MED_BLOOMED: 3,						//-- bloomed row, unfocused tile
  LG_BLOOMED: 4							//-- bloomed row, focused tile
};
const TILE_SIZE_ARR 		= [
  [config.homeShelves.baseTileW/RATIO, config.homeShelves.baseTileH/RATIO],					//-- original tile size: 0.303 of the largeBloomed
  [config.homeShelves.focusedBaseTileW/RATIO, config.homeShelves.focusedBaseTileH/RATIO],	//-- expanded tile size: 0.355 (375x211) of the largeBloomed
  [config.homeShelves.focusedTileW/RATIO, config.homeShelves.focusedTileH/RATIO],			//-- focused tile size:  0.559 of the largeBloomed
  [config.homeShelves.bloomedBaseTileW/RATIO, config.homeShelves.bloomedBaseTileH/RATIO],	//-- medBloomed tile size: 0.741 of the largeBloomed
  [config.homeShelves.bloomedTileW/RATIO, config.homeShelves.bloomedTileH/RATIO]			//-- largeBloomed tile size
];
const ORIGINAL_SCALE		= 1
const EXPANDED_SCALE 		= Math.round(TILE_SIZE_ARR[TILE_KIND_OBJ.EXPANDED][0]*100/TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][0])/100;		//1.17
const FOCUSED_SCALE 		= Math.round(TILE_SIZE_ARR[TILE_KIND_OBJ.FOCUSED][0]*100/TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][0])/100;			//1.84
const MED_BLOOMED_SCALE 	= Math.round(TILE_SIZE_ARR[TILE_KIND_OBJ.MED_BLOOMED][0]*100/TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][0])/100;		//2.44
const LG_BLOOMED_SCALE 		= Math.round(TILE_SIZE_ARR[TILE_KIND_OBJ.LG_BLOOMED][0]*100/TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][0])/100;		//3.30
const SCALE_ARR				= [ORIGINAL_SCALE, EXPANDED_SCALE, FOCUSED_SCALE, MED_BLOOMED_SCALE, LG_BLOOMED_SCALE];
//
const infoIconPath = '../../assets/images/icons/infoIcon.png';
const playIconPath = '../../assets/images/icons/playIcon.png';
const addToIconPath = '../../assets/images/icons/addToIcon.png';
const selectedInfoIconPath = '../../assets/images/icons/infoIconSelected.png';
const selectedPlayIconPath = '../../assets/images/icons/playIconSelected.png';
const selectedAddToIconPath = '../../assets/images/icons/addToIconSelected.png';


export default class ShelfTile extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedMenuIndex: 1,				//TODO: check, need to be here?
			tileKind: TILE_KIND_OBJ.ORIGINAL,
			imageScale: new Animated.Value(1),  
		}

		this.menus= []							
		this.selectedMenuIndex = 1				//-- reset, CHECK
		this.prevMenu = null
		this.currMenu = null
		this.nextMenu = null

		this.bloomToLargeTimerID = null
		// this.isFocused = false
		// this.isBloomed = false
		//this.tileKind = TILE_KIND_OBJ.ORIGINAL 	//TODO: check, need?
		
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

	doLeft = () => {
		console.log("INFO ShelfTile :: doLeft, to the menu in the left, this.state.selectedMenuIndex? " + this.state.selectedMenuIndex)
		// if (this.state.tileKind !== TILE_KIND_OBJ.LG_BLOOMED) return
		// if (this.state.selectedMenuIndex !== 0) {
		// 	this.setState({selectedMenuIndex: this.state.selectedMenuIndex - 1 })
		// 	console.log("INFO ShelfTile :: doLeft, after setState, this.state.selectedMenuIndex? " + this.state.selectedMenuIndex)
		// } else {
		// 	console.log("INFO ShelfTile :: doLeft, calling callBackOnNoMenuLeft")
		// 	this.props.callBackOnNoMenuLeft("left")
		// }
	}//doLeft

	doRight = () => {
		console.log("INFO ShelfTile :: doRight, to the menu in the right")
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
	}//doRight

	doSelect = () => {
		console.log("INFO ShelfTile :: doSelect, tile " + this.props.index)
	}//doSelect

	onFocus = () => {
		console.log("INFO ShelfTile :: onFocus, tile " + this.props.index)
      	this.toFocused()

      	const { onFocus } = this.props;
      	if (onFocus) {
        	console.log('INFO ShelfTile :: onFocus calling back from ShelfTile');
        	onFocus();
      	}
	}//onFocus

	onBlur = () => {
		console.log("INFO ShelfTile :: onBlur, shelf", this.props.index)
	}//onBlur

	backToOrg = () => {
		console.log("INFO ShelfTile :: backToOrg, index: " + this.props.index)

		this._updateKind(TILE_KIND_OBJ.ORIGINAL)
		this._changeScale(SCALE_ARR[TILE_KIND_OBJ.ORIGINAL])
	}//backToOrg

	toFocused = (pDuration=STD_DURATION) => {
		console.log("INFO ShelfTile :: toFocused, index: " + this.props.index)

		this._clearBloomTimer()
		this._updateKind(TILE_KIND_OBJ.FOCUSED)
		this._changeScale(SCALE_ARR[TILE_KIND_OBJ.FOCUSED], pDuration)
		//this._changeScale(SCALE_ARR[TILE_KIND_OBJ.LG_BLOOMED])	//--for testing
	}//toFocused

	// toExpanded = (noScale=false, pDuration=STD_DURATION) => {
	toExpanded = (pDuration=STD_DURATION) => {
		console.log("INFO ShelfTile :: toExpanded, index: " + this.props.index)
		
		this._updateKind(TILE_KIND_OBJ.EXPANDED)
		this._changeScale(SCALE_ARR[TILE_KIND_OBJ.EXPANDED], pDuration)
		// if (!noScale) {
			// this._changeScale(SCALE_ARR[TILE_KIND_OBJ.EXPANDED], pDuration)
		// } 
	}//toExpanded

	_toMedBloomed = (targetX, noScale=false, pDuration=STD_DURATION) => {
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

	_updateKind = (pKind) => {
		console.log("INFO ShelfTile :: _updateKind, index: " + this.props.index + ", tileKind: " + pKind)
		let newSelectedMenuIndex
		if (pKind === TILE_KIND_OBJ.LG_BLOOMED) {
			newSelectedMenuIndex = 1	//playMenu
		} else {
			newSelectedMenuIndex = -1	//noMenu
		}

		//-- TODO: update state variables? or class variables?, need?
		this.setState({tileKind: pKind, selectedMenuIndex: newSelectedMenuIndex})
	}//_updateState

	_changeScale = (targetValue, pDuration=STD_DURATION) => {
	    console.log("INFO ShelfTile :: _changeScale, to " + targetValue)
	    Animated.timing(
	      this.state.imageScale, 
	      {
	        toValue: targetValue,
	        duration: pDuration,
	        easing: Easing.out(Easing.quad),
	      }
	    ).start();
	}//_changeScale

	// **
	_clearBloomTimer = () => {
		console.log("INFO ShelfTile :: _clearBloomTimer")
		if (this.bloomToLargeTimerID) clearTimeout(this.bloomToLargeTimerID) 
	}//_clearBloomTimer

	_waitToLargeBloom = () => {
		console.log("INFO ShelfTile :: _waitToLargeBloom")
		this._clearBloomTimer()
		//this._killToLargeBloom()
		this.bloomToLargeTimerID = setTimeout(() => this._toLargeBloomed(), WAIT_TO_LARGE_BLOOM_DURATION*1000)
	}//_waitToLargeBloom

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

	// fadeInAt = (targetX, pDelay=0, pDuration=stdDuration) => {
	// 	TL.to(this.containerDiv, 0, {opacity: 0, left: targetX+'px', delay:pDelay})	//CHECK
	// 	TL.to(this.containerDiv, pDuration, {opacity: 1, delay:pDelay+.1})
	// }//fadeInAt

	// onBloom = () => {

	// }

	// onMedBloom

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
	}//_renderContent

	render() {
		// console.log("INFO ShelfTile :: render, this.props.index ? " + this.props.index)
		const { imageScale } = this.state
		//-- bring up the selected tile to front
		const pZindex = (this.state.tileKind === TILE_KIND_OBJ.ORIGINAL) ? this.props.index : 1000
		return (
			<View style={{	
							left: -TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][0]/2,
							//-- for testing
							//backgroundColor: pColor, 
							// borderColor: 'black', borderWidth: .5		/* for testing */
						}}	>
				<Animated.Image 	
						source={this.props.imageURL} 
						style={{
							transform: [
								{ scale: imageScale },
								{ translateX: TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][0]/2 },
								{ translateY: 0 }
							],
							width: TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][0], 
							height: TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][1],
							resizeMode: Image.resizeMode.cover,
							zIndex: pZindex,
						}} 
				/>
			</View>
		)
	}//render
}


ShelfTile.propTypes = {
	index:  PropTypes.number,
	homeShelfIndex: PropTypes.number,	//TODO: check, need?
	showTitle: PropTypes.string,
	episodeTitle: PropTypes.string,
	episodeID: PropTypes.string,
	episodeDesc: PropTypes.string,
	imageURL: PropTypes.number,	/*	number!!!	*/

	// callBackOnLargeBloomStart: PropTypes.func,
	// callBackOnNoMenuLeft: PropTypes.func,

 	// onFocus : PropTypes.func,
 	// onBlur : PropTypes.func,
}

ShelfTile.defaultProps = {
	// callBackOnLargeBloomStart: () => {console.log("INFO ShelfTile :: please pass a function for callBackOnLargeBloomStart")},
	// callBackOnNoMenuLeft: () => {console.log("INFO ShelfTile :: please pass a function for callBackOnNoMenuLeft")},

	// onFocus: () => {console.log("INFO ShelfTile :: please pass a function for onFocus")},
 	// onBlur: () => {console.log("INFO ShelfTile :: please pass a function for onBlur")},
}