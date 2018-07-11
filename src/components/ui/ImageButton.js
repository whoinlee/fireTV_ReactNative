import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
  Image,
  Text,
  // TouchableNativeFeedback,
  View
} from 'react-native';

import config from '../../config';
import keyCodes from '../../keyCodes';


const RATIO                 = config.density;
const STD_DURATION        	= config.stdDuration;
const SHORT_DURATION      	= config.shortDuration;

export default class ImageButton extends Component {
	constructor(props) {
		super(props)
	}

	doSelect = () => {
		console.log("INFO ImageButton :: doSelect, this.props.kind ?? " + this.props.kind)
		if (this.props.isSelected) this.props.onSelect()
	}//doSelect

	render() {
		// console.log("INFO ImageButton :: render, this.props.imageURL ? " + this.props.imageURL)
		const iconSource = this.props.isSelected ? this.props.selectedImageURL : this.props.imageURL
		return (
			<View style={{
					position:'absolute', 
					top:this.props.top, 
					left:this.props.left,
					}}>
				<Image 	style={ {width:this.props.iconWidth, height:this.props.iconHeight} }
						source={ iconSource } />
			</View>
		)
	}//render
};


ImageButton.propTypes = {
	top: PropTypes.number,
	left: PropTypes.number,
	kind: PropTypes.string,
	isSelected: PropTypes.bool,
	imageURL: PropTypes.number,
	selectedImageURL: PropTypes.number,
	iconWidth: PropTypes.number,
	iconHeight: PropTypes.number,
	onSelect: PropTypes.func.isRequired,
};

ImageButton.defaultProps = {
    onSelect: () => {console.log("INFO ImageButton :: please pass a function for onSelect")}
};
