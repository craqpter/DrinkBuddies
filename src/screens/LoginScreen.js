import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
    } catch (e) {
      setError(e.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to continue</Text>

        {!!error && <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>}

        <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors.border,
              backgroundColor: colors.inputBackground,
              color: colors.text,
            },
          ]}
          placeholder="you@example.com"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors.border,
              backgroundColor: colors.inputBackground,
              color: colors.text,
            },
          ]}
          placeholder="••••••••"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={onSubmit}
          disabled={submitting}
        >
          <Text style={[styles.primaryButtonText, { color: '#ffffff' }]}>
            {submitting ? 'Signing in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.footerLink, { color: colors.primary }]}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#020617',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#e5e7eb',
  },
  subtitle: {
    marginTop: 4,
    color: '#9ca3af',
  },
  error: {
    marginTop: 12,
    color: '#fecaca',
  },
  label: {
    marginTop: 16,
    marginBottom: 4,
    color: '#d1d5db',
    fontSize: 14,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    color: '#f9fafb',
    backgroundColor: '#020617',
  },
  primaryButton: {
    marginTop: 24,
    backgroundColor: '#2563eb',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#e5e7eb',
    fontWeight: '600',
    fontSize: 16,
  },
  footerRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#9ca3af',
    marginRight: 4,
  },
  footerLink: {
    color: '#60a5fa',
    fontWeight: '600',
  },
});

