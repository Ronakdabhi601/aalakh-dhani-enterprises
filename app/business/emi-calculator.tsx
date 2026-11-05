import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { BrandHeader, Card, SectionHeader, useGoBack } from '@/components/business/ui';
import { formatINR } from '@/lib/business-data';
import { calculateEMI, calculateTotalPayable } from '@/lib/finance-utils';
import { BIZ } from '@/lib/business-theme';

const TENURES = [6, 12, 18, 24, 36];

interface EmiResult {
  emi: number;
  total: number;
  interest: number;
}

/**
 * Reducing-balance EMI. The annual rate is converted to a monthly rate
 * (annual / 12), which is what calculateEMI expects in percent.
 */
function computeEmi(amountInput: string, rateInput: string, months: number): EmiResult | null {
  const principal = Number(amountInput.replace(/,/g, '').trim());
  const annualRate = Number(rateInput.trim());
  if (!Number.isFinite(principal) || principal <= 0) return null;
  if (!Number.isFinite(annualRate) || annualRate < 0) return null;

  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) {
    return { emi: principal / months, total: principal, interest: 0 };
  }
  const emi = calculateEMI(principal, monthlyRate, months);
  const total = calculateTotalPayable(principal, monthlyRate, months);
  return { emi, total, interest: total - principal };
}

export default function EmiCalculatorScreen() {
  const goBack = useGoBack();
  const [amount, setAmount] = useState('200000');
  const [rate, setRate] = useState('12');
  const [tenure, setTenure] = useState(36);
  const [result, setResult] = useState<EmiResult | null>(() => computeEmi('200000', '12', 36));
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = () => {
    const next = computeEmi(amount, rate, tenure);
    if (!next) {
      setError('Enter a valid loan amount and interest rate.');
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
          title="Loan & EMI Calculator"
          subtitle="Estimate monthly payments and total interest."
          onBack={goBack}
        />

        <View style={styles.body}>
          <SectionHeader title="Loan & EMI calculator" />
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

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>Interest rate (% p.a.)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  value={rate}
                  onChangeText={setRate}
                  placeholder="12"
                  placeholderTextColor={BIZ.muted}
                />
              </View>
              <View style={styles.flex1}>
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
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>ESTIMATED MONTHLY EMI</Text>
              <Text style={styles.resultValue}>
                {result ? `₹${formatINR(Math.round(result.emi))}` : '—'}
              </Text>
              {result ? (
                <Text style={styles.resultMeta}>
                  {`Total repayment ₹${formatINR(Math.round(result.total))} · Interest ₹${formatINR(
                    Math.round(result.interest),
                  )}`}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleUpdate} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Update estimate</Text>
            </TouchableOpacity>
          </Card>

          <Text style={styles.disclaimer}>
            Illustrative estimate using monthly reducing-balance interest. Actual lender charges, fees, taxes and
            terms may differ.
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
    gap: 6,
  },
  tenureChip: {
    paddingHorizontal: 10,
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
