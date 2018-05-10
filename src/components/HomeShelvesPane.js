import React, { Component } from 'react';
import {
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native';
import styles from '../styles/styles';

// type Props = {};
export default class HomeShelvesPane extends Component {
  constructor(props){
    super(props);
    //let node;
    this.getNodeInfo = this.getNodeInfo.bind(this);
  } 

  getNodeInfo(e) {
    console.log('INFO HomeShelvesPane :: getNodeInfo, e.eventType is ', e.eventType)
    //console.log('INFO HomeShelvesPane :: getNodeInfo, node is ', this.node)
  }

  render() {
    return (
      <TouchableNativeFeedback 
            ref={node => this.node = node} 
            //onPress={(e) => this.getNodeInfo(e)} 
            onTouchableHandleActivePressIn={console.log('INFO HomeShelvesPane :: test pressIn')} 
            onTouchableHandleActivePressOut={console.log('INFO HomeShelvesPane :: test pressOut')} 
            >
        <View>
            <Text style={styles.comment}>
              HomeShelvesPane
            </Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

//<View style={styles.homeShelvesContainer}>
//