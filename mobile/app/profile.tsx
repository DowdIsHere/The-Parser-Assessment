import { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../constants/theme';

const CATEGORIES = [
  { key: 'communication', label: 'Communication', icon: '💬', content: 'You communicate with broad strokes, painting the big picture before diving into details. You prefer metaphors and analogies over raw data.' },
  { key: 'movies', label: 'Movies', icon: '🎬', content: 'You gravitate toward films with sweeping narratives, ensemble casts, and thematic depth. Cinematography and world-building matter as much as plot.' },
  { key: 'games', label: 'Games', icon: '🎮', content: 'Open-world and strategy games appeal to your panoramic cognitive style. You enjoy seeing all the pieces and planning several moves ahead.' },
  { key: 'recreation', label: 'Recreation', icon: '🏔', content: 'Outdoor activities with expansive views, travel, and experiences that broaden your perspective. You recharge by taking in new environments.' },
  { key: 'exercises', label: 'Cognitive Exercises', icon: '🧠', content: 'Mind-mapping, systems thinking puzzles, and synthesis exercises that connect disparate ideas into unified frameworks.' },
  { key: 'products', label: 'Products & Services', icon: '✦', content: 'Tools that help you organize and visualize the big picture: whiteboards, project management platforms, and panoramic displays.' },
];

export default function ProfileScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggleCategory(key: string) {
    setExpanded(expanded === key ? null : key);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Image
          source={require('../../images/27parser-coin.png')}
          style={styles.coin}
          resizeMode="contain"
        />
        <Text style={styles.parserName}>The Wide-Angle</Text>
        <Text style={styles.parserTagline}>
          You see the forest, the trees, and the ecosystem connecting them.
        </Text>
      </View>

      <View style={styles.grid}>
        {CATEGORIES.map((cat) => (
          <View key={cat.key} style={styles.gridItemWrapper}>
            <Pressable
              style={[
                styles.gridItem,
                expanded === cat.key && styles.gridItemExpanded,
              ]}
              onPress={() => toggleCategory(cat.key)}
            >
              <Text style={styles.gridIcon}>{cat.icon}</Text>
              <Text style={styles.gridLabel}>{cat.label}</Text>
            </Pressable>
            {expanded === cat.key && (
              <View style={styles.expandedContent}>
                <Text style={styles.expandedText}>{cat.content}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
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
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  coin: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
  },
  parserName: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.gold,
    marginBottom: spacing.xs,
  },
  parserTagline: {
    fontFamily: fonts.displayRegular,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItemWrapper: {
    width: '48%',
    marginBottom: spacing.md,
  },
  gridItem: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  gridItemExpanded: {
    borderColor: colors.gold,
  },
  gridIcon: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  gridLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.text,
    textAlign: 'center',
  },
  expandedContent: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.gold,
    borderTopWidth: 0,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: -1,
  },
  expandedText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
});
