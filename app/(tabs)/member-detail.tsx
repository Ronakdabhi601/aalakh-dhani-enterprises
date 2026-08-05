import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/lib/i18n-context';
import { useColors } from '@/hooks/use-colors';

interface MemberAccount {
  id: number;
  name: string;
  mobileNumber: string;
  email?: string;
  address?: string;
  savings: {
    totalSavings: number;
    monthlyDeposit: number;
    profitEarned: number;
    roi: number;
  };
  loans: {
    loanId: string;
    loanAmount: number;
    remainingBalance: number;
    monthlyEMI: number;
    totalPaid: number;
  }[];
  payments: {
    id: string;
    date: string;
    amount: number;
    method: string;
  }[];
}

export default function MemberDetailScreen() {
  const { t } = useI18n();
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams();
  const memberId = params.id as string;

  // Mock data - replace with real API call
  const [member, setMember] = useState<MemberAccount>({
    id: parseInt(memberId) || 1,
    name: 'Rajesh Kumar',
    mobileNumber: '9876543210',
    email: 'rajesh@example.com',
    address: '123 Main Street, City',
    savings: {
      totalSavings: 12000,
      monthlyDeposit: 1000,
      profitEarned: 2400,
      roi: 20,
    },
    loans: [
      {
        loanId: 'LOAN-001',
        loanAmount: 100000,
        remainingBalance: 65000,
        monthlyEMI: 5500,
        totalPaid: 35000,
      },
    ],
    payments: [
      {
        id: 'PAY-001',
        date: '2026-06-01',
        amount: 5500,
        method: 'cash',
      },
      {
        id: 'PAY-002',
        date: '2026-05-01',
        amount: 5500,
        method: 'cash',
      },
    ],
  });

  const [editMode, setEditMode] = useState(false);
  const [showEditSavings, setShowEditSavings] = useState(false);
  const [showEditLoan, setShowEditLoan] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);

  const [editData, setEditData] = useState({
    name: member.name,
    email: member.email || '',
    address: member.address || '',
  });

  const [savingsData, setSavingsData] = useState({
    totalSavings: member.savings.totalSavings.toString(),
    monthlyDeposit: member.savings.monthlyDeposit.toString(),
    profitEarned: member.savings.profitEarned.toString(),
  });

  const [loanData, setLoanData] = useState({
    loanAmount: member.loans[0]?.loanAmount.toString() || '',
    remainingBalance: member.loans[0]?.remainingBalance.toString() || '',
    monthlyEMI: member.loans[0]?.monthlyEMI.toString() || '',
    totalPaid: member.loans[0]?.totalPaid.toString() || '',
  });

  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'cash',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSaveProfile = () => {
    setMember({
      ...member,
      name: editData.name,
      email: editData.email,
      address: editData.address,
    });
    setEditMode(false);
    Alert.alert(t('common.success'), 'Member profile updated successfully');
  };

  const handleSaveSavings = () => {
    setMember({
      ...member,
      savings: {
        ...member.savings,
        totalSavings: parseInt(savingsData.totalSavings) || 0,
        monthlyDeposit: parseInt(savingsData.monthlyDeposit) || 0,
        profitEarned: parseInt(savingsData.profitEarned) || 0,
      },
    });
    setShowEditSavings(false);
    Alert.alert(t('common.success'), 'Savings updated successfully');
  };

  const handleSaveLoan = () => {
    if (member.loans.length > 0) {
      const updatedLoans = [...member.loans];
      updatedLoans[0] = {
        ...updatedLoans[0],
        loanAmount: parseInt(loanData.loanAmount) || 0,
        remainingBalance: parseInt(loanData.remainingBalance) || 0,
        monthlyEMI: parseInt(loanData.monthlyEMI) || 0,
        totalPaid: parseInt(loanData.totalPaid) || 0,
      };
      setMember({
        ...member,
        loans: updatedLoans,
      });
    }
    setShowEditLoan(false);
    Alert.alert(t('common.success'), 'Loan updated successfully');
  };

  const handleAddPayment = () => {
    if (!paymentData.amount) {
      Alert.alert(t('common.error'), 'Please enter payment amount');
      return;
    }

    const newPayment = {
      id: `PAY-${Date.now()}`,
      date: paymentData.date,
      amount: parseInt(paymentData.amount),
      method: paymentData.method,
    };

    setMember({
      ...member,
      payments: [newPayment, ...member.payments],
    });

    setPaymentData({
      amount: '',
      method: 'cash',
      date: new Date().toISOString().split('T')[0],
    });
    setShowAddPayment(false);
    Alert.alert(t('common.success'), 'Payment recorded successfully');
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="px-6 py-6 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-2xl">←</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground">Member Account</Text>
            <TouchableOpacity
              onPress={() => setEditMode(!editMode)}
              className={`px-4 py-2 rounded-lg ${editMode ? 'bg-red-500' : 'bg-blue-500'}`}
            >
              <Text className="text-white font-semibold text-sm">
                {editMode ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Member Profile Section */}
          <View className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 gap-4">
            <Text className="text-white font-bold text-xl">{member.name}</Text>
            <View className="gap-2">
              <Text className="text-white/80">📱 {member.mobileNumber}</Text>
              {member.email && <Text className="text-white/80">📧 {member.email}</Text>}
              {member.address && <Text className="text-white/80">📍 {member.address}</Text>}
            </View>
          </View>

          {editMode && (
            <View className="bg-surface border border-border rounded-lg p-4 gap-3">
              <TextInput
                placeholder="Name"
                value={editData.name}
                onChangeText={(text) => setEditData({ ...editData, name: text })}
                className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
              />
              <TextInput
                placeholder="Email"
                value={editData.email}
                onChangeText={(text) => setEditData({ ...editData, email: text })}
                className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
              />
              <TextInput
                placeholder="Address"
                value={editData.address}
                onChangeText={(text) => setEditData({ ...editData, address: text })}
                multiline
                numberOfLines={3}
                className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
              />
              <TouchableOpacity
                onPress={handleSaveProfile}
                className="bg-primary rounded-lg py-3"
              >
                <Text className="text-white font-semibold text-center">Save Profile</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Savings Account Section */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-foreground">Savings Account</Text>
              <TouchableOpacity
                onPress={() => setShowEditSavings(true)}
                className="bg-blue-100 px-3 py-1 rounded"
              >
                <Text className="text-blue-700 font-semibold text-xs">Edit</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-green-500 rounded-lg p-4 gap-3">
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-white/80 text-sm">Total Savings</Text>
                  <Text className="text-white font-bold text-2xl">
                    ₹{member.savings.totalSavings.toLocaleString()}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-white/80 text-sm">ROI</Text>
                  <Text className="text-white font-bold text-2xl">
                    {member.savings.roi}%
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between pt-3 border-t border-white/20">
                <View>
                  <Text className="text-white/80 text-xs">Monthly Deposit</Text>
                  <Text className="text-white font-semibold">
                    ₹{member.savings.monthlyDeposit.toLocaleString()}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-white/80 text-xs">Profit Earned</Text>
                  <Text className="text-white font-semibold">
                    ₹{member.savings.profitEarned.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Loan Section */}
          {member.loans.length > 0 && (
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-foreground">Loan Account</Text>
                <TouchableOpacity
                  onPress={() => setShowEditLoan(true)}
                  className="bg-blue-100 px-3 py-1 rounded"
                >
                  <Text className="text-blue-700 font-semibold text-xs">Edit</Text>
                </TouchableOpacity>
              </View>

              <View className="bg-primary rounded-lg p-4 gap-3">
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-white/80 text-sm">Loan Amount</Text>
                    <Text className="text-white font-bold text-xl">
                      ₹{member.loans[0].loanAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-white/80 text-sm">Remaining</Text>
                    <Text className="text-white font-bold text-xl">
                      ₹{member.loans[0].remainingBalance.toLocaleString()}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between pt-3 border-t border-white/20">
                  <View>
                    <Text className="text-white/80 text-xs">Monthly EMI</Text>
                    <Text className="text-white font-semibold">
                      ₹{member.loans[0].monthlyEMI.toLocaleString()}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-white/80 text-xs">Total Paid</Text>
                    <Text className="text-white font-semibold">
                      ₹{member.loans[0].totalPaid.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Payment History Section */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-foreground">Payment History</Text>
              <TouchableOpacity
                onPress={() => setShowAddPayment(true)}
                className="bg-green-100 px-3 py-1 rounded"
              >
                <Text className="text-green-700 font-semibold text-xs">+ Add</Text>
              </TouchableOpacity>
            </View>

            {member.payments.map((payment) => (
              <View key={payment.id} className="bg-surface border border-border rounded-lg p-3">
                <View className="flex-row justify-between mb-1">
                  <Text className="font-semibold text-foreground">{payment.date}</Text>
                  <Text className="font-bold text-green-600">+₹{payment.amount}</Text>
                </View>
                <Text className="text-xs text-muted capitalize">{payment.method}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Edit Savings Modal */}
      <Modal visible={showEditSavings} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-2xl p-6 gap-4">
            <Text className="text-2xl font-bold text-foreground">Edit Savings</Text>

            <TextInput
              placeholder="Total Savings"
              value={savingsData.totalSavings}
              onChangeText={(text) => setSavingsData({ ...savingsData, totalSavings: text })}
              keyboardType="numeric"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />

            <TextInput
              placeholder="Monthly Deposit"
              value={savingsData.monthlyDeposit}
              onChangeText={(text) => setSavingsData({ ...savingsData, monthlyDeposit: text })}
              keyboardType="numeric"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />

            <TextInput
              placeholder="Profit Earned"
              value={savingsData.profitEarned}
              onChangeText={(text) => setSavingsData({ ...savingsData, profitEarned: text })}
              keyboardType="numeric"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowEditSavings(false)}
                className="flex-1 bg-surface border border-border rounded-lg py-3"
              >
                <Text className="text-foreground font-semibold text-center">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveSavings}
                className="flex-1 bg-primary rounded-lg py-3"
              >
                <Text className="text-white font-semibold text-center">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Loan Modal */}
      <Modal visible={showEditLoan} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-2xl p-6 gap-4">
            <Text className="text-2xl font-bold text-foreground">Edit Loan</Text>

            <TextInput
              placeholder="Loan Amount"
              value={loanData.loanAmount}
              onChangeText={(text) => setLoanData({ ...loanData, loanAmount: text })}
              keyboardType="numeric"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />

            <TextInput
              placeholder="Remaining Balance"
              value={loanData.remainingBalance}
              onChangeText={(text) => setLoanData({ ...loanData, remainingBalance: text })}
              keyboardType="numeric"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />

            <TextInput
              placeholder="Monthly EMI"
              value={loanData.monthlyEMI}
              onChangeText={(text) => setLoanData({ ...loanData, monthlyEMI: text })}
              keyboardType="numeric"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />

            <TextInput
              placeholder="Total Paid"
              value={loanData.totalPaid}
              onChangeText={(text) => setLoanData({ ...loanData, totalPaid: text })}
              keyboardType="numeric"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowEditLoan(false)}
                className="flex-1 bg-surface border border-border rounded-lg py-3"
              >
                <Text className="text-foreground font-semibold text-center">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveLoan}
                className="flex-1 bg-primary rounded-lg py-3"
              >
                <Text className="text-white font-semibold text-center">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Payment Modal */}
      <Modal visible={showAddPayment} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-2xl p-6 gap-4">
            <Text className="text-2xl font-bold text-foreground">Add Payment</Text>

            <TextInput
              placeholder="Amount"
              value={paymentData.amount}
              onChangeText={(text) => setPaymentData({ ...paymentData, amount: text })}
              keyboardType="numeric"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />

            <TextInput
              placeholder="Date (YYYY-MM-DD)"
              value={paymentData.date}
              onChangeText={(text) => setPaymentData({ ...paymentData, date: text })}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />

            <View className="bg-surface border border-border rounded-lg px-4 py-3">
              <Text className="text-foreground text-sm mb-2">Payment Method</Text>
              <View className="flex-row gap-2">
                {['cash', 'check', 'transfer'].map((method) => (
                  <TouchableOpacity
                    key={method}
                    onPress={() => setPaymentData({ ...paymentData, method })}
                    className={`flex-1 py-2 rounded ${
                      paymentData.method === method ? 'bg-primary' : 'bg-background'
                    }`}
                  >
                    <Text
                      className={`text-center text-sm font-semibold ${
                        paymentData.method === method ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowAddPayment(false)}
                className="flex-1 bg-surface border border-border rounded-lg py-3"
              >
                <Text className="text-foreground font-semibold text-center">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddPayment}
                className="flex-1 bg-primary rounded-lg py-3"
              >
                <Text className="text-white font-semibold text-center">Add Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
