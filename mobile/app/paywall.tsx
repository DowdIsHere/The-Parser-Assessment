import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, spacing, borderRadius, shadows } from '../constants/theme';

const FEATURES = [
  'Access to Profile(s)',
  'Parser Content',
  'Friction & Synergy Maps',
  'A.I. Guided Parser Oriented Product and Service Search',
  'Cognition Block Builder',
];

export default function PaywallScreen() {
  const router = useRouter();

  function handleSubscribe() {
    // Placeholder: will integrate StoreKit / Google Play billing
    router.replace('/profile');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Unlock Your Profile</Text>
      <Text style={styles.subtitle}>
        Get full access to your cognitive profile and all 27Parser features.
      </Text>

      <View style={styles.priceCard}>
        <Text style={styles.price}>$4.99</Text>
        <Text style={styles.pricePeriod}>per month</Text>
      </View>

      <View style={styles.featureList}>
        {FEATURES.map((feature, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureCheck}>&#10003;</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.subscribeButton} onPress={handleSubscribe}>
        <Text style={styles.subscribeButtonText}>Subscribe</Text>
      </Pressable>

      <Text style={styles.legal}>
        Payment will be charged to your App Store or Google Play account.
        Subscription automatically renews unless cancelled at least 24 hours
        before the end of the current period.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
    maxWidth: 300,
  },
  priceCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  price: {
    fontFamily: fonts.display,
    fontSize: 48,
    color: colors.gold,
  },
  pricePeriod: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  featureList: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  featureCheck: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.gold,
    marginRight: spacing.md,
    marginTop: 1,
  },
  featureText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  subscribeButton: {
    backgroundColor: colors.gold,
    paddingVertical: 18,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.lg,
  },
  subscribeButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 17,
    color: colors.white,
    letterSpacing: 0.5,
  },
  legal: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 300,
  },
});
