import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} from 'react-native';
import styles from './styles/styles';


export default class GlobalNavPane extends Component {
  constructor(props){
    super(props);
    //this.node : any;
    this.getNodeInfo = this.getNodeInfo.bind(this);
  } 

  getNodeInfo(e) {
    console.log('INFO GlobalNavPane :: getNodeInfo, e.eventTypee is ', e.eventType)
  }

  render() {
    return (
      <TouchableNativeFeedback ref={node => this.node = node} onPress={(e) => this.getNodeInfo(e)} >
        <View style={styles.globalNavContainer}>
          
            <Text style={styles.comment}>
              GlobalNavPane-0430-5:52pm
            </Text>
          
        </View>
      </TouchableNativeFeedback>
    );
  }
}

/*
  <TouchableHighlight>
  </TouchableHighlight>

*/