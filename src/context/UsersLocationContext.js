import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UsersLocationContext = createContext(null);

const STORAGE_KEY = '@firstproject_users_locations';

export function UsersLocationProvider({ children }) {
  const [usersLocations, setUsersLocations] = useState({});

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUsersLocations(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Failed to load users locations', e);
      }
    };

    loadLocations();
  }, []);

  const persistLocations = useCallback(async (locations) => {
    setUsersLocations(locations);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
    } catch (e) {
      console.warn('Failed to save users locations', e);
    }
  }, []);

  const updateUserLocation = useCallback(
    async (userId, email, location) => {
      const updated = {
        ...usersLocations,
        [userId]: {
          email,
          latitude: location.latitude,
          longitude: location.longitude,
          updatedAt: Date.now(),
        },
      };
      await persistLocations(updated);
    },
    [usersLocations, persistLocations]
  );

  const removeUserLocation = useCallback(
    async (userId) => {
      const updated = { ...usersLocations };
      delete updated[userId];
      await persistLocations(updated);
    },
    [usersLocations, persistLocations]
  );

  const getAllUsersLocations = useCallback(() => {
    return Object.entries(usersLocations).map(([userId, data]) => ({
      id: userId,
      ...data,
    }));
  }, [usersLocations]);

  const value = {
    usersLocations,
    updateUserLocation,
    removeUserLocation,
    getAllUsersLocations,
  };

  return (
    <UsersLocationContext.Provider value={value}>{children}</UsersLocationContext.Provider>
  );
}

export function useUsersLocation() {
  const ctx = useContext(UsersLocationContext);
  if (!ctx) {
    throw new Error('useUsersLocation must be used within UsersLocationProvider');
  }
  return ctx;
}
