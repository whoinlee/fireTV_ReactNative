import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native';

import config from '../../config';
import keyCodes from '../../keyCodes';
// import styles from '../../styles/styles';


const RATIO                 = config.density;
const STD_DURATION        	= config.stdDuration;
const SHORT_DURATION      	= config.shortDuration;

class ImageButton extends Component {
	constructor(props) {
		super(props)
		// this.state = {
		// 	isSelected: this.props.isSelected
		// }
		this._onClick = this._onClick.bind(this)
	}

	componentWillMount() {

	}

	_onClick = (e) => {
		console.log("INFO ImageButton :: _onClick")
		//this.setState({isSelected: !this.state.isSelected})
		if (this.props.isSelected)
		this.props.onSelect(e)
	}

	render() {
		return (
			<span style={{position:'absolute', top:this.props.top + 'px', left:this.props.left + 'px'}}>
				<img 	src={(this.props.isSelected === true) ? this.props.selectedImageURL : this.props.imageURL}
						alt={this.props.id} 
						onSelect={this.onSelect} />
			</span>
		)
	}//render
}

ImageButton.propTypes = {
	id: PropTypes.string,
	top: PropTypes.number,
	left: PropTypes.number,
	isSelected: PropTypes.bool,
	imageURL: PropTypes.string,
	selectedImageURL: PropTypes.string,
	onSelect: PropTypes.func,
};

ImageButton.defaultProps = {
    onSelect: () => {console.log("INFO ImageButton :: please pass a function for onSelect")}
};

export default ImageButton