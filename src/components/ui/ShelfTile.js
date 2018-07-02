import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
	Animated,
	Easing,
	Image,
	StyleSheet,
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
const CONTENT_X				= config.homeShelves.contentX/RATIO; 
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
			tileKind: TILE_KIND_OBJ.ORIGINAL,
			imageScale: new Animated.Value(1),
			overlayOpacity: new Animated.Value(0),
			// isOverlayVisible: false,
		}

		this.menus= []
		this.totalMenus = 3

		this.selectedMenuIndex = -1					//-- reset, no menu selected
		this.prevMenu = null
		this.currMenu = null
		this.nextMenu = null

		// this.isOverlayVisible = false
		this.bloomToLargeTimerID = null				//-- TODO: here??

		this._showOverlay = this._showOverlay.bind(this)
	}

	componentDidMount() {
	}//componentWillMount

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

	doSelect = () => {
		console.log("INFO ShelfTile :: doSelect, tile " + this.props.index)
	}//doSelect

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
		console.log("INFO ShelfTile :: doRight, to the menu in the right, this.state.selectedMenuIndex? " + this.state.selectedMenuIndex)
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

	backToOrg = () => {
		console.log("INFO ShelfTile :: backToOrg, index: " + this.props.index)

		this._updateKind(TILE_KIND_OBJ.ORIGINAL)
		this._changeScale(SCALE_ARR[TILE_KIND_OBJ.ORIGINAL])
		this._hideOverlay()
	}//backToOrg

	toFocused = (pDuration=STD_DURATION) => {
		// console.log("INFO ShelfTile :: toFocused, index: " + this.props.index)
		this._clearBloomTimer()
		this._updateKind(TILE_KIND_OBJ.FOCUSED)
		this._changeScale(SCALE_ARR[TILE_KIND_OBJ.FOCUSED], pDuration)
		this._hideOverlay()
		//this._changeScale(SCALE_ARR[TILE_KIND_OBJ.LG_BLOOMED])	//--for testing
	}//toFocused

	toExpanded = (pDuration=STD_DURATION) => {
		// console.log("INFO ShelfTile :: toExpanded, index: " + this.props.index)
		this._updateKind(TILE_KIND_OBJ.EXPANDED)
		this._changeScale(SCALE_ARR[TILE_KIND_OBJ.EXPANDED], pDuration)
		this._hideOverlay()
	}//toExpanded

	_toMedBloomed = (targetX, noScale=false, pDuration=STD_DURATION) => {
		console.log("INFO ShelfTile :: _toMedBloomed")
		this._hideOverlay()
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
		this._hideOverlay()
		// this.killToLargeBloom()
		// this.updateState(TILE_KIND_OBJ.LG_BLOOMED)
		// this.props.callBackOnLargeBloomStart()
		// TL.to(this.imageContainer, stdDuration, {css: {scale: toLgBloomedScale}, onComplete: this.showBloomedContent()})
	}//_toLargeBloomed

	_updateKind = (pKind) => {
		if (pKind === this.state.tileKind) return
		// console.log("INFO ShelfTile :: _updateKind, index: " + this.props.index + ", tileKind: " + pKind)
		this._hideOverlay()
		this.selectedMenuIndex = (pKind === TILE_KIND_OBJ.LG_BLOOMED)? 1 : -1
		this.setState({ tileKind: pKind })
		// this.isOverlayVisible = (pKind === TILE_KIND_OBJ.FOCUSED)? true : false
		// this.setState({ tileKind: pKind, isOverlayVisible: false })
	}//_updateState

	_changeScale = (targetValue, pDuration=STD_DURATION) => {
	    console.log("INFO ShelfTile :: _changeScale, to " + targetValue)
	    // console.log("INFO ShelfTile :: pDuration, to " + pDuration)

	    // this.isOverlayVisible = false
	    Animated.timing(this.state.imageScale).stop()
	    Animated.timing(
	      this.state.imageScale, 
	      {
	        toValue: targetValue,
	        duration: pDuration,
	        easing: Easing.out(Easing.quad),
	      }
	    ).start(this._showOverlay)
	}//_changeScale

	_showOverlay = () => {
		if (this.state.tileKind === TILE_KIND_OBJ.FOCUSED) {
			// console.log("INFO ShelfTile :: _showOverlay ever???????????????????? pDuration is " + pDuration)	// TODO:: how to pass a variable??
			// console.log("INFO ShelfTile :: _showOverlay ever???????????????????? STD_DURATION is " + STD_DURATION)
			// this.isOverlayVisible = true
			Animated.timing(this.state.overlayOpacity).stop()
		    Animated.timing(
		      this.state.overlayOpacity, 
		      {
		        toValue: 1,
		        duration: STD_DURATION + 100,	//hack
		        easing: Easing.out(Easing.quad),
		      }
		    ).start()
		}
	}

	_hideOverlay = () => {
		// this.isOverlayVisible = false
		Animated.timing(
	      this.state.overlayOpacity, 
	      {
	        toValue: 0,
	        duration: 0,
	      }
	    ).start()
	}

	// **
	_clearBloomTimer = () => {
		console.log("INFO ShelfTile :: _clearBloomTimer")
		if (this.bloomToLargeTimerID) clearTimeout(this.bloomToLargeTimerID) 
	}//_clearBloomTimer

	_waitToLargeBloom = () => {
		console.log("INFO ShelfTile :: _waitToLargeBloom")
		this._clearBloomTimer()
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

	_onInfoButtonClicked = (e) => {
		console.log("INFO ShelfTile :: _onInfoButtonClicked")
	}//_onInfoButtonClicked

	_onPlayButtonClicked = (e) => {
		console.log("INFO ShelfTile :: _onPlayButtonClicked")
	}//_onPlayButtonClicked

	_onAddToButtonClicked = (e) => {
		console.log("INFO ShelfTile :: _onAddToButtonClicked")
	}//_onAddToButtonClicked

	_find_dimesions = (layout) => {
	    const {width, height} = layout
	    // console.warn(height);
	    console.log('INFO ShelfTile :: _find_dimensions (testing), width is ' + width)
	    // console.log('INFO HomeShelf :: _find_dimensions (testing), height is ' + height)
	 }//_find_dimesions

	_renderContent = () => {
		//console.log("INFO ShelfTile :: _renderContent, this.isOverlayVisible is :: " + this.isOverlayVisible)
		const { tileKind, overlayOpacity } = this.state
		const leftX0 = TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][0]/2			//-- leftEnd location (bc, image is transformed to TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][0]/2 xLocation)
		const rightX0 = 10/RATIO
		const textTopMargin0 = 4/RATIO
		const offsetY0 = (TILE_SIZE_ARR[TILE_KIND_OBJ.FOCUSED][1] - TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][1])/2
		//-- (imageSizeYIncrease)/2 for expandedImage
		const expandedIDY = TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][1] + (TILE_SIZE_ARR[TILE_KIND_OBJ.EXPANDED][1] - TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][1])/2 + textTopMargin0
		const focusedTopY = -(TILE_SIZE_ARR[TILE_KIND_OBJ.FOCUSED][1] - TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][1])/2
		switch (tileKind) {
			case TILE_KIND_OBJ.EXPANDED:
				return (
					<View 	style={{
								position: 'absolute',
								left: leftX0,
								top: expandedIDY,
								width: TILE_SIZE_ARR[TILE_KIND_OBJ.EXPANDED][0],
								// borderWidth: .5, borderColor: 'blue',
							}} >
						<Text style={ shelfTileStyles.expandedEpisodeID }>
							{this.props.episodeID}
						</Text>
					</View>
				)
				// {this.props.episodeID}  <span className="baseEpisodeID">{this.props.showTitle}</span>
			case TILE_KIND_OBJ.FOCUSED:
				const leftX1 = leftX0 + CONTENT_X
				return (
						<Animated.View 	style={{
									position: 'absolute',
									left: leftX0,
									top: focusedTopY,
									width: TILE_SIZE_ARR[TILE_KIND_OBJ.FOCUSED][0],
									height: TILE_SIZE_ARR[TILE_KIND_OBJ.FOCUSED][1],
									zIndex: 1000,
									opacity: overlayOpacity,
									backgroundColor: 'rgba(0, 0, 0, .3)',
									// borderWidth: .5, borderColor: 'white',
								}} >
							<Text style={ {
										position: 'absolute',
										top: -focusedTopY + expandedIDY - (28/RATIO*2),
										... StyleSheet.flatten(shelfTileStyles.focusedShowTitle),
										width: TILE_SIZE_ARR[TILE_KIND_OBJ.FOCUSED][0] - (CONTENT_X + rightX0),
										left: CONTENT_X,
										//borderWidth: .5, borderColor: 'blue',
										} }>
								{this.props.showTitle}
							</Text>
							<Text style={ {
										position: 'absolute',
										top: -focusedTopY + expandedIDY - 28/RATIO,
										... StyleSheet.flatten(shelfTileStyles.focusedEpisodeTitle),
										width: TILE_SIZE_ARR[TILE_KIND_OBJ.FOCUSED][0] - (CONTENT_X + rightX0),
										left: CONTENT_X,
										//borderWidth: .5, borderColor: 'blue',
										} }>
								{this.props.episodeTitle}
							</Text>
							<Text style={ {
										... StyleSheet.flatten(shelfTileStyles.focusedEpisodeID),
										position: 'absolute',
										top: -focusedTopY + expandedIDY,
										left: CONTENT_X,
										width: TILE_SIZE_ARR[TILE_KIND_OBJ.FOCUSED][0] - (CONTENT_X + rightX0),
										// borderWidth: .5, borderColor: 'blue',
										} }>
								{this.props.episodeID}
							</Text>
						</Animated.View>
				)
			case TILE_KIND_OBJ.LG_BLOOMED:
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
			break
		    case TILE_KIND_OBJ.MED_BLOOMED:
		//     	console.log("ever????????????")
		//     	//return null
		    	break
		    default:
		}//switch
	}//_renderContent

	render() {
		// console.log("INFO ShelfTile :: render, this.props.index ? " + this.props.index)
		const { imageScale } = this.state
		//-- bring up the selected tile to front
		const pZindex = (this.state.tileKind === TILE_KIND_OBJ.ORIGINAL) ? this.props.index : 100
		return (
			<View 	style={{	
						left: -TILE_SIZE_ARR[TILE_KIND_OBJ.ORIGINAL][0]/2,
						width: '100%',
						// borderColor: 'black', borderWidth: .5		/* for testing */
					}} >
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
							// borderColor: 'black', borderWidth: .5
						}} />
				{this._renderContent()}
			</View>
		)
	}//render
}


