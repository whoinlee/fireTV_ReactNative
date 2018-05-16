'use strict';

import {Platform, StyleSheet} from 'react-native';
import config from '../config';


const RATIO = config.density;
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
	    height: '100%',
	},

	//-- GlobalNavPane
	globalNavContainer: {
	    backgroundColor: '#444',
	    position: 'relative',	/* 'absolute' */
	    width: '100%',
	    height: config.initGlobalNavH/RATIO,
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
    	borderWidth: 1,
    	borderColor: '#000000',
	},

	//-- HomeShelvesPane
	homeShelvesContainer: {
	    backgroundColor: '#676767',
	    position: 'absolute',
	    width: '100%',
	    height: '100%',
	    //-- for testing --//
	    // borderWidth: 1,
    	// borderColor: '#000000',
    	//-----------------//
	},
});


export default styles;
