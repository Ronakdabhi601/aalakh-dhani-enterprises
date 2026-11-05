import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BrandHeader, Card, EntryRow, SectionHeader, useGoBack } from '@/components/business/ui';
import {
  ENTRY_TYPES,
  currentMonthKey,
  formatDisplayDate,
  formatINR,
  getEntryType,
  getSampleEntries,
  loadSavedEntries,
  parseDisplayDate,
  saveEntries,
  sortEntries,
  todayIso,
  totalsFor,
  type BusinessEntry,
} from '@/lib/business-data';
import { BIZ } from '@/lib/business-theme';

type Filter = 'all' | 'in' | 'out';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'in', label: 'Income' },
  { id: 'out', label: 'Expenses' },
];

export default function TransactionsScreen() {
  const goBack = useGoBack();
  const params = useLocalSearchParams<{ addType?: string }>();
  const addTypeParam = typeof params.addType === 'string' ? params.addType : undefined;

  const samples = useMemo(() => getSampleEntries(), []);
  const [saved, setSaved] = useState<BusinessEntry[]>([]);

  const [typeId, setTypeId] = useState<string>(ENTRY_TYPES[0].id);
  const [typeOpen, setTypeOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => formatDisplayDate(todayIso()));
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadSavedEntries().then((list) => {
        if (active) setSaved(list);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  // Opened from a quick action with a type already chosen (e.g. "આવેલો હપ્તો").
  useEffect(() => {
    if (addTypeParam && ENTRY_TYPES.some((t) => t.id === addTypeParam)) {
      setTypeId(addTypeParam);
    }
  }, [addTypeParam]);

  const all = useMemo(() => sortEntries([...samples, ...saved]), [samples, saved]);
  const totals = totalsFor(all, currentMonthKey());

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((entry) => {
      const type = getEntryType(entry.typeId);
      if (filter === 'in' && type.direction !== 'in') return false;
      if (filter === 'out' && type.direction !== 'out') return false;
      if (!q) return true;
      return [entry.name, type.label, type.hint, String(entry.amount), formatDisplayDate(entry.date)]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [all, filter, query]);

  const selectedType = getEntryType(typeId);

  const handleSave = async () => {
    setNotice(null);
    const numericAmount = Number(amount.replace(/,/g, '').trim());
    if (!typeId) {
      setFormError('Please select a type.');
      return;
    }
    if (!amount.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setFormError('Enter a valid amount.');
      return;
    }
    const isoDate = parseDisplayDate(date);
    if (!isoDate) {
      setFormError('Use date format DD/MM/YYYY.');
      return;
    }

    const entry: BusinessEntry = {
      id: `entry-${Date.now()}`,
      typeId,
      name: name.trim(),
      amount: numericAmount,
      date: isoDate,
    };
    const next = [entry, ...saved];
    setSaved(next);
    try {
      await saveEntries(next);
      setName('');
      setAmount('');
      setFormError(null);
      setNotice('Entry saved on this phone.');
    } catch (error) {
      console.error('Failed to save entry:', error);
      setSaved(saved);
      setFormError('Could not save. Please try again.');
    }
  };

  const handleDelete = (entry: BusinessEntry) => {
    Alert.alert('Delete entry', 'Remove this entry from this phone?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const next = saved.filter((e) => e.id !== entry.id);
          setSaved(next);
          try {
            await saveEntries(next);
          } catch (error) {
            console.error('Failed to delete entry:', error);
            setSaved(saved);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <BrandHeader
          title="Transactions"
          subtitle="Keep track of your business activity."
          onBack={goBack}
        />

        <View style={styles.body}>
          <View style={styles.row}>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Money received</Text>
              <Text style={[styles.summaryValue, { color: BIZ.income }]}>₹{formatINR(totals.income)}</Text>
              <Text style={[styles.summaryHint, { color: BIZ.income }]}>This month</Text>
            </Card>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Money spent</Text>
              <Text style={[styles.summaryValue, { color: BIZ.expense }]}>₹{formatINR(totals.expense)}</Text>
              <Text style={[styles.summaryHint, { color: BIZ.expense }]}>This month</Text>
            </Card>
          </View>

          <SectionHeader title="Add new entry" tag="SAVED ON THIS PHONE" />
          <Card style={styles.formCard}>
            <Text style={styles.label}>Type</Text>
            <TouchableOpacity
              style={styles.select}
              onPress={() => setTypeOpen((open) => !open)}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <Text style={styles.selectText}>{`${selectedType.label} (${selectedType.hint})`}</Text>
              <Text style={styles.chevron}>{typeOpen ? '⌃' : '⌄'}</Text>
            </TouchableOpacity>
            {typeOpen ? (
              <View style={styles.options}>
                {ENTRY_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.option, type.id === typeId && styles.optionActive]}
                    onPress={() => {
                      setTypeId(type.id);
                      setTypeOpen(false);
                    }}
                  >
                    <Text style={[styles.optionText, type.id === typeId && styles.optionTextActive]}>
                      {`${type.label} (${type.hint})`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}

            <Text style={styles.label}>Name / details</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ramesh bhai"
              placeholderTextColor={BIZ.muted}
              value={name}
              onChangeText={setName}
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>Amount (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={BIZ.muted}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
              <View style={styles.flex1}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={BIZ.muted}
                  maxLength={10}
                  value={date}
                  onChangeText={setDate}
                />
              </View>
            </View>

            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
            {notice ? <Text style={styles.noticeText}>{notice}</Text> : null}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveButtonText}>Save entry</Text>
            </TouchableOpacity>
          </Card>

          <SectionHeader title="All activity" tag={samples.length > 0 ? 'SAMPLE DATA' : undefined} />
          <TextInput
            style={styles.search}
            placeholder="Search transactions..."
            placeholderTextColor={BIZ.muted}
            value={query}
            onChangeText={setQuery}
          />
          <View style={styles.row}>
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setFilter(f.id)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.list}>
            {visible.length === 0 ? (
              <Text style={styles.emptyText}>No transactions match your search.</Text>
            ) : (
              visible.map((entry) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  onDelete={entry.isSample ? undefined : () => handleDelete(entry)}
                />
              ))
            )}
          </View>

          <Text style={styles.disclaimer}>
            Transactions shown are sample data only. Entries you save stay on this phone and are not connected
            to a bank account or payment service.
          </Text>
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
  summaryLabel: {
    fontSize: 14,
    color: BIZ.muted,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  summaryHint: {
    fontSize: 13,
    fontWeight: '600',
  },
  formCard: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: BIZ.muted,
    marginTop: 10,
    marginBottom: 6,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: BIZ.border,
    borderRadius: 14,
    backgroundColor: BIZ.inputBg,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
    color: BIZ.text,
  },
  chevron: {
    fontSize: 16,
    color: BIZ.muted,
    marginLeft: 8,
  },
  options: {
    borderWidth: 1,
    borderColor: BIZ.border,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 6,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: BIZ.white,
  },
  optionActive: {
    backgroundColor: BIZ.greenSoft,
  },
  optionText: {
    fontSize: 15,
    color: BIZ.text,
  },
  optionTextActive: {
    color: BIZ.green,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: BIZ.border,
    borderRadius: 14,
    backgroundColor: BIZ.inputBg,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: BIZ.text,
  },
  errorText: {
    color: BIZ.expense,
    fontSize: 13,
    marginTop: 10,
  },
  noticeText: {
    color: BIZ.income,
    fontSize: 13,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: BIZ.green,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: BIZ.white,
    fontSize: 16,
    fontWeight: '700',
  },
  search: {
    backgroundColor: BIZ.white,
    borderWidth: 1,
    borderColor: BIZ.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: BIZ.text,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BIZ.border,
    backgroundColor: BIZ.white,
  },
  chipActive: {
    backgroundColor: BIZ.green,
    borderColor: BIZ.green,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: BIZ.text,
  },
  chipTextActive: {
    color: BIZ.white,
  },
  list: {
    marginTop: 14,
  },
  emptyText: {
    color: BIZ.muted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  disclaimer: {
    color: BIZ.muted,
    fontSize: 12,
    marginTop: 12,
    lineHeight: 18,
  },
});
