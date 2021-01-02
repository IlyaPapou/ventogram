import React, { Component } from 'react';
import { View, Button, TextInput } from 'react-native';
import firebase from 'firebase';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
    };
    this.onSingUp.bind(this);
  }

  onSingUp() {
    const { email, password, name } = this.state;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="Your Email"
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          placeholder="Your Name"
          onChangeText={(name) => this.setState({ name })}
        />
        <TextInput
          placeholder="Your Password"
          secureTextEntry
          onChangeText={(password) => this.setState({ password })}
        />
        <Button
          title="Sing Up"
          onPress={() => this.onSingUp()}
        />
      </View>
    );
  }
}
export default SignUp;
