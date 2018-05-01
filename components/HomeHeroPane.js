import React, { Component } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
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
      <TouchableWithoutFeedback ref={node => this.node = node} onPress={(e) => this.getNodeInfo(e)} >
        <View style={styles.homeHeroContainer}>

            <Text style={styles.comment}>
              HomeHeroPane
            </Text>

        </View>
      </TouchableWithoutFeedback>
    );
  }
}