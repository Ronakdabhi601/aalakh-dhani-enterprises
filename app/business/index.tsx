import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { BrandHeader, Card, EntryRow, SectionHeader, useGoBack } from '@/components/business/ui';
import {
  ENTRY_TYPES,
  currentMonthKey,
  formatINR,
  loadAllEntries,
  monthLabel,
  totalsFor,
  type BusinessEntry,
} from '@/lib/business-data';
import { BIZ } from '@/lib/business-theme';

const QUICK_ACTIONS = [
  { id: 'services', label: 'Services', icon: '▦', route: '/business/services' },
  { id: 'emi', label: 'Calculate EMI', icon: '₹', route: '/business/emi-calculator' },
  { id: 'transactions', label: 'Transactions', icon: '↕', route: '/business/transactions' },
  { id: 'reports', label: 'Reports', icon: '▤', route: '/business/reports' },
];

const INCOME_TYPES = ENTRY_TYPES.filter((t) => t.direction === 'in');

export default function BusinessHomeScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const [entries, setEntries] = useState<BusinessEntry[]>([]);
  const month = currentMonthKey();

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadAllEntries().then((list) => {
        if (active) setEntries(list);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const totals = totalsFor(entries, month);
  const recent = entries.slice(0, 2);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <BrandHeader
          title="Business Finance"
          subtitle="Keep track of your business activity."
          onBack={goBack}
        />

        <View style={styles.body}>
          <SectionHeader title="This month" tag={monthLabel(month)} />
          <View style={styles.row}>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>↗ Total income</Text>
              <Text style={styles.summaryValue}>₹{formatINR(totals.income)}</Text>
            </Card>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>↘ Total expenses</Text>
              <Text style={[styles.summaryValue, { color: BIZ.expense }]}>
                ₹{formatINR(totals.expense)}
              </Text>
            </Card>
          </View>

          <SectionHeader title="Quick actions" />
          <View style={styles.grid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.gridItem}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.8}
              >
                <Card style={styles.gridCard}>
                  <View style={styles.iconBox}>
                    <Text style={styles.iconText}>{action.icon}</Text>
                  </View>
                  <Text style={styles.gridLabel}>{action.label}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            {INCOME_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={styles.miniItem}
                onPress={() =>
                  router.push({ pathname: '/business/transactions', params: { addType: type.id } } as any)
                }
                activeOpacity={0.8}
              >
                <Card style={styles.miniCard}>
                  <View style={styles.iconBox}>
                    <Text style={styles.iconText}>{type.icon}</Text>
                  </View>
                  <Text style={styles.miniLabel} numberOfLines={1}>
                    {type.label}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          <SectionHeader
            title="Recent activity"
            action="View all →"
            onAction={() => router.push('/business/transactions' as any)}
          />
          {recent.map((entry) => (
            <EntryRow key={entry.id} entry={entry} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BIZ.cream,
  },
  content: {
    paddingBottom: 32,
  },
  body: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    gap: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: BIZ.muted,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: BIZ.income,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 12,
  },
  gridItem: {
    width: '48%',
  },
  gridCard: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 22,
  },
  gridLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: BIZ.text,
  },
  miniItem: {
    flex: 1,
  },
  miniCard: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  miniLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: BIZ.text,
    textAlign: 'center',
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
});
