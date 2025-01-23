import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  AlertButton,
  Linking,
  PermissionsAndroid,
  StyleSheet,
  Text,
} from 'react-native';
import PermissionsPage from './permissionPage';
import {useIsFocused} from '@react-navigation/core';
import {useIsForeground} from './src/hooks/useIsForeground';

const showCodeAlert = (value: string, onDismissed: () => void): void => {
  const buttons: AlertButton[] = [
    {
      text: 'Close',
      style: 'cancel',
      onPress: onDismissed,
    },
  ];
  if (value.startsWith('http')) {
    buttons.push({
      text: 'Open URL',
      onPress: () => {
        Linking.openURL(value);
        onDismissed();
      },
    });
  }
  Alert.alert('Scanned Code', value, buttons);
};

function App() {
  // 1. Use a simple default back camera
  const device = useCameraDevice('back');

  // 2. Only activate Camera when the app is focused and this screen is currently opened
  // const isFocused = useIsFocused();
  const isShowingAlert = useRef(false);
  const isForeground = useIsForeground();
  const isActive = isForeground || !isShowingAlert.current;
  const {hasPermission} = useCameraPermission();

  // 3. (Optional) enable a torch setting
  const [torch, setTorch] = useState(false);

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

  // 4. On code scanned, we show an aler to the user

  const onCodeScanned = useCallback((codes: Code[]) => {
    console.log(`Scanned ${codes.length} codes:`, codes);
    const value = codes[0]?.value;
    if (value == null) {
      return;
    }
    if (isShowingAlert.current) {
      return;
    }
    showCodeAlert(value, () => {
      isShowingAlert.current = false;
    });
    isShowingAlert.current = true;
  }, []);

  // 5. Initialize the Code Scanner to scan QR codes and Barcodes
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: onCodeScanned,
  });

  if (!hasPermission) {
    return <PermissionsPage onPermissionGranted={handlePermissionGranted} />;
  }
  if (device == null) {
    return <Text>Permission required</Text>;
  }
  return (
    // <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={isActive}
      codeScanner={codeScanner}
      torch={torch ? 'on' : 'off'}
      enableZoomGesture={true}
    />
  );
}

export default App;
