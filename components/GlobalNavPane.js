import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  View
} from 'react-native';
import styles from './styles/styles';


export default class GlobalNavPane extends Component {
  constructor(props){
    super(props);
    //this.node : any;
    this.getNodeInfo = this.getNodeInfo.bind(this);
    this.today = new Date();
  } 

  getNodeInfo(e) {
    console.log('INFO GlobalNavPane :: onPress - getNodeInfo, e.eventType is ', e.eventType)
  }

  render() {
    return (
      <TouchableNativeFeedback 
        ref={node => this.node = node} 
        //onPress={(e) => this.getNodeInfo(e)} 
        //onTouchableHandleActivePressIn={console.log('INFO GlobalNavPane :: test pressIn')} 
        //onTouchableHandleActivePressOut={console.log('INFO GlobalNavPane :: test pressOut')} 
        >
        <View style={styles.globalNavContainer}>
          
            <Text style={styles.comment}>
              GlobalNavPane
            </Text>
          
        </View>
      </TouchableNativeFeedback>
    );
  }
}

/*
 // TouchableWithoutFeedback,
 {'GlobalNavPane - ' + "0" + (this.today.getMonth()+1) + " : " + (this.today.getDate()) + " : " + (this.today.getHours())}
*/