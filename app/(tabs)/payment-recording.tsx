import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/lib/i18n-context';
import { useColors } from '@/hooks/use-colors';

interface Loan {
  id: number;
  memberId: number;
  memberName: string;
  loanAmount: number;
  monthlyEMI: number;
  remainingBalance: number;
  status: string;
}

interface Payment {
  id: number;
  loanId: number;
  amount: number;
  paymentDate: string;
  receiptNumber: string;
}

export default function PaymentRecordingScreen() {
  const { t } = useI18n();
  const colors = useColors();

  const [loans, setLoans] = useState<Loan[]>([
    {
      id: 1,
      memberId: 1,
      memberName: 'Rajesh Kumar',
      loanAmount: 50000,
      monthlyEMI: 2500,
      remainingBalance: 35000,
      status: 'approved',
    },
    {
      id: 2,
      memberId: 2,
      memberName: 'Priya Singh',
      loanAmount: 75000,
      monthlyEMI: 3750,
      remainingBalance: 50000,
      status: 'approved',
    },
  ]);

  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);

  const handleRecordPayment = async () => {
    if (!selectedLoan || !paymentAmount) {
      Alert.alert(t('common.error'), 'Please select a loan and enter payment amount');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount <= 0) {
      Alert.alert(t('common.error'), 'Payment amount must be greater than 0');
      return;
    }

    if (amount > selectedLoan.remainingBalance) {
      Alert.alert(t('common.error'), 'Payment amount exceeds remaining balance');
      return;
    }

    setIsLoading(true);
    try {
      // Generate receipt number
      const receiptNumber = `RCP-${Date.now()}`;

      // Create payment record
      const newPayment: Payment = {
        id: payments.length + 1,
        loanId: selectedLoan.id,
        amount,
        paymentDate: new Date().toISOString().split('T')[0],
        receiptNumber,
      };

      // Update loan remaining balance
      const updatedLoans = loans.map(loan =>
        loan.id === selectedLoan.id
          ? { ...loan, remainingBalance: loan.remainingBalance - amount }
          : loan
      );

      setPayments([...payments, newPayment]);
      setLoans(updatedLoans);
      setSelectedLoan(null);
      setPaymentAmount('');
      setNotes('');

      // Show success with receipt number
      Alert.alert(
        t('common.success'),
        `Payment recorded successfully!\n\nReceipt: ${receiptNumber}\nAmount: ₹${amount.toFixed(2)}`
      );

      // Generate PDF receipt
      generatePDFReceipt(newPayment, selectedLoan);
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to record payment');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDFReceipt = (payment: Payment, loan: Loan) => {
    // TODO: Implement PDF generation using react-native-pdf or similar
    console.log('Generating PDF receipt:', payment, loan);
    Alert.alert('Receipt', `PDF Receipt would be generated for ${payment.receiptNumber}`);
  };

  const renderLoanItem = (loan: Loan) => (
    <TouchableOpacity
      onPress={() => setSelectedLoan(loan)}
      className={`bg-surface border-2 rounded-lg p-4 mb-3 ${
        selectedLoan?.id === loan.id ? 'border-primary' : 'border-border'
      }`}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">{loan.memberName}</Text>
          <Text className="text-sm text-muted">Loan ID: {loan.id}</Text>
        </View>
        <View className="bg-green-100 px-3 py-1 rounded-full">
          <Text className="text-green-700 font-semibold text-xs">
            {loan.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="gap-2">
        <View className="flex-row justify-between">
          <Text className="text-sm text-muted">Monthly EMI:</Text>
          <Text className="text-sm font-semibold text-foreground">₹{loan.monthlyEMI}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-muted">Remaining Balance:</Text>
          <Text className="text-sm font-semibold text-foreground">₹{loan.remainingBalance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="px-6 py-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              {t('payment.recordPayment')}
            </Text>
            <Text className="text-base text-muted">
              Select a loan and record the EMI payment
            </Text>
          </View>

          {/* Loans List */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              {t('common.selectLoan')}
            </Text>
            <FlatList
              data={loans}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderLoanItem(item)}
              scrollEnabled={false}
            />
          </View>

          {/* Payment Form */}
          {selectedLoan && (
            <View className="bg-surface border border-border rounded-lg p-4 gap-4">
              <Text className="text-lg font-semibold text-foreground">
                Payment Details
              </Text>

              {/* Payment Amount */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">
                  Payment Amount (₹)
                </Text>
                <TextInput
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                  keyboardType="decimal-pad"
                  editable={!isLoading}
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                />
                <Text className="text-xs text-muted">
                  EMI: ₹{selectedLoan.monthlyEMI} | Remaining: ₹{selectedLoan.remainingBalance}
                </Text>
              </View>

              {/* Payment Method */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">
                  Payment Method
                </Text>
                <View className="flex-row gap-3">
                  {['cash', 'check', 'transfer'].map((method) => (
                    <TouchableOpacity
                      key={method}
                      onPress={() => setPaymentMethod(method)}
                      className={`flex-1 py-2 px-3 rounded-lg border ${
                        paymentMethod === method
                          ? 'bg-primary border-primary'
                          : 'bg-background border-border'
                      }`}
                    >
                      <Text
                        className={`text-center font-semibold text-sm ${
                          paymentMethod === method
                            ? 'text-white'
                            : 'text-foreground'
                        }`}
                      >
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Notes */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">
                  Notes (Optional)
                </Text>
                <TextInput
                  placeholder="Add any notes..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  editable={!isLoading}
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                />
              </View>

              {/* Record Payment Button */}
              <TouchableOpacity
                onPress={handleRecordPayment}
                disabled={isLoading}
                className="bg-primary rounded-lg py-4 items-center mt-4"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-base">
                  {isLoading ? 'Recording...' : 'Record Payment & Generate Receipt'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Recent Payments */}
          {payments.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">
                Recent Payments
              </Text>
              {payments.map((payment) => (
                <View
                  key={payment.id}
                  className="bg-surface border border-border rounded-lg p-4"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View>
                      <Text className="text-base font-semibold text-foreground">
                        ₹{payment.amount.toFixed(2)}
                      </Text>
                      <Text className="text-xs text-muted">
                        {payment.paymentDate}
                      </Text>
                    </View>
                    <Text className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {payment.receiptNumber}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
