import Exponent from 'exponent';
import React from 'react';
import {
  AppRegistry,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  NavigationContext,
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';
import {
  FontAwesome,
} from '@exponent/vector-icons';

import { ApolloProvider } from 'react-apollo';
import Store from './state/Store';
import Client from './state/Apollo';

import Router from './navigation/Router';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';

const navigationContext = new NavigationContext({
  router: Router,
  store: Store,
})

class AppContainer extends React.Component {
  state = {
    appIsReady: false,
  }

  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [
          require('./assets/images/exponent-wordmark.png'),
        ],
      });
    } catch(e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
        'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({appIsReady: true});
    }
  }

  render() {
    if (this.state.appIsReady) {
      let { notification } = this.props.exp;
      let initialRoute = Router.getRoute('rootNavigation', {notification});

      return (
        <View style={styles.container}>
          <ApolloProvider store={Store} client={Client}>
            <NavigationProvider context={navigationContext}>
              <StackNavigation id="root" initialRoute={initialRoute} />
            </NavigationProvider>
          </ApolloProvider>

          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
        </View>
      );
    } else {
      return (
        <Exponent.Components.AppLoading />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

Exponent.registerRootComponent(AppContainer);
