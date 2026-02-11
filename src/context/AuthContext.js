import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

const STORAGE_KEY = '@drinkbuddies_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Failed to load user', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const persistUser = useCallback(async (nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const register = useCallback(
    async ({ email, password }) => {
      const newUser = { email, password, avatarUri: null };
      await persistUser(newUser);
      return newUser;
    },
    [persistUser]
  );

  const login = useCallback(
    async ({ email, password }) => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) {
        throw new Error('No registered user found. Please register first.');
      }
      const existing = JSON.parse(stored);
      if (existing.email !== email || existing.password !== password) {
        throw new Error('Invalid email or password.');
      }
      await persistUser(existing);
      return existing;
    },
    [persistUser]
  );

  const updateProfile = useCallback(
    async (updates) => {
      if (!user) return;
      const nextUser = { ...user, ...updates };
      await persistUser(nextUser);
      return nextUser;
    },
    [persistUser, user]
  );

  const changePassword = useCallback(
    async ({ currentPassword, newPassword }) => {
      if (!user) throw new Error('Not authenticated.');
      if (user.password !== currentPassword) {
        throw new Error('Current password is incorrect.');
      }
      const nextUser = { ...user, password: newPassword };
      await persistUser(nextUser);
      return nextUser;
    },
    [persistUser, user]
  );

  const logout = useCallback(async () => {
    await persistUser(null);
  }, [persistUser]);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    updateProfile,
    changePassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

