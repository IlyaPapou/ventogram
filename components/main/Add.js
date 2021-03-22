import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, Button, Image, Platform,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const styles = StyleSheet.create({
  camera: {
    aspectRatio: 1,
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  flipButton: {
    marginBottom: 20,
  },
  pickedImg: {
    aspectRatio: 1,
    flex: 1,
  },
});

export default function Add({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');

        const cameraStatus = await Camera.requestPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
      }
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync();
      setImage(data.uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasCameraPermission === null || hasMediaLibraryPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasMediaLibraryPermission === null) {
    return <Text>No access to camera or media library</Text>;
  }

  let displayedImg;
  let cameraButton;

  if (image) {
    displayedImg = <Image style={styles.pickedImg} source={{ uri: image }} />;
  } else {
    displayedImg = <Camera ref={(ref) => setCamera(ref)} style={styles.camera} type={type} ratio="1:1" />;
  }

  if (image) {
    cameraButton = <Button title="Return to camera" onPress={() => setImage(undefined)} />;
  } else {
    cameraButton = (
      <Button
        title="Flip camera"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back,
          );
        }}
      />
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {displayedImg}
      </View>
      <View style={styles.flipButton}>
        {!image && <Button title="Take a picture" onPress={() => takePicture()} />}
        <Button title="Choose from the gallery" onPress={() => pickImage()} />
        {cameraButton}
        {image && <Button title="Save" onPress={() => navigation.navigate('Save', { image })} />}
      </View>
    </View>
  );
}
