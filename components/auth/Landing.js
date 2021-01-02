import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default function Landing({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title="Sign In"
        onPress={() => navigation.navigate('SignIn')}
      />
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate('SignUp')}
      />
    </View>
  );
}
