import { View, Text, TouchableOpacity, ScrollView, RefreshControl, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/lib/i18n-context';
import { useAuth } from '@/lib/auth-context';
import { useColors } from '@/hooks/use-colors';
import { useState, useCallback } from 'react';

interface LoanStatus {
  loanId: string;
  loanAmount: number;
  remainingBalance: number;
  nextPaymentDue: string;
  daysUntilDue: number;
  totalPaid: number;
  monthlyEMI: number;
}

interface SavingsData {
  totalSavings: number;
  monthlyDeposit: number;
  profitEarned: number;
  roi: number;
  lastDepositDate: string;
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  method: string;
  receiptNumber: string;
}

export default function MemberDashboardScreen() {
  const { t } = useI18n();
  const { user, signOut } = useAuth();
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);

  const [loanStatus, setLoanStatus] = useState<LoanStatus>({
    loanId: 'LOAN-001',
    loanAmount: 100000,
    remainingBalance: 65000,
    nextPaymentDue: '2026-07-15',
    daysUntilDue: 14,
    totalPaid: 35000,
    monthlyEMI: 5500,
  });

  const [savingsData, setSavingsData] = useState<SavingsData>({
    totalSavings: 12000,
    monthlyDeposit: 1000,
    profitEarned: 2400,
    roi: 20,
    lastDepositDate: '2026-06-01',
  });

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([
    {
      id: 'PAY-001',
      date: '2026-06-01',
      amount: 5500,
      method: 'cash',
      receiptNumber: 'RCP-001',
    },
    {
      id: 'PAY-002',
      date: '2026-05-01',
      amount: 5500,
      method: 'cash',
      receiptNumber: 'RCP-002',
    },
    {
      id: 'PAY-003',
      date: '2026-04-01',
      amount: 5500,
      method: 'transfer',
      receiptNumber: 'RCP-003',
    },
  ]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    await signOut();
  };

  const getStatusColor = (days: number) => {
    if (days <= 3) return colors.error;
    if (days <= 7) return colors.warning;
    return colors.success;
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-6">
            <View>
              <Text className="text-3xl font-bold text-foreground">
                {t('member.dashboard')}
              </Text>
              <Text className="text-sm text-muted mt-1">
                Welcome, {user?.name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-error rounded-lg px-4 py-2"
            >
              <Text className="text-white text-sm font-semibold">
                {t('common.logout')}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="px-6 gap-6">
            {/* Savings Pool Card */}
            <View className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 gap-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-semibold text-lg">
                  Your Savings Pool
                </Text>
                <Text className="text-white text-2xl">🏦</Text>
              </View>

              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-white/80 text-sm">
                    Total Savings
                  </Text>
                  <Text className="text-white font-bold text-2xl">
                    ₹{savingsData.totalSavings.toLocaleString()}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-white/80 text-xs mb-1">
                      Monthly Deposit
                    </Text>
                    <Text className="text-white font-semibold">
                      ₹{savingsData.monthlyDeposit.toLocaleString()}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-white/80 text-xs mb-1">
                      Profit Earned
                    </Text>
                    <Text className="text-white font-semibold">
                      ₹{savingsData.profitEarned.toLocaleString()}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-white/80 text-xs mb-1">
                      ROI
                    </Text>
                    <Text className="text-white font-bold text-lg">
                      {savingsData.roi}%
                    </Text>
                  </View>
                </View>

                <View className="pt-3 border-t border-white/20">
                  <Text className="text-white/80 text-xs">
                    Last Deposit: {savingsData.lastDepositDate}
                  </Text>
                </View>
              </View>
            </View>

            {/* Current Loan Card */}
            <View className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 gap-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-semibold text-lg">
                  {t('member.myLoan')}
                </Text>
                <Text className="text-white text-2xl">💰</Text>
              </View>

              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-white/80 text-sm">
                    {t('member.loanAmount')}
                  </Text>
                  <Text className="text-white font-semibold">
                    ₹{loanStatus.loanAmount.toLocaleString()}
                  </Text>
                </View>

                <View className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-white"
                    style={{
                      width: `${((loanStatus.loanAmount - loanStatus.remainingBalance) / loanStatus.loanAmount) * 100}%`,
                    }}
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-white/80 text-sm">
                    {t('member.remainingBalance')}
                  </Text>
                  <Text className="text-white font-semibold">
                    ₹{loanStatus.remainingBalance.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Stats */}
            <View className="gap-3">
              <View className="flex-row gap-3">
                <View className="flex-1 bg-surface rounded-lg p-4 border border-border gap-2">
                  <Text className="text-xs text-muted font-semibold">
                    {t('member.totalPaid')}
                  </Text>
                  <Text className="text-xl font-bold text-success">
                    ₹{loanStatus.totalPaid.toLocaleString()}
                  </Text>
                </View>

                <View className="flex-1 bg-surface rounded-lg p-4 border border-border gap-2">
                  <Text className="text-xs text-muted font-semibold">
                    {t('member.monthlyEMI')}
                  </Text>
                  <Text className="text-xl font-bold text-primary">
                    ₹{loanStatus.monthlyEMI.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Next Payment Due */}
            <View
              className="rounded-lg p-4 border-2 gap-3"
              style={{ borderColor: getStatusColor(loanStatus.daysUntilDue) }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-foreground">
                  {t('member.nextPaymentDue')}
                </Text>
                <Text className="text-2xl">📅</Text>
              </View>

              <Text className="text-2xl font-bold text-foreground">
                {loanStatus.nextPaymentDue}
              </Text>

              <View className="flex-row items-center gap-2">
                <View
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getStatusColor(loanStatus.daysUntilDue) }}
                />
                <Text
                  className="text-sm font-semibold"
                  style={{ color: getStatusColor(loanStatus.daysUntilDue) }}
                >
                  {loanStatus.daysUntilDue} days remaining
                </Text>
              </View>
            </View>

            {/* Payment History */}
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-foreground">
                  {t('member.paymentHistory')}
                </Text>
                <TouchableOpacity>
                  <Text className="text-sm text-primary font-semibold">View All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={paymentHistory}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View className="bg-surface border border-border rounded-lg p-4 mb-3">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="font-semibold text-foreground">
                        {item.receiptNumber}
                      </Text>
                      <Text className="font-bold text-green-600">
                        +₹{item.amount.toLocaleString()}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-xs text-muted">{item.date}</Text>
                      <Text className="text-xs text-muted capitalize">{item.method}</Text>
                    </View>
                  </View>
                )}
                scrollEnabled={false}
              />
            </View>

            {/* Action Buttons */}
            <View className="gap-3">
              <TouchableOpacity
                className="bg-primary rounded-lg p-4 flex-row items-center justify-between"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">📋</Text>
                  <Text className="text-white font-semibold">
                    {t('member.loanDetails')}
                  </Text>
                </View>
                <Text className="text-white text-lg">→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">⬇️</Text>
                  <Text className="text-foreground font-semibold">
                    {t('member.downloadStatement')}
                  </Text>
                </View>
                <Text className="text-foreground text-lg">→</Text>
              </TouchableOpacity>
            </View>

            {/* Profile Info */}
            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              <Text className="text-sm font-semibold text-foreground">
                {t('member.myProfile')}
              </Text>

              <View className="gap-2">
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs text-muted">Mobile Number</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {user?.mobileNumber}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-xs text-muted">Loan ID</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {loanStatus.loanId}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
