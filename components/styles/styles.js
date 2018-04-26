'use strict';

import {
	Platform,
	StyleSheet,
} from 'react-native';


const styles = StyleSheet.create({

	container: {
	    flex: 1,
	    justifyContent: 'center',
	    alignItems: 'center',
	    backgroundColor: Platform.isTV ? '#676767': '#F5FCFF',
	},

	welcome: {
	    fontSize: 20,
	    textAlign: 'center',
	    margin: 10,
	    color: Platform.isTV ? '#ffffff': '#333333',
	},

	instructions: {
	    textAlign: 'center',
	    color: Platform.isTV ? '#000000': '#333333',
	    marginBottom: 5,
	},

    // container: {
    //   flex: 1,
    //   backgroundColor: '#000',
    // },

    // header: {
    //   width: '100%',
    //   flex: 1,
    //   alignItems: 'center',
    //   position: 'absolute',
    //   top: 0
    // },

    // headerControls: {
    //   height: '70%',
    //   width: '100%',
    //   position: 'absolute',
    //   bottom: 0,
    // },

    // headerGradient: {
    //   position: 'absolute',
    //   bottom: 40,
    //   height: 124,
    //   width: Dimensions.get('window').width,
    //   resizeMode: Image.resizeMode.stretch,
    // },

    // headerDetails: {
    //   position: 'absolute',
    //   bottom: 80,
    //   marginLeft: 16,
    // },

    // showTitle: {
    //   color: '#F00',  //color: '#FFF'
    //   fontSize: 28,
    //   maxWidth: 250
    // },

    // showSeasonContainer: {
    //   height: 40,
    //   backgroundColor: '#000', //backgroundColor: '#000'
    // },

    // controls: {
    //   position: 'absolute',
    //   bottom: 45,
    //   flex: 1,
    //   flexDirection: 'row',
    //   marginLeft: 16,
    // },

    // showSeason: {
    //   color: '#0f0',  //color: '#FFF',
    //   fontSize: 14,
    //   marginLeft: 16
    // },

    // showListContainer: {
    //   backgroundColor: '#fc0', //'transparent'
    // },

    // showListItem: {
    //   backgroundColor: '#000',
    //   paddingBottom: 16,
    //   paddingLeft: 0,
    //   paddingRight: 0,
    // },

    // showListDetail: {
    //   position: 'absolute',
    //   bottom: 0,
    // },

    // showListGradient: {
    //   position: 'absolute',
    //   bottom: 0,
    //   width: Dimensions.get('window').width,
    //   resizeMode: Image.resizeMode.stretch,
    // },

    // tabBar: {
    //   flex: 1,
    //   flexDirection: 'row',
    //   position: 'absolute',
    //   bottom: 30,
    //   justifyContent: 'space-between',
    //   alignItems: 'center',
    //   width: Dimensions.get('window').width - 34,
    //   marginLeft: 17
    // }

});


module.exports = styles;
