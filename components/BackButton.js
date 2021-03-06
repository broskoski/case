import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withNavigation } from '@expo/ex-navigation';
import { Ionicons } from '@expo/vector-icons';

@withNavigation
export default class BackButton extends React.Component {
  render() {
    if (this.props.navigator.getCurrentIndex() > 0){
      return (
        <View onPress={this._goBack} style={styles.container}>
          <Ionicons 
            name="ios-arrow-back" 
            size={24} 
            color="black" 
            onPress={this._goBack} 
            style={{paddingLeft: 20, paddingRight: 20}}
          />
        </View>
      )
    }
    return (<View/>);
  }

  _goBack = () => {
    if (this.props.navigator.getCurrentIndex() > 0) {
      this.props.navigator.pop();
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});