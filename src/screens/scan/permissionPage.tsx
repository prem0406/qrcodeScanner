import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import {Camera} from 'react-native-vision-camera';

const PermissionsPage = ({onPermissionGranted}) => {
  const [cameraPermission, setCameraPermission] = useState('not-determined'); // 'authorized', 'denied', or 'not-determined'

  console.log('****cameraPermission ', cameraPermission);

  useEffect(() => {
    const checkPermissions = async () => {
      // Check camera permission
      const status = await Camera.getCameraPermissionStatus();
      setCameraPermission(status);

      if (status === 'granted') {
        onPermissionGranted?.(); // Proceed to the next page or enable the camera
      }
    };

    checkPermissions();
  }, []);

  const requestPermission = async () => {
    const newStatus = await Camera.requestCameraPermission();
    setCameraPermission(newStatus);

    if (newStatus === 'granted') {
      onPermissionGranted?.();
    }
  };

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera Permissions</Text>

      {cameraPermission === 'not-determined' && (
        <Text style={styles.description}>
          We need access to your camera to scan QR codes. Please grant
          permission.
        </Text>
      )}

      {cameraPermission === 'denied' && (
        <Text style={styles.description}>
          Camera access has been denied. Please enable camera permissions in
          your device settings.
        </Text>
      )}

      {cameraPermission === 'not-determined' && (
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      )}

      {cameraPermission === 'denied' && (
        <TouchableOpacity style={styles.button} onPress={openSettings}>
          <Text style={styles.buttonText}>Open Settings</Text>
        </TouchableOpacity>
      )}

      {cameraPermission === 'authorized' && (
        <Text style={styles.successMessage}>
          Permission granted! You can now use the camera.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessage: {
    fontSize: 18,
    color: '#28A745',
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default PermissionsPage;
