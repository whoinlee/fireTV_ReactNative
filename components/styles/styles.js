'use strict';

import {
	Platform,
	StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
	//-- POCContainer
	pocContainer: {
	    flex: 1,
	    justifyContent: 'center',
	    alignItems: 'center',
	    // backgroundColor: Platform.isTV ? '#676767': '#F5FCFF',
	    backgroundColor: '#676767',
	    // width: 1920,
	    // height: 1080,
	},
	comment: {
	    fontSize: 20,
	    textAlign: 'center',
	    margin: 10,
	    color: Platform.isTV ? '#fff': '#333',
	},
	// instructions: {
	//     textAlign: 'center',
	//     color: Platform.isTV ? '#000000': '#333333',
	//     marginBottom: 5,
	// },

	
	//-- GlobalNavPane
	globalNavContainer: {
	    flex: .25,
	    justifyContent: 'center',
	    alignItems: 'center',
	    backgroundColor: '#000',
	    position: 'absolute',
	    top: 0,
	    width: '100%',
	    // height: 100,
	    opacity: 1,
	    borderWidth: 1,
	    borderColor: '#ff0000',
	},


	//-- HomeHeroPane
	homeHeroContainer: {
	    flex: 1,
	    justifyContent: 'center',
	    alignItems: 'center',
	    backgroundColor: '#333',
	    position: 'absolute',
	    top: 165,
	    width: '100%',
	    // height: 606,
	    opacity: .6,
    	borderWidth: 1,
    	borderColor: '#ff0000',
	},


	//-- HomeShelvesPane
	homeShelvesContainer: {
	    flex: 1,
	    justifyContent: 'center',
	    alignItems: 'center',
	    backgroundColor: '#000',
	    position: 'absolute',
	    width: '100%',
	    opacity: .6,
	    overflow: 'hidden',
	    borderWidth: 1,
    	borderColor: '#ff0000',
	},
});


export default styles;
