import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchUser } from '../redux/actions/index';
import FeedScreen from './main/Feed';
import ProfileScreen from './main/Profile';
import AddScreen from './main/Add';

const Tab = createBottomTabNavigator();
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export class Main extends Component {
  componentDidMount() {
    const { fetchUserAction } = this.props;
    fetchUserAction();
  }

  render() {
    return (
      <View style={styles.container}>
        <Tab.Navigator>
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="account-circle" color={color} size={26} />),
            }}
          />
          <Tab.Screen
            name="Feed"
            component={FeedScreen}
            options={{
              tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="home" color={color} size={26} />),
            }}
          />
          <Tab.Screen
            name="Add"
            component={AddScreen}
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
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
