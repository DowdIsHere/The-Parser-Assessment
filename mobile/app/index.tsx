import { View, Text, Image, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, spacing, borderRadius, shadows } from '../constants/theme';

function CTAButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.primaryButton} onPress={onPress}>
      <Text style={styles.primaryButtonText}>Begin Assessment</Text>
    </Pressable>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const beginAssessment = () => router.push('/assessment');

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Layer 1: The Hook */}
      <View style={styles.layer}>
        <View style={styles.hookContent}>
          <Image
            source={require('../../images/27parser-logo-text.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.heroNumber}>27</Text>
          <Text style={styles.subtitle}>Three questions. One profile.</Text>
          <CTAButton onPress={beginAssessment} />
          <Pressable onPress={() => router.push('/signin')}>
            <Text style={styles.signInText}>Sign In</Text>
          </Pressable>
        </View>
      </View>

      {/* Layer 2: The Spec Block */}
      <View style={styles.layer}>
        <View style={styles.specRow}>
          <View style={styles.specItem}>
            <Text style={styles.specValue}>$4.99/mo</Text>
          </View>
          <View style={[styles.specItem, styles.specItemBorder]}>
            <Text style={styles.specValue}>3 Questions</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specValue}>2 Minutes</Text>
          </View>
        </View>
        <Text style={styles.specDescription}>
          A cognitive profile based on how you actually process.
        </Text>
        <CTAButton onPress={beginAssessment} />
      </View>

      {/* Layer 3: The Story */}
      <View style={styles.layer}>
        <View style={styles.storyPanel}>
          <Text style={styles.storyQuote}>
            {'"'}I built this because my son and I couldn{'’'}t understand each
            other. Now we have a shared language for it.{'"'}
          </Text>
        </View>
        <CTAButton onPress={beginAssessment} />
      </View>

      {/* Layer 4: The Ecosystem */}
      <View style={styles.layer}>
        <Text style={styles.ecosystemHeading}>
          One Framework.{'\n'}Every Relationship.
        </Text>
        <View style={styles.cardGrid}>
          {['Individual', 'Couples', 'Kids', 'Family'].map((label) => (
            <View key={label} style={styles.ecosystemCard}>
              <Text style={styles.ecosystemCardText}>{label}</Text>
            </View>
          ))}
        </View>
        <CTAButton onPress={beginAssessment} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  layer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    minHeight: 480,
    justifyContent: 'center',
  },

  // Layer 1: The Hook
  hookContent: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.lg,
  },
  heroNumber: {
    fontFamily: fonts.display,
    fontSize: 120,
    color: colors.gold,
    letterSpacing: -2,
    lineHeight: 130,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fonts.displayRegular,
    fontSize: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    letterSpacing: 0.5,
  },
  signInText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.gold,
    marginTop: spacing.lg,
    letterSpacing: 0.3,
  },

  // Layer 2: The Spec Block
  specRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  specItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  specItemBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  specValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.text,
    letterSpacing: 0.3,
  },
  specDescription: {
    fontFamily: fonts.displayItalic,
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: spacing.xl,
  },

  // Layer 3: The Story
  storyPanel: {
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    paddingLeft: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xl,
  },
  storyQuote: {
    fontFamily: fonts.displayItalic,
    fontSize: 20,
    color: colors.textSecondary,
    lineHeight: 30,
  },

  // Layer 4: The Ecosystem
  ecosystemHeading: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: spacing.xl,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  ecosystemCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexGrow: 1,
    flexBasis: '45%',
    alignItems: 'center',
    ...shadows.sm,
  },
  ecosystemCardText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
    letterSpacing: 0.3,
  },

  // Shared CTA
  primaryButton: {
    backgroundColor: colors.gold,
    paddingVertical: 16,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  primaryButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.white,
    letterSpacing: 0.5,
  },
});
