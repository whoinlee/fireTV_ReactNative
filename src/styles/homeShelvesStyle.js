'use strict';

import {StyleSheet} from 'react-native';
import config from '../config';


const RATIO            = config.density;
const homeShelvesStyle = StyleSheet.create({

	//* -- HomeShelf ---------- *//
	homeShelfContainer: {
		borderWidth: 1,
    	borderColor: 'pink',
	},

	homeShelfTitleContainer: {
	    color: '#fff',
	    borderWidth: 1,
    	borderColor: 'green',
	},

		shelfTitle: {
		    fontSize: 28/RATIO,
		    fontFamily: 'Helvetica-Light',
		    fontWeight: '100',	/*HelveticaLight*/
		    textAlign: 'left',
		},

	homeShelfTileContainer: {
		borderWidth: 1,
    	borderColor: 'blue',
	}
});


export default homeShelvesStyle;
