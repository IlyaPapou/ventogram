import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase';
import { fetchUser, fetchUserPosts, fetchUserFollowing } from '../redux/actions/index';
import FeedScreen from './main/Feed';
import SearchScreen from './main/Search';
import ProfileScreen from './main/Profile';

const Tab = createMaterialBottomTabNavigator();
const EmptyScreen = () => null;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export class Main extends Component {
  componentDidMount() {
    const { fetchUserAction, fetchUserPostsAction, fetchUserFollowingAction } = this.props;
    fetchUserAction();
    fetchUserPostsAction();
    fetchUserFollowingAction();
  }

  render() {
    return (
      <View style={styles.container}>
        <Tab.Navigator initialRouteName="Feed" labeled={false}>
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="account-circle" color={color} size={26} />),
            }}
            listeners={({ navigation }) => ({
              tabPress: (event) => {
                event.preventDefault();
                navigation.navigate('Profile', { uid: firebase.auth().currentUser.uid });
              },
            })}
          />
          <Tab.Screen
            name="Feed"
            component={FeedScreen}
            options={{
              tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="home" color={color} size={26} />),
            }}
          />
          <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{
              tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="account-search" color={color} size={26} />),
            }}
          />
          <Tab.Screen
            name="Add"
            component={EmptyScreen}
            listeners={({ navigation }) => ({
              tabPress: (event) => {
                event.preventDefault();
                navigation.navigate('MainAdd');
              },
            })}
            options={{
              tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="plus-box" color={color} size={26} />),
            }}
          />
        </Tab.Navigator>
      </View>
    );
  }
}

Main.propTypes = {
  fetchUserAction: PropTypes.func.isRequired,
  fetchUserPostsAction: PropTypes.func.isRequired,
  fetchUserFollowingAction: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),
};

Main.defaultProps = {
  currentUser: {
    email: '',
    name: '',
  },
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUserAction: fetchUser,
  fetchUserPostsAction: fetchUserPosts,
  fetchUserFollowingAction: fetchUserFollowing,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
