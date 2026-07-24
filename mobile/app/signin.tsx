import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, spacing, borderRadius } from '../constants/theme';

export default function SignInScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/profile');
    } catch (e: any) {
      Alert.alert('Sign In Failed', e.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.form}>
        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to access your parser profile.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  form: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    marginBottom: spacing.lg,
    backgroundColor: colors.card,
  },
  button: {
    backgroundColor: colors.gold,
    paddingVertical: 16,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.white,
    letterSpacing: 0.5,
  },
});
