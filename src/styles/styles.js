'use strict';

import {
	Platform,
	StyleSheet,
	PixelRatio,
} from 'react-native';
import config from '../config/config';


const RATIO = PixelRatio.get();
const styles = StyleSheet.create({
	//-- comment, for testing
	comment: {
	    fontSize: 20,
	    textAlign: 'center',
	    margin: 10,
	    color: Platform.isTV ? '#fff': '#333',
	},


	//-- POCContainer
	pocContainer: {
	    backgroundColor: Platform.isTV ? '#676767': '#F5FCFF',
	    width: '100%',
	    height: '100%'
	},

	
	//-- GlobalNavPane
	globalNavContainer: {
	    backgroundColor: '#444',
	    position: 'absolute',
	    width: '100%',
	    height: config.initGlobalNavH/RATIO,
	    top: config.initGlobalNavY, 
	    borderWidth: 1,
	    borderColor: '#000000',
	},


	//-- HomeHeroPane
	homeHeroContainer: {
		justifyContent: 'center',
	    alignItems: 'center',
	    backgroundColor: '#444',
	    position: 'absolute',
	    width: '100%',
	  	height: config.initHomeHeroH/RATIO,
	    top: config.initHomeHeroY/RATIO, 
    	borderWidth: 1,
    	borderColor: '#000000',
	},


	//-- HomeShelvesPane
	homeShelvesContainer: {
	    backgroundColor: '#444',
	    position: 'absolute',
	    width: '100%',
	    top: config.initHomeShelvesY/RATIO, 
	    overflow: 'hidden',
	    borderWidth: 1,
    	borderColor: '#000000',
	},
});


export default styles;
