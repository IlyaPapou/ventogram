import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import * as firebase from 'firebase';
import * as Sentry from 'sentry-expo';
import LandingScreen from './components/auth/Landing';
import SignUpScreen from './components/auth/SignUp';
import SignInScreen from './components/auth/SignIn';
import firebaseConfig from './configs/firebase';
import sentryConfig from './configs/sentry';

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

Sentry.init({
  dsn: sentryConfig.dsn,
  enableInExpoDevelopment: true,
  debug: true, // to `false` in production.
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

const Stack = createStackNavigator();
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          isSignedIn: false,
          isLoaded: true,
        });
      } else {
        this.setState({
          isSignedIn: true,
          isLoaded: true,
        });
      }
    });
  }

  render() {
    const { isSignedIn, isLoaded } = this.state;
    if (!isLoaded) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }
    if (!isSignedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return (
      <View style={styles.container}>
        <Text>User is Signed In</Text>
      </View>
    );
  }
}
