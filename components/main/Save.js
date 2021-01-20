import React, { useState } from 'react';
import {
  View, TextInput, Image, StyleSheet, Button,
} from 'react-native';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/firebase-storage';
import * as ImageManipulator from 'expo-image-manipulator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function Save(props) {
  const [caption, setCaption] = useState(null);
  const { route } = props;
  const { image } = route.params;
  const uploadImage = async () => {
    const resizedImgUri = (await ImageManipulator.manipulateAsync(
      image,
      [{ resize: { width: 900 } }],
      { compress: 0.9, format: 'jpeg' },
    )).uri;
    const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
    const response = await fetch(resizedImgUri);
    const blob = await response.blob();
    const task = firebase.storage().ref().child(childPath).put(blob);
    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };
    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((res) => {
        console.log(res);
      });
    };
    const taskError = (snapshot) => {
      console.log(snapshot);
    };
    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} />
      <TextInput
        placeholder="Write a caption"
        onChangeText={(captionText) => setCaption(captionText)}
      />
      <Button title="Save" onPress={() => uploadImage()} />
    </View>
  );
}

Save.propTypes = {
  route: PropTypes.func.isRequired,
};
