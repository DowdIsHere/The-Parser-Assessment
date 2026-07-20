import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, spacing, borderRadius, shadows } from '../constants/theme';

const QUESTIONS = [
  {
    id: 1,
    text: 'When you walk into a room full of people, what do you notice first?',
    options: [
      'The overall energy and mood',
      'Specific details about the space',
      'How people are interacting',
      'Whether I feel comfortable',
    ],
  },
  {
    id: 2,
    text: 'When learning something new, you prefer to:',
    options: [
      'See a demonstration first',
      'Read the instructions thoroughly',
      'Jump in and figure it out',
      'Discuss it with someone',
    ],
  },
  {
    id: 3,
    text: 'When making an important decision, you tend to:',
    options: [
      'Go with your gut feeling',
      'Analyze all available data',
      'Consider how it affects others',
      'Look for patterns from past experience',
    ],
  },
];

const LINES = ['Young Adult', 'Adult'];

const PARSER_SUMMARY = {
  name: 'The Wide-Angle',
  description:
    'You take in the world through a broad, panoramic lens. You see the big picture before the details, and you naturally synthesize information from multiple sources into a cohesive understanding.',
};

type Phase = 'questions' | 'line' | 'summary';

export default function AssessmentScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('questions');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  function selectAnswer(optionIndex: number) {
    setAnswers({ ...answers, [questionIndex]: optionIndex });
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setPhase('line');
    }
  }

  function selectLine(line: string) {
    setSelectedLine(line);
    setPhase('summary');
  }

  function restart() {
    setPhase('questions');
    setQuestionIndex(0);
    setAnswers({});
    setSelectedLine(null);
  }

  if (phase === 'questions') {
    const q = QUESTIONS[questionIndex];
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.progress}>
          Question {questionIndex + 1} of {QUESTIONS.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.question}>{q.text}</Text>
        {q.options.map((option, i) => (
          <Pressable key={i} style={styles.optionCard} onPress={() => selectAnswer(i)}>
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  }

  if (phase === 'line') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Select Your Line</Text>
        <Text style={styles.subtitle}>
          This helps us tailor your profile to your life stage.
        </Text>
        {LINES.map((line) => (
          <Pressable key={line} style={styles.lineCard} onPress={() => selectLine(line)}>
            <Text style={styles.lineText}>{line}</Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  }

  // Summary phase
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.parserName}>{PARSER_SUMMARY.name}</Text>
      <Text style={styles.parserDescription}>{PARSER_SUMMARY.description}</Text>

      <View style={styles.divider} />
      <Text style={styles.confirmHeading}>Is this you?</Text>

      <Pressable style={styles.confirmOption} onPress={restart}>
        <Text style={styles.confirmNumber}>1.</Text>
        <Text style={styles.confirmLabel}>Not at all</Text>
        <Text style={styles.confirmHint}>Restart assessment</Text>
      </Pressable>

      <Pressable
        style={styles.confirmOption}
        onPress={() => {
          /* Show restart or continue choice */
        }}
      >
        <Text style={styles.confirmNumber}>2.</Text>
        <Text style={styles.confirmLabel}>Maybe</Text>
        <Text style={styles.confirmHint}>Restart or continue</Text>
      </Pressable>

      <Pressable style={styles.confirmOption} onPress={() => router.push('/paywall')}>
        <Text style={styles.confirmNumber}>3.</Text>
        <Text style={styles.confirmLabel}>This is Me 100%</Text>
        <Text style={styles.confirmHint}>Continue to unlock your profile</Text>
      </Pressable>
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
  progress: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: spacing.xl,
  },
  progressFill: {
    height: 3,
    backgroundColor: colors.gold,
    borderRadius: 2,
  },
  question: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.dark,
    lineHeight: 34,
    marginBottom: spacing.xl,
  },
  optionCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingVertical: 18,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  optionText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
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
  lineCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: borderRadius.lg,
    paddingVertical: 22,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  lineText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 18,
    color: colors.gold,
  },
  parserName: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.gold,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  parserDescription: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  confirmHeading: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  confirmOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingVertical: 18,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  confirmNumber: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.gold,
    marginRight: spacing.md,
  },
  confirmLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  confirmHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
});
