import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  ActivityIndicator,
  ScrollView,
  Text,
  Image
} from 'react-native';

import ProfileHeader from  './ProfileHeader';
import ChannelList from '../../../components/ChannelList'

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { filter } from 'graphql-anywhere';

import HTMLView from 'react-native-htmlview'

@withApollo
export class ProfileContainer extends Component {
  constructor(props) {
    super(props)
    this._onToggleChange = this._onToggleChange.bind(this);
  }

  _onToggleChange(value) {
    const typeValue = {
      'Blocks': 'block',
      'Channels': 'channel',
    }[value];

    this.setState({ type: typeValue });
    this.props.data.refetch({ type: typeValue })
  }

  render() {
    if (this.props.data.error) {
      return (
        <View style={styles.loadingContainer} >
          <Text>
            Profile not found
          </Text>
        </View>
      );
    }

    if (this.props.data.loading && !this.props.user) {
      return (
        <View style={styles.loadingContainer} >
          <ActivityIndicator />
        </View>
      );
    }
    
    return (
      <View style={styles.container} >
        <ChannelList 
          channels={this.props.data.user.contents} 
          renderHeader={() => { 
            return (<ProfileHeader

              onToggleChange={this._onToggleChange}
              user={this.props.data.user}
            />);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  avatar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 75,
    height: 75
  },  
  header: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 20
  }
});

const ProfileQuery = gql`
  query ProfileQuery($type: String!){
    user(id: "damon-zucconi") {
      id
      initials
      name
      avatar(size: LARGE)
      bio
      contents(type: $type, per: 10) {
        id
        title
        updated_at(relative: true)
        user {
          name
        }
        kind {
          ... on Channel {
            visibility
            counts{
              blocks
            }
          }
        }
      }
    }
  }
`

export const ProfileWithData = graphql(ProfileQuery, { 
  options: { variables: { type: "channel" } },
})(ProfileContainer);