const shelfTileStyles = StyleSheet.create({
	// //-- "title" ----------------------//
	expandedEpisodeID: {
		fontFamily: 'Helvetica-Bold',
		fontWeight: '700',
	    fontSize: 24/RATIO,
	    textAlign: 'left',
	    color: '#fff',
	    margin: 0,
	},

	focusedShowTitle: {
		fontFamily: 'Helvetica',
		fontWeight: '400',
	    fontSize: 24/RATIO,
	    textAlign: 'left',
	    color: '#fff',
	    margin: 0,
	},

	focusedEpisodeTitle: {
		fontFamily: 'Helvetica-Bold',
		fontWeight: '700',
	    fontSize: 24/RATIO,
	    textAlign: 'left',
	    color: '#fff',
	    margin: 0,
	},

	focusedEpisodeID: {
		fontFamily: 'Helvetica',
		fontWeight: '400',
	    fontSize: 24/RATIO,
	    textAlign: 'left',
	    color: '#fff',
	    margin: 0,
	},
	// homeShelfTitleContainer: {
	// 	position: 'absolute',
	// 	left: INIT_X,
	// 	top: BASE_TITLE_TOP,
	// },

	// shelfTitleBase: {
	// 	fontSize: 28/RATIO,
	//     fontFamily: 'Helvetica-Light',
	//     fontWeight: '100',	/*HelveticaLight*/
	//     textAlign: 'left',
	//     color: '#fff',
	// },

	// shelfTitleFocused: {
	// 	fontSize: 40/RATIO,
	//     fontFamily: 'Helvetica-Light',
	//     fontWeight: '100',	/*HelveticaLight*/
	//     textAlign: 'left',
	//     color: '#fff',
	// },
	// //---------------------------------//


	// //-- "tile" ----------------------//
	// homeShelfTilesContainer: {
	// 	position: 'absolute',
	// 	top: TILE_TOP,
 //    	flex: 1,
	// },
	// //---------------------------------//
});

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
}

ShelfTile.defaultProps = {
	// callBackOnLargeBloomStart: () => {console.log("INFO ShelfTile :: please pass a function for callBackOnLargeBloomStart")},
	// callBackOnNoMenuLeft: () => {console.log("INFO ShelfTile :: please pass a function for callBackOnNoMenuLeft")},

	// onFocus: () => {console.log("INFO ShelfTile :: please pass a function for onFocus")},
 	// onBlur: () => {console.log("INFO ShelfTile :: please pass a function for onBlur")},
}