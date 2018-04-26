/**
 * POC for fireTV in React Native
 * https://github.com/whoinlee/fireTV_ReactNative
 * by WhoIN Lee :: whoin.lee@nbcuni.com
 */
import React, { Component } from 'react';
import { 
  TVEventHandler,
  View
} from 'react-native';
import styles from './styles/styles';
import GlobalNavPane from './GlobalNavPane';
import HomeHeroPane from './HomeHeroPane';
import HomeShelvesPane from './HomeShelvesPane';


export default class POCContainer extends Component {
  constructor(props) {
    super(props);
  }

  _tvEventHandler: any;

  componentDidMount() {
    console.log('componentDidMount');
    this._enableTVEventHandler();
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    this._disableTVEventHandler();
  }

  _enableTVEventHandler() {
    this._tvEventHandler = new TVEventHandler();
    this._tvEventHandler.enable(this, function(cmp, evt) {
      if (evt && evt.eventType === 'left') {
        //cmp.doLeft();
        this._doLeft();
      } else if (evt && evt.eventType === 'right') {
        //cmp.doRight();
        this._doRight();
      } else if(evt && evt.eventType === 'up') {
        //cmp.doUp();
        this._doUp();
      } else if(evt && evt.eventType === 'down') {
        //cmp.doDown();
        this._doDown();
      } 
      //else if(evt && evt.eventType === 'playPause') {
        //cmp.doPlayPause();
      //}
    });
  }

  _disableTVEventHandler() {
    if (this._tvEventHandler) {
      this._tvEventHandler.disable();
      delete this._tvEventHandler;
    }
  }

  _doLeft = () => {
    console.log('doLeft');
  }

  _doRight = () => {
    console.log('doRight');
  }

  _doUp = () => {
    console.log('doUp');
  }

  _doDown = () => {
    console.log('doDown');
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