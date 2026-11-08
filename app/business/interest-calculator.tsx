import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { BrandHeader, Card, SectionHeader, useGoBack } from '@/components/business/ui';
import { formatINR } from '@/lib/business-data';
import { BIZ } from '@/lib/business-theme';

const TENURES = [3, 6, 12, 18, 24, 36];

interface InterestResult {
  monthlyInterest: number;
  totalInterest: number;
  totalPayable: number;
}

/**
 * Simple interest, calculated on the full principal for every month:
 * interest = principal × (monthly rate / 100) × months
 */
function computeInterest(amountInput: string, rateInput: string, months: number): InterestResult | null {
  const principal = Number(amountInput.replace(/,/g, '').trim());
  const monthlyRate = Number(rateInput.trim());
  if (!Number.isFinite(principal) || principal <= 0) return null;
  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) return null;

  const monthlyInterest = principal * (monthlyRate / 100);
  const totalInterest = monthlyInterest * months;
  return {
    monthlyInterest,
    totalInterest,
    totalPayable: principal + totalInterest,
  };
}

export default function InterestCalculatorScreen() {
  const goBack = useGoBack();
  const [amount, setAmount] = useState('100000');
  const [rate, setRate] = useState('2');
  const [tenure, setTenure] = useState(12);
  const [result, setResult] = useState<InterestResult | null>(() => computeInterest('100000', '2', 12));
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    const next = computeInterest(amount, rate, tenure);
    if (!next) {
      setError('Enter a valid loan amount and monthly interest rate.');
      setResult(null);
      return;
    }
    setError(null);
    setResult(next);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <BrandHeader
          title="Interest Calculator"
          subtitle="Calculate the interest only, on the full loan amount."
          onBack={goBack}
        />

        <View style={styles.body}>
          <SectionHeader title="Interest calculator" />
          <Card style={styles.formCard}>
            <Text style={styles.label}>Loan amount (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor={BIZ.muted}
            />

            <Text style={styles.label}>Interest rate (% per month)</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={rate}
              onChangeText={setRate}
              placeholder="2"
              placeholderTextColor={BIZ.muted}
            />

            <Text style={styles.label}>Tenure</Text>
            <View style={styles.tenureWrap}>
              {TENURES.map((months) => {
                const active = tenure === months;
                return (
                  <TouchableOpacity
                    key={months}
                    style={[styles.tenureChip, active && styles.tenureChipActive]}
                    onPress={() => setTenure(months)}
                  >
                    <Text style={[styles.tenureText, active && styles.tenureTextActive]}>
                      {`${months} mo`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>TOTAL INTEREST</Text>
              <Text style={styles.resultValue}>
                {result ? `₹${formatINR(Math.round(result.totalInterest))}` : '—'}
              </Text>
              {result ? (
                <Text style={styles.resultMeta}>
                  {`Per month ₹${formatINR(Math.round(result.monthlyInterest))} · Total payable ₹${formatINR(
                    Math.round(result.totalPayable),
                  )}`}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleCalculate} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Calculate interest</Text>
            </TouchableOpacity>
          </Card>

          <Text style={styles.disclaimer}>
            Simple interest: the monthly rate is applied to the full loan amount every month. Actual lender charges,
            fees, taxes and terms may differ.
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
  tenureWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tenureChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BIZ.border,
    backgroundColor: BIZ.white,
  },
  tenureChipActive: {
    backgroundColor: BIZ.green,
    borderColor: BIZ.green,
  },
  tenureText: {
    fontSize: 13,
    fontWeight: '600',
    color: BIZ.text,
  },
  tenureTextActive: {
    color: BIZ.white,
  },
  errorText: {
    color: BIZ.expense,
    fontSize: 13,
    marginTop: 10,
  },
  resultBox: {
    backgroundColor: BIZ.greenSoft,
    borderRadius: 18,
    padding: 18,
    marginTop: 18,
    gap: 6,
  },
  resultLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
    color: BIZ.muted,
  },
  resultValue: {
    fontSize: 34,
    fontWeight: '800',
    color: BIZ.green,
  },
  resultMeta: {
    fontSize: 13,
    color: BIZ.muted,
    lineHeight: 19,
  },
  button: {
    backgroundColor: BIZ.green,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: BIZ.white,
    fontSize: 16,
    fontWeight: '700',
  },
  disclaimer: {
    color: BIZ.muted,
    fontSize: 12,
    marginTop: 12,
    lineHeight: 18,
  },
});
