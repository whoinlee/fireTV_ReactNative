/**
 * POC for fireTV in React Native
 * https://github.com/whoinlee/fireTV_ReactNative
 * by WhoIN Lee :: whoin.lee@nbcuni.com
 */
import React, { Component } from 'react';
import { 
  View,
  TouchableWithoutFeedback,
  TVEventHandler,
  // RCTTVView
} from 'react-native';
import styles from './styles/styles';
import GlobalNavPane from './GlobalNavPane';
import HomeHeroPane from './HomeHeroPane';
import HomeShelvesPane from './HomeShelvesPane';


export default class POCContainer extends Component {
  constructor(props) {
    super(props);
    console.log('INFO :: constructor, this.constructor.name? : ' + this.constructor.name);
    this._tvEventHandler = new TVEventHandler();
  }

  componentDidMount() {
    console.log('INFO :: componentDidMount');
    this._enableTVEventHandler();
  }

  componentWillUnmount() {
    console.log('INFO :: componentWillUnmount');
    this._disableTVEventHandler();
  }

  _enableTVEventHandler() {
    //console.log('INFO :: _enableTVEventHandler');
    this._tvEventHandler.enable(this, function(cmp, evt) {
      // console.log('INFO :: _enableTVEventHandler, cmp? : ' + cmp.constructor.name);  //POCContainer
      //select, blur, focus
      console.log('INFO :: _enableTVEventHandler, evt.eventType? : ' + evt.eventType);  
      cmp._doTest()
      if (evt && evt.eventType === 'left') {
        //cmp._doLeft();
        console.log('INFO :: left');
        //this._doLeft()
      } else if (evt && evt.eventType === 'right') {
        console.log('INFO :: right');
        //cmp.doRight();
        //this._doRight();
      } else if(evt && evt.eventType === 'up') {
        console.log('INFO :: up');
        //cmp._doUp();
        //this._doUp();
      } else if(evt && evt.eventType === 'down') {
        console.log('INFO :: down');
        //cmp._doDown();
        //this._doDown();
      } 
      //else if(evt && evt.eventType === 'playPause') {
        //cmp.doPlayPause();
      //}
    });
  }

  _disableTVEventHandler() {
    console.log('INFO :: _disableTVEventHandler');
    if (this._tvEventHandler) {
      this._tvEventHandler.disable();
      delete this._tvEventHandler;
    }
  }

  _doTest = () => {
    console.log('INFO :: _doTest ????');
  }

  _doLeft = () => {
    console.log('INFO :: doLeft ????');
  }

  _doRight = () => {
    console.log('INFO :: doRight ????');
  }

  _doUp = () => {
    console.log('INFO :: doUp');
  }

  _doDown = () => {
    console.log('INFO :: doDown');
  }

  _doSelect = () => {
    console.log('INFO :: doSelect');
  }

  render() {
    return (
        <View style={styles.pocContainer}>
            <GlobalNavPane />
            <HomeHeroPane />
            <HomeShelvesPane />
        </View>
    );
  }
}