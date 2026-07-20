import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, spacing } from '../constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoSection}>
        <Image
          source={require('../../images/27parser-logo-text.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>
          Everyone takes in the world{'\n'}a little differently.
        </Text>
      </View>

      <View style={styles.buttonSection}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/assessment')}
        >
          <Text style={styles.primaryButtonText}>Begin Assessment</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/signin')}
        >
          <Text style={styles.secondaryButtonText}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: spacing.lg,
  },
  tagline: {
    fontFamily: fonts.displayRegular,
    fontSize: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  buttonSection: {
    width: '100%',
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.gold,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.white,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.gold,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.gold,
    letterSpacing: 0.5,
  },
});
