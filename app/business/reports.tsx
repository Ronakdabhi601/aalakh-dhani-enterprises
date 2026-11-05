import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { BrandHeader, Card, SectionHeader, useGoBack } from '@/components/business/ui';
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

export default function ReportsScreen() {
  const goBack = useGoBack();
  const month = currentMonthKey();
  const [entries, setEntries] = useState<BusinessEntry[]>([]);

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

  const monthEntries = useMemo(() => entries.filter((e) => e.date.startsWith(month)), [entries, month]);
  const totals = totalsFor(entries, month);
  const net = totals.income - totals.expense;

  const breakdown = useMemo(
    () =>
      ENTRY_TYPES.map((type) => {
        const matching = monthEntries.filter((e) => e.typeId === type.id);
        return {
          type,
          count: matching.length,
          total: matching.reduce((sum, e) => sum + e.amount, 0),
        };
      }).filter((row) => row.count > 0),
    [monthEntries],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <BrandHeader title="Reports" subtitle="A clearer picture of your cash flow." onBack={goBack} />

        <View style={styles.body}>
          <SectionHeader title="This month" tag={monthLabel(month)} />
          <View style={styles.row}>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryValue, { color: BIZ.income }]}>₹{formatINR(totals.income)}</Text>
            </Card>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={[styles.summaryValue, { color: BIZ.expense }]}>₹{formatINR(totals.expense)}</Text>
            </Card>
          </View>
          <Card style={styles.netCard}>
            <Text style={styles.summaryLabel}>Net cash flow</Text>
            <Text style={[styles.summaryValue, { color: net >= 0 ? BIZ.income : BIZ.expense }]}>
              {`${net >= 0 ? '+' : '−'}₹${formatINR(Math.abs(net))}`}
            </Text>
          </Card>

          <SectionHeader title="By type" />
          {breakdown.length === 0 ? (
            <Text style={styles.emptyText}>No entries this month yet.</Text>
          ) : (
            breakdown.map((row) => {
              const isIn = row.type.direction === 'in';
              return (
                <Card key={row.type.id} style={styles.breakdownCard}>
                  <View style={styles.iconBox}>
                    <Text style={styles.iconText}>{row.type.icon}</Text>
                  </View>
                  <View style={styles.flex1}>
                    <Text style={styles.breakdownTitle}>{row.type.label}</Text>
                    <Text style={styles.breakdownMeta}>{`${row.type.hint} · ${row.count} entries`}</Text>
                  </View>
                  <Text style={[styles.breakdownAmount, { color: isIn ? BIZ.income : BIZ.expense }]}>
                    {`${isIn ? '+' : '−'}₹${formatINR(row.total)}`}
                  </Text>
                </Card>
              );
            })
          )}
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
  flex1: {
    flex: 1,
  },
  summaryCard: {
    flex: 1,
    gap: 6,
  },
  netCard: {
    gap: 6,
    marginTop: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: BIZ.muted,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  breakdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: BIZ.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    color: BIZ.green,
    fontWeight: '700',
  },
  breakdownTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BIZ.text,
  },
  breakdownMeta: {
    fontSize: 13,
    color: BIZ.muted,
    marginTop: 2,
  },
  breakdownAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptyText: {
    color: BIZ.muted,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
