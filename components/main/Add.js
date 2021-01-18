import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, Button,
} from 'react-native';
import { Camera } from 'expo-camera';

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
});

export default function Add() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} type={type} ratio="1:1" />
      </View>
      <View style={styles.flipButton}>
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
      </View>
    </View>
  );
}
