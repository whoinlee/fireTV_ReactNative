import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';


export default function toControllable(WrappedComponent) {
  return class Controllable extends Component {
    
    static contextTypes = {
      registerControllable: PropTypes.func,
    }

   //  //constructor(props){
   //    //super(props);

   //    this.state = {
   //      isFocused: false,
   //      registered: false,
   //    }
   //    this.context = null;
   //    this._wrappedComponent = null;
   // //}

    state = {
      isFocused: false,
      registered: false,
    }

    context = null;
    
    _wrappedComponent = null;

    _handleFocus = () => {
      const { onFocus } = this.props;

      this.setState({ isFocused: true });

      console.log('INFO Controllable :: _handleFocus');
      if (onFocus) {
        console.log('INFO Controllable :: _handleFocus, onFocus defined');
        onFocus();
      }
    }

    _handleBlur = () => {
      const { onBlur } = this.props;

      this.setState({ isFocused: false });

      console.log('INFO Controllable :: _handleBlur');
      if (onBlur) {
        console.log('INFO Controllable :: _handleBlur, onBlur defined');
        onBlur();
      }
    }

    _handleLeft = () => {
      const { onLeft } = this.props;

      if (onLeft) {
        console.log('INFO Controllable :: _handleLeft, onLeft defined');
        onLeft();
      }
    }

    _handleRight = () => {
      const { onRight } = this.props;

      if (onRight) {
        console.log('INFO Controllable :: _handleRight, onRight defined');
        onRight();
      }
    }

    _handleUp = () => {
      const { onUp } = this.props;

      if (onUp) {
        console.log('INFO Controllable :: _handleUp, onUp defined');
        onUp();
      }
    }

    _handleDown = () => {
      const { onDown } = this.props;

      if (onDown) {
        console.log('INFO Controllable :: _handleDown, onDown defined');
        onDown();
      }
    }

    _handleLayout = (e: Object) => {
      const { layout } = e.nativeEvent;
      if (this.state.registered) {
        return;
      }

      const {
        onPress = () => {},
      } = this.props;

      this.context.registerControllable (
        this._handleFocus,
        this._handleBlur,
        this._handleLeft,
        this._handleRight,
        this._handleUp,
        this._handleDown,
        onPress
      );

      this.setState({ registered: true });
    }

    render() {
      return (
        <View
          onLayout={this._handleLayout}
          //style={[this.props.style, this.state.isFocused ? styles.active : styles.inactive]}
        >
          <WrappedComponent ref={node => (this._wrappedComponent = node)} {...this.props} />
        </View>
      );
    }
  };
}

//const styles = StyleSheet.create({
//   active: {
//     opacity: 1,
//   },
//   inactive: {
//     opacity: .6
//   }
// });
// 
