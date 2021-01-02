import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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

const Stack = createStackNavigator();

export default function App() {
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
