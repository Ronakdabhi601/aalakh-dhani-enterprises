import { useCallback, type ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { BIZ, BRAND_NAME, BRAND_TAGLINE } from '@/lib/business-theme';
import { formatDisplayDate, formatINR, getEntryType, type BusinessEntry } from '@/lib/business-data';

/** Goes back, or to the main app if this screen was opened directly. */
export function useGoBack() {
  const router = useRouter();
  return useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)' as any);
    }
  }, [router]);
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

interface BrandHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function BrandHeader({ title, subtitle, onBack }: BrandHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} hitSlop={12} style={styles.backButton} accessibilityRole="button">
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        ) : null}
        <View style={styles.logo}>
          <Text style={styles.logoText}>A</Text>
        </View>
        <View style={styles.brandText}>
          <Text style={styles.brandName}>{BRAND_NAME}</Text>
          <Text style={styles.brandTagline}>{BRAND_TAGLINE}</Text>
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

interface SectionHeaderProps {
  title: string;
  tag?: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, tag, action, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {tag ? <Text style={styles.tag}>{tag}</Text> : null}
      {action && onAction ? (
        <TouchableOpacity onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function EntryRow({ entry, onDelete }: { entry: BusinessEntry; onDelete?: () => void }) {
  const type = getEntryType(entry.typeId);
  const isIn = type.direction === 'in';
  const title = entry.name.trim() || type.label;

  return (
    <Card style={styles.entryCard}>
      <View style={styles.iconBox}>
        <Text style={styles.iconText}>{type.icon}</Text>
      </View>
      <View style={styles.entryBody}>
        <Text style={styles.entryTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.entryMeta} numberOfLines={1}>
          {`${type.hint} · ${formatDisplayDate(entry.date)}`}
        </Text>
      </View>
      <View style={styles.entryRight}>
        <Text style={[styles.entryAmount, { color: isIn ? BIZ.income : BIZ.expense }]}>
          {`${isIn ? '+' : '−'}₹${formatINR(entry.amount)}`}
        </Text>
        {onDelete ? (
          <TouchableOpacity onPress={onDelete} hitSlop={8}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BIZ.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BIZ.border,
    padding: 16,
  },
  header: {
    backgroundColor: BIZ.green,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 26,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: BIZ.white,
    fontSize: 20,
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: BIZ.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: BIZ.green,
    fontSize: 22,
    fontWeight: '800',
  },
  brandText: {
    flex: 1,
  },
  brandName: {
    color: BIZ.white,
    fontSize: 17,
    fontWeight: '700',
  },
  brandTagline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  title: {
    color: BIZ.white,
    fontSize: 30,
    fontWeight: '800',
    marginTop: 22,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    marginTop: 6,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
    gap: 10,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: BIZ.text,
  },
  tag: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: BIZ.muted,
    fontWeight: '600',
  },
  action: {
    color: BIZ.green,
    fontWeight: '700',
    fontSize: 14,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: BIZ.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
    color: BIZ.green,
    fontWeight: '700',
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    marginBottom: 10,
  },
  entryBody: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BIZ.text,
  },
  entryMeta: {
    fontSize: 13,
    color: BIZ.muted,
    marginTop: 3,
  },
  entryRight: {
    alignItems: 'flex-end',
  },
  entryAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  deleteText: {
    fontSize: 12,
    color: BIZ.expense,
    fontWeight: '600',
    marginTop: 4,
  },
});
