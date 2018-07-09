import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
  
  Image,
  Text,
  TouchableNativeFeedback,
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
		// this.state = {
		// 	isSelected: this.props.isSelected
		// }
		// this._onClick = this._onClick.bind(this)
	}

	componentWillMount() {

	}

	doSelect = () => {
		console.log("INFO ImageButton :: doSelect")

		if (this.props.isSelected)
		this.props.onSelect()
	}

	_onClick = (e) => {
		console.log("INFO ImageButton :: _onClick")
		//this.setState({isSelected: !this.state.isSelected})
		if (this.props.isSelected)
		this.props.onSelect(e)
	}

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
						source={ iconSource } 
						/>
			</View>
		)
	}//render
}

/*
style={{position:'absolute', top:this.props.top + 'px', left:this.props.left + 'px'}}
<Image source={ (this.props.isSelected === true) ? this.props.selectedImageURL : this.props.imageURL } />
*/

ImageButton.propTypes = {
	id: PropTypes.string,
	top: PropTypes.number,
	left: PropTypes.number,
	isSelected: PropTypes.bool,
	imageURL: PropTypes.number,
	iconWidth: PropTypes.number,
	iconHeight: PropTypes.number,
	selectedImageURL: PropTypes.number,
	onSelect: PropTypes.func.isRequired,
};

ImageButton.defaultProps = {
    onSelect: () => {console.log("INFO ImageButton :: please pass a function for onSelect")}
};