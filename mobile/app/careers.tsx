import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../constants/theme';

const CAREER_DATA = [
  {
    parser: 'The Wide-Angle',
    careers: [
      { title: 'Strategic Consultant', fit: 'Your panoramic perspective lets you see organizational blind spots others miss.' },
      { title: 'Urban Planner', fit: 'Systems-level thinking applied to how communities function and grow.' },
      { title: 'Documentary Filmmaker', fit: 'Weaving complex narratives from multiple threads into a cohesive story.' },
    ],
  },
  {
    parser: 'The Close-Up',
    careers: [
      { title: 'Quality Assurance Engineer', fit: 'Your detail orientation catches what others overlook.' },
      { title: 'Forensic Accountant', fit: 'Precision analysis that uncovers hidden patterns in data.' },
      { title: 'Watchmaker / Restorer', fit: 'Meticulous craft that rewards deep focus on fine mechanics.' },
    ],
  },
  {
    parser: 'The Adjustable',
    careers: [
      { title: 'Emergency Room Physician', fit: 'Rapidly shifting between big-picture triage and detail-focused treatment.' },
      { title: 'Product Manager', fit: 'Balancing strategic vision with granular feature decisions daily.' },
      { title: 'Investigative Journalist', fit: 'Zooming between systemic stories and the specific evidence that supports them.' },
    ],
  },
];

export default function CareersScreen() {
  const [expandedParser, setExpandedParser] = useState<string | null>(null);

  function toggleParser(parser: string) {
    setExpandedParser(expandedParser === parser ? null : parser);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Careers by Parser</Text>
      <Text style={styles.subtitle}>
        Discover career paths aligned with your cognitive style.
      </Text>

      {CAREER_DATA.map((group) => (
        <View key={group.parser} style={styles.parserSection}>
          <Pressable
            style={[
              styles.parserHeader,
              expandedParser === group.parser && styles.parserHeaderExpanded,
            ]}
            onPress={() => toggleParser(group.parser)}
          >
            <Text style={styles.parserName}>{group.parser}</Text>
            <Text style={styles.chevron}>
              {expandedParser === group.parser ? '−' : '+'}
            </Text>
          </Pressable>

          {expandedParser === group.parser && (
            <View style={styles.careerList}>
              {group.careers.map((career, i) => (
                <View key={i} style={styles.careerCard}>
                  <Text style={styles.careerTitle}>{career.title}</Text>
                  <Text style={styles.careerFit}>{career.fit}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
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
  parserSection: {
    marginBottom: spacing.md,
  },
  parserHeader: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.sm,
  },
  parserHeaderExpanded: {
    borderColor: colors.gold,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  parserName: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.gold,
  },
  chevron: {
    fontFamily: fonts.body,
    fontSize: 22,
    color: colors.gold,
  },
  careerList: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.gold,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    backgroundColor: colors.card,
    padding: spacing.md,
  },
  careerCard: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  careerTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  careerFit: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
