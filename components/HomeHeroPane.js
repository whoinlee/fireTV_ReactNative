import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} from 'react-native';
import styles from './styles/styles';


export default class HomeHeroPane extends Component {
  constructor(props){
    super(props);
    //let node;
    this.getNodeInfo = this.getNodeInfo.bind(this);
  } 

  getNodeInfo(e) {
    console.log('INFO HomeHeroPane :: getNodeInfo, e.eventType is ', e.eventType)
  }

  render() {
    return (
      <TouchableNativeFeedback ref={node => this.node = node} onPress={(e) => this.getNodeInfo(e)} >
        <View style={styles.homeHeroContainer}>

            <Text style={styles.comment}>
              HomeHeroPane
            </Text>

        </View>
      </TouchableNativeFeedback>
    );
  }
}

/*
  <TouchableHighlight>
  </TouchableHighlight>
  <TouchableNativeFeedback onPress={(e) => this.getNodeInfo(e)} >

*/