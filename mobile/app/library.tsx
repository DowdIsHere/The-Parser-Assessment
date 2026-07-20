import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../constants/theme';

const PRODUCTS = [
  { name: 'Download Your Profile', price: '$10.00', note: 'One-time purchase', type: 'single' },
  { name: 'Couples Profile', price: '$49.99', note: null, type: 'catalog' },
  { name: 'Kids Profile', price: '$19.99', note: '$9.99 each additional child', type: 'catalog' },
  { name: 'Sibling Dynamic', price: '$19.99', note: null, type: 'catalog' },
  {
    name: 'Family Profile',
    price: '$99.99',
    note: 'Includes couples, up to 5 kids, sibling dynamics, and whole family profile',
    type: 'catalog',
  },
];

export default function LibraryScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Library</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Profile</Text>
        <View style={styles.productCard}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{PRODUCTS[0].name}</Text>
            <Text style={styles.productNote}>{PRODUCTS[0].note}</Text>
          </View>
          <View style={styles.priceArea}>
            <Text style={styles.productPrice}>{PRODUCTS[0].price}</Text>
            <Pressable style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Purchase</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parser Profiles</Text>
        {PRODUCTS.slice(1).map((product, i) => (
          <View key={i} style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              {product.note && <Text style={styles.productNote}>{product.note}</Text>}
            </View>
            <View style={styles.priceArea}>
              <Text style={styles.productPrice}>{product.price}</Text>
              <Pressable style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Purchase</Text>
              </Pressable>
            </View>
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
  heading: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.dark,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  productCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.sm,
  },
  productInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  productName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  productNote: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  priceArea: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.gold,
    marginBottom: spacing.sm,
  },
  buyButton: {
    backgroundColor: colors.gold,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: borderRadius.md,
  },
  buyButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.white,
    letterSpacing: 0.5,
  },
});
