import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, FlatList, Modal } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/lib/i18n-context';
import { useColors } from '@/hooks/use-colors';
import { calculateEMI, calculateTotalPayable } from '@/lib/finance-utils';

interface Loan {
  id: number;
  memberId: number;
  memberName: string;
  loanAmount: number;
  monthlyInterestRate: number;
  loanDurationMonths: number;
  monthlyEMI: number;
  totalPayableAmount: number;
  remainingBalance: number;
  status: 'pending' | 'approved' | 'rejected' | 'closed';
  createdAt: string;
}

interface Member {
  id: number;
  name: string;
}

export default function LoansManagementScreen() {
  const { t } = useI18n();
  const colors = useColors();

  const mockMembers: Member[] = [
    { id: 1, name: 'Rajesh Kumar' },
    { id: 2, name: 'Priya Singh' },
  ];

  const [loans, setLoans] = useState<Loan[]>([
    {
      id: 1,
      memberId: 1,
      memberName: 'Rajesh Kumar',
      loanAmount: 50000,
      monthlyInterestRate: 2,
      loanDurationMonths: 12,
      monthlyEMI: 4350,
      totalPayableAmount: 52200,
      remainingBalance: 35000,
      status: 'approved',
      createdAt: '2024-01-15',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    memberId: '',
    loanAmount: '',
    loanDurationMonths: '12',
    monthlyInterestRate: '2',
  });

  const filteredLoans = loans.filter(
    (loan) =>
      loan.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.id.toString().includes(searchQuery)
  );

  const handleCreateLoan = async () => {
    if (!formData.memberId || !formData.loanAmount) {
      Alert.alert(t('common.error'), 'Please fill all required fields');
      return;
    }

    const loanAmount = parseFloat(formData.loanAmount);
    const duration = parseInt(formData.loanDurationMonths);
    const interestRate = parseInt(formData.monthlyInterestRate);

    if (loanAmount <= 0 || duration <= 0) {
      Alert.alert(t('common.error'), 'Invalid loan amount or duration');
      return;
    }

    setIsLoading(true);
    try {
      const emi = calculateEMI(loanAmount, interestRate, duration);
      const totalPayable = calculateTotalPayable(loanAmount, interestRate, duration);

      const member = mockMembers.find(m => m.id === parseInt(formData.memberId));
      if (!member) {
        Alert.alert(t('common.error'), 'Member not found');
        return;
      }

      const newLoan: Loan = {
        id: Math.max(...loans.map(l => l.id), 0) + 1,
        memberId: parseInt(formData.memberId),
        memberName: member.name,
        loanAmount,
        monthlyInterestRate: interestRate,
        loanDurationMonths: duration,
        monthlyEMI: emi,
        totalPayableAmount: totalPayable,
        remainingBalance: totalPayable,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      };

      setLoans([...loans, newLoan]);
      setFormData({ memberId: '', loanAmount: '', loanDurationMonths: '12', monthlyInterestRate: '2' });
      setShowCreateModal(false);
      Alert.alert(t('common.success'), 'Loan created successfully. Pending approval.');
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to create loan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveLoan = (loan: Loan) => {
    Alert.alert(
      t('common.confirm'),
      `Approve loan of ₹${loan.loanAmount} for ${loan.memberName}?`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Approve',
          onPress: () => {
            const updatedLoans = loans.map(l =>
              l.id === loan.id ? { ...l, status: 'approved' as const } : l
            );
            setLoans(updatedLoans);
            setShowDetailsModal(false);
            Alert.alert(t('common.success'), 'Loan approved successfully');
          },
        },
      ]
    );
  };

  const handleRejectLoan = (loan: Loan) => {
    Alert.alert(
      t('common.confirm'),
      `Reject loan of ₹${loan.loanAmount} for ${loan.memberName}?`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Reject',
          onPress: () => {
            const updatedLoans = loans.map(l =>
              l.id === loan.id ? { ...l, status: 'rejected' as const } : l
            );
            setLoans(updatedLoans);
            setShowDetailsModal(false);
            Alert.alert(t('common.success'), 'Loan rejected');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderLoanItem = (loan: Loan) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedLoan(loan);
        setShowDetailsModal(true);
      }}
      className="bg-surface border border-border rounded-lg p-4 mb-3"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">{loan.memberName}</Text>
          <Text className="text-sm text-muted">Loan ID: {loan.id}</Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${
            loan.status === 'approved'
              ? 'bg-green-100'
              : loan.status === 'pending'
              ? 'bg-yellow-100'
              : loan.status === 'rejected'
              ? 'bg-red-100'
              : 'bg-gray-100'
          }`}
        >
          <Text
            className={`font-semibold text-xs ${
              loan.status === 'approved'
                ? 'text-green-700'
                : loan.status === 'pending'
                ? 'text-yellow-700'
                : loan.status === 'rejected'
                ? 'text-red-700'
                : 'text-gray-700'
            }`}
          >
            {loan.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="gap-2">
        <View className="flex-row justify-between">
          <Text className="text-sm text-muted">Loan Amount:</Text>
          <Text className="text-sm font-semibold text-foreground">₹{loan.loanAmount}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-muted">Monthly EMI:</Text>
          <Text className="text-sm font-semibold text-foreground">₹{loan.monthlyEMI}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-muted">Remaining:</Text>
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
              {t('loan.management')}
            </Text>
            <Text className="text-base text-muted">
              Total Loans: {loans.length}
            </Text>
          </View>

          {/* Search Bar */}
          <View className="gap-2">
            <TextInput
              placeholder="Search by member name or loan ID..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />
          </View>

          {/* Create Loan Button */}
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            className="bg-primary rounded-lg py-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              + Create New Loan
            </Text>
          </TouchableOpacity>

          {/* Loans List */}
          <View className="gap-3">
            {filteredLoans.length > 0 ? (
              <FlatList
                data={filteredLoans}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderLoanItem(item)}
                scrollEnabled={false}
              />
            ) : (
              <View className="bg-surface border border-border rounded-lg p-6 items-center">
                <Text className="text-muted text-center">
                  {searchQuery ? 'No loans found' : 'No loans yet'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Create Loan Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-2xl p-6 gap-4">
            <Text className="text-2xl font-bold text-foreground">Create New Loan</Text>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Select Member</Text>
              <View className="flex-row gap-2">
                {mockMembers.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    onPress={() => setFormData({ ...formData, memberId: member.id.toString() })}
                    className={`flex-1 py-3 px-2 rounded-lg border ${
                      formData.memberId === member.id.toString()
                        ? 'bg-primary border-primary'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold text-xs ${
                        formData.memberId === member.id.toString()
                          ? 'text-white'
                          : 'text-foreground'
                      }`}
                      numberOfLines={1}
                    >
                      {member.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              placeholder="Loan Amount (₹)"
              value={formData.loanAmount}
              onChangeText={(text) => setFormData({ ...formData, loanAmount: text })}
              keyboardType="decimal-pad"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Loan Duration (months)</Text>
              <View className="flex-row gap-2">
                {['6', '12', '18', '24'].map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    onPress={() => setFormData({ ...formData, loanDurationMonths: duration })}
                    className={`flex-1 py-3 px-2 rounded-lg border ${
                      formData.loanDurationMonths === duration
                        ? 'bg-primary border-primary'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold text-sm ${
                        formData.loanDurationMonths === duration
                          ? 'text-white'
                          : 'text-foreground'
                      }`}
                    >
                      {duration}M
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Monthly Interest Rate (%)</Text>
              <View className="flex-row gap-2">
                {['1', '2', '3'].map((rate) => (
                  <TouchableOpacity
                    key={rate}
                    onPress={() => setFormData({ ...formData, monthlyInterestRate: rate })}
                    className={`flex-1 py-3 px-2 rounded-lg border ${
                      formData.monthlyInterestRate === rate
                        ? 'bg-primary border-primary'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold text-sm ${
                        formData.monthlyInterestRate === rate
                          ? 'text-white'
                          : 'text-foreground'
                      }`}
                    >
                      {rate}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                className="flex-1 bg-surface border border-border rounded-lg py-3"
              >
                <Text className="text-foreground font-semibold text-center">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreateLoan}
                disabled={isLoading}
                className="flex-1 bg-primary rounded-lg py-3"
              >
                <Text className="text-white font-semibold text-center">
                  {isLoading ? 'Creating...' : 'Create Loan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loan Details Modal */}
      <Modal visible={showDetailsModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-2xl p-6 gap-4 max-h-[80%]">
            <ScrollView>
              <Text className="text-2xl font-bold text-foreground mb-4">Loan Details</Text>

              {selectedLoan && (
                <View className="gap-3">
                  <View className="bg-surface border border-border rounded-lg p-4 gap-3">
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">Member:</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {selectedLoan.memberName}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">Loan Amount:</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        ₹{selectedLoan.loanAmount}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">Duration:</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {selectedLoan.loanDurationMonths} months
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">Monthly EMI:</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        ₹{selectedLoan.monthlyEMI}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">Total Payable:</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        ₹{selectedLoan.totalPayableAmount}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">Remaining Balance:</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        ₹{selectedLoan.remainingBalance}
                      </Text>
                    </View>
                  </View>

                  {selectedLoan.status === 'pending' && (
                    <View className="flex-row gap-3">
                      <TouchableOpacity
                        onPress={() => handleRejectLoan(selectedLoan)}
                        className="flex-1 bg-red-100 rounded-lg py-3"
                      >
                        <Text className="text-red-700 font-semibold text-center">Reject</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleApproveLoan(selectedLoan)}
                        className="flex-1 bg-green-100 rounded-lg py-3"
                      >
                        <Text className="text-green-700 font-semibold text-center">Approve</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowDetailsModal(false)}
              className="bg-surface border border-border rounded-lg py-3"
            >
              <Text className="text-foreground font-semibold text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
