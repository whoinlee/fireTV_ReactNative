import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} from 'react-native';
import styles from './styles/styles';

// type Props = {};
export default class HomeShelvesPane extends Component {
  constructor(props){
    super(props);
    //let node;
    this.getNodeInfo = this.getNodeInfo.bind(this);
  } 

  getNodeInfo(e) {
    console.log('INFO HomeShelvesPane :: getNodeInfo, e.eventType is ', e.eventType)
  }

  render() {
    return (
      <TouchableNativeFeedback ref={node => this.node = node} onPress={(e) => this.getNodeInfo(e)} >
        <View style={styles.homeShelvesContainer}>

            <Text style={styles.comment}>
              HomeShelvesPane
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