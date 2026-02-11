import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useAppTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const handlePickAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'We need access to your photos to set an avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      try {
        setBusy(true);
        await updateProfile({ avatarUri: uri });
        setStatus('Avatar updated.');
      } catch (e) {
        setStatus(e.message || 'Failed to update avatar.');
      } finally {
        setBusy(false);
      }
    }
  };

  const handleChangePassword = async () => {
    setStatus('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatus('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      setStatus('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus('New passwords do not match.');
      return;
    }

    try {
      setBusy(true);
      await changePassword({ currentPassword, newPassword });
      setStatus('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setStatus(e.message || 'Failed to change password.');
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePickAvatar}>
          {user?.avatarUri ? (
            <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
              <Text style={[styles.avatarInitial, { color: colors.textSecondary }]}>
                {user?.email ? user.email[0].toUpperCase() : '?'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.email, { color: colors.text }]}>{user?.email}</Text>
          <TouchableOpacity onPress={handlePickAvatar}>
            <Text style={[styles.changeAvatarLink, { color: colors.primary }]}>
              Change avatar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Change password</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors.border,
              backgroundColor: colors.inputBackground,
              color: colors.text,
            },
          ]}
          placeholder="Current password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors.border,
              backgroundColor: colors.inputBackground,
              color: colors.text,
            },
          ]}
          placeholder="New password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors.border,
              backgroundColor: colors.inputBackground,
              color: colors.text,
            },
          ]}
          placeholder="Confirm new password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={[
            styles.primaryButton,
            busy && styles.primaryButtonDisabled,
            { backgroundColor: colors.primary },
          ]}
          onPress={handleChangePassword}
          disabled={busy}
        >
          <Text style={styles.primaryButtonText}>Update password</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <Text style={[styles.menuTitle, { color: colors.textSecondary }]}>Settings</Text>
        <View style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.menuItemLeft}>
            <View style={styles.menuIconBadge}>
              <Ionicons name="moon" size={18} color="#e5e7eb" />
            </View>
            <Text style={[styles.menuItemLabel, { color: colors.text }]}>
              Dark mode
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={toggleTheme}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                backgroundColor: isDark ? colors.accent : '#4b5563',
                justifyContent: 'center',
                paddingHorizontal: 3,
              }}
            >
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: '#ffffff',
                  alignSelf: isDark ? 'flex-end' : 'flex-start',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {!!status && <Text style={[styles.status, { color: colors.textSecondary }]}>{status}</Text>}

      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: colors.danger }]}
        onPress={handleLogout}
        disabled={busy}
      >
        <Text style={[styles.logoutText, { color: colors.danger }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    marginLeft: 16,
  },
  email: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '600',
  },
  changeAvatarLink: {
    marginTop: 4,
    color: '#60a5fa',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 28,
    color: '#9ca3af',
    fontWeight: '700',
  },
  section: {
    backgroundColor: '#020617',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#111827',
  },
  sectionTitle: {
    color: '#d1d5db',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  menuSection: {
    marginTop: 24,
  },
  menuTitle: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  menuItem: {
    backgroundColor: '#020617',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  menuItemLabel: {
    color: '#e5e7eb',
    fontSize: 15,
    fontWeight: '500',
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    color: '#f9fafb',
    backgroundColor: '#020617',
    marginTop: 10,
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: '#2563eb',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#e5e7eb',
    fontWeight: '600',
    fontSize: 15,
  },
  status: {
    marginTop: 14,
    color: '#a5b4fc',
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: 24,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fecaca',
    fontWeight: '600',
  },
});

