import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import * as firebase from 'firebase';
import * as Sentry from 'sentry-expo';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import LandingScreen from './components/auth/Landing';
import SignUpScreen from './components/auth/SignUp';
import SignInScreen from './components/auth/SignIn';
import firebaseConfig from './configs/firebase';
import sentryConfig from './configs/sentry';
import rootReducer from './redux/reducers/index';
import MainScreen from './components/Main';
import AddScreen from './components/main/Add';
import SaveScreen from './components/main/Save';

Sentry.init({
  dsn: sentryConfig.dsn,
  enableInExpoDevelopment: true,
  debug: true, // to `false` in production.
});

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const store = createStore(rootReducer, applyMiddleware(thunk));

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
    const { navigation } = this.props;
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
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MainAdd" component={AddScreen} navigation={navigation} />
            <Stack.Screen name="Save" component={SaveScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
