import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
} from 'react-native';

import { ProfileWithData } from './components/ProfileWithData';

export default class ProfileScreen extends React.Component {
  static route = {
    navigationBar: {
      title: "Profile",
      backgroundColor: "rgba(255, 255, 255, 0.1)"
    }
  }

  state = {
    currentUser: false,
    storageSynced: false
  }

  componentWillMount() {
    this._checkLoginStateAsync()
  }

  async _checkLoginStateAsync() {
    try {
      const currentUser = await AsyncStorage.getItem('@arena:CurrentUser');
      this.setState({ currentUser: JSON.parse(currentUser), storageSynced: true })
    } catch (e) {
      console.warn('Error fetching currentUser from localStorage', e)
      this.setState({ currentUser: false, storageSynced: true });
    } 
  }

  render() {
    if (this.state.storageSynced) {
      return (
        <View style={styles.container}>
          <ProfileWithData userId={this.state.currentUser.slug} />
        </View>
      );
    } else {
      return (
        <View />
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});