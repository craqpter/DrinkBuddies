import React, { useEffect, useState, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useUsersLocation } from '../context/UsersLocationContext';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const { colors } = useAppTheme();
  const { user } = useAuth();
  const { updateUserLocation, getAllUsersLocations } = useUsersLocation();
  const [otherUsers, setOtherUsers] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const loadOtherUsers = () => {
      const allUsers = getAllUsersLocations();
      const filtered = allUsers.filter((u) => u.email !== user?.email);
      setOtherUsers(filtered);
    };

    loadOtherUsers();
    const interval = setInterval(loadOtherUsers, 3000);
    return () => clearInterval(interval);
  }, [getAllUsersLocations, user?.email]);

  useEffect(() => {
    let subscription;

    const start = async () => {
      try {
        if (Platform.OS === 'android' && !Device.isDevice) {
          setErrorMsg('Location does not work in Android emulator. Try a real device.');
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied.');
          return;
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 2000,
            distanceInterval: 1,
          },
          async (loc) => {
            const newLocation = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            };
            setLocation(newLocation);

            if (user?.email) {
              const userId = user.email;
              await updateUserLocation(userId, user.email, newLocation);
            }
          }
        );
      } catch (e) {
        setErrorMsg(e.message || 'Failed to get location.');
      }
    };

    start();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [user?.email, updateUserLocation]);

  const renderMap = () => {
    if (!location) {
      return (
        <View style={styles.centered}>
          <Text style={[styles.infoText, { color: colors.text }]}>
            Acquiring GPS position...
          </Text>
        </View>
      );
    }

    const region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    const getMarkerColor = (userEmail) => {
      const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
      const hash = userEmail.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return colors[hash % colors.length];
    };

    return (
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={region}
        region={region}
        showsUserLocation
        followsUserLocation
        showsMyLocationButton
        rotateEnabled
        zoomEnabled
        scrollEnabled
      >
        <Marker
          coordinate={region}
          title="You are here"
          pinColor="#22c55e"
          description={user?.email || 'Current user'}
        />
        {otherUsers.map((otherUser) => (
          <Marker
            key={otherUser.id}
            coordinate={{
              latitude: otherUser.latitude,
              longitude: otherUser.longitude,
            }}
            title={otherUser.email}
            pinColor={getMarkerColor(otherUser.email)}
            description={`Last updated: ${new Date(otherUser.updatedAt).toLocaleTimeString()}`}
          />
        ))}
      </MapView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {errorMsg ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: colors.danger }]}>{errorMsg}</Text>
        </View>
      ) : (
        renderMap()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  infoText: {
    color: '#e5e7eb',
  },
  errorText: {
    color: '#fecaca',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

