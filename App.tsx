import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import React, {useEffect} from 'react';
import {PermissionsAndroid, StyleSheet, Text} from 'react-native';
import PermissionsPage from './permissionPage';

function App() {
  const device = useCameraDevice('back');
  const {hasPermission} = useCameraPermission();

  const handlePermissionGranted = () => {
    console.log('Permission granted! Proceed to the next step.');
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (!hasPermission) {
      requestCameraPermission();
    }
  }, []);

  if (!hasPermission) {
    return <PermissionsPage onPermissionGranted={handlePermissionGranted} />;
  }
  if (device == null) {
    return <Text>Permission required</Text>;
  }
  return (
    <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
  );
}

export default App;
