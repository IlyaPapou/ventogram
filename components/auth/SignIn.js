import React, { Component } from 'react';
import {
  View, Button, TextInput, Alert,
} from 'react-native';
import firebase from 'firebase';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.onSignIn.bind(this);
  }

  onSignIn() {
    const { email, password } = this.state;
    firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => Alert.alert(res))
      .catch((err) => Alert.alert(err));
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="Your Email"
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          placeholder="Your Password"
          secureTextEntry
          onChangeText={(password) => this.setState({ password })}
        />
        <Button
          title="Sign In"
          onPress={() => this.onSignIn()}
        />
      </View>
    );
  }
}
export default SignIn;
