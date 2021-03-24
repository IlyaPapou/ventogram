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
  const { route, navigation } = props;
  const { image } = route.params;
  const savePostData = (imgUrl) => {
    firebase.firestore()
      .collection('posts')
      .doc(firebase.auth().currentUser.uid)
      .collection('userPosts')
      .add({
        imgUrl,
        caption,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => navigation.popToTop());
  };
  const uploadImage = async () => {
    // TODO: Move all line values to general const
    const resizedImgUri = (await ImageManipulator.manipulateAsync(
      image,
      [{ resize: { width: 900 } }],
      { compress: 0.9, format: 'jpeg' },
    )).uri;
    const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
    const response = await fetch(resizedImgUri);
    const blob = await response.blob();
    const task = firebase.storage()
      .ref()
      .child(childPath)
      .put(blob);
    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };
    const taskCompleted = async () => {
      const imgUrl = await task.snapshot.ref.getDownloadURL();
      savePostData(imgUrl);
    };
    const taskError = (err) => {
      throw err;
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
  route: PropTypes.shape(React.propTypes).isRequired,
};
