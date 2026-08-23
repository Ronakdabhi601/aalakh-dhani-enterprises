import { View, Text, TouchableOpacity, ScrollView, FlatList, Modal, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/lib/i18n-context';
import { useColors } from '@/hooks/use-colors';
import {
  MemberSavings,
  calculateMonthlyProfit,
  distributeProfitToMembers,
  generateSavingsReport,
  calculateMemberNetBenefit,
  calculateMemberROI,
} from '@/lib/savings-utils';

export default function SavingsPoolScreen() {
  const { t } = useI18n();
  const colors = useColors();

  // Mock data: Members with their savings
  const [members, setMembers] = useState<MemberSavings[]>([
    {
      memberId: 1,
      memberName: 'Rajesh Kumar',
      totalSavings: 12000, // ₹1000 × 12 months
      monthlyDeposit: 1000,
      profitEarned: 2400, // 2% of ₹120,000 EMI collected
    },
    {
      memberId: 2,
      memberName: 'Priya Singh',
      totalSavings: 10000, // ₹1000 × 10 months
      monthlyDeposit: 1000,
      profitEarned: 2000,
    },
    {
      memberId: 3,
      memberName: 'Amit Patel',
      totalSavings: 8000, // ₹1000 × 8 months
      monthlyDeposit: 1000,
      profitEarned: 1600,
    },
  ]);

  const [totalEMICollected, setTotalEMICollected] = useState(120000);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberSavings | null>(null);

  const report = generateSavingsReport(members, totalEMICollected);
  const monthlyProfit = calculateMonthlyProfit(totalEMICollected);

  const handleDistributeProfits = async () => {
    setIsLoading(true);
    try {
      // Simulate profit distribution
      const updatedMembers = distributeProfitToMembers(members, monthlyProfit);
      setMembers(updatedMembers);
      setShowDistributeModal(false);
      Alert.alert(
        t('common.success'),
        `Profit distributed!\nMonthly Profit: ₹${monthlyProfit.toFixed(2)}`
      );
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to distribute profits');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMemberSavingsItem = (member: MemberSavings) => {
    const netBenefit = calculateMemberNetBenefit(member);
    const roi = calculateMemberROI(member);

    return (
      <TouchableOpacity
        onPress={() => setSelectedMember(member)}
        className="bg-surface border border-border rounded-lg p-4 mb-3"
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">{member.memberName}</Text>
            <Text className="text-sm text-muted">Member ID: {member.memberId}</Text>
          </View>
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 font-semibold text-xs">
              {roi.toFixed(1)}% ROI
            </Text>
          </View>
        </View>

        <View className="gap-2">
          <View className="flex-row justify-between">
            <Text className="text-sm text-muted">Total Savings:</Text>
            <Text className="text-sm font-semibold text-foreground">
              ₹{member.totalSavings.toLocaleString()}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-muted">Profit Earned:</Text>
            <Text className="text-sm font-semibold text-green-600">
              +₹{member.profitEarned.toLocaleString()}
            </Text>
          </View>
          <View className="flex-row justify-between pt-2 border-t border-border">
            <Text className="text-sm font-semibold text-foreground">Net Benefit:</Text>
            <Text className="text-sm font-bold text-primary">
              ₹{netBenefit.toLocaleString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="px-6 py-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Savings Pool
            </Text>
            <Text className="text-base text-muted">
              Monthly Profit Distribution System
            </Text>
          </View>

          {/* Pool Summary Cards */}
          <View className="gap-3">
            {/* Total Pool Amount */}
            <View className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4">
              <Text className="text-white text-sm opacity-90 mb-1">Total Pool Amount</Text>
              <Text className="text-white text-3xl font-bold">
                ₹{report.totalPoolAmount.toLocaleString()}
              </Text>
              <Text className="text-white text-xs opacity-75 mt-1">
                {report.totalMembers} members contributing ₹1000/month
              </Text>
            </View>

            {/* Monthly Profit */}
            <View className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4">
              <Text className="text-white text-sm opacity-90 mb-1">Monthly Profit (2%)</Text>
              <Text className="text-white text-3xl font-bold">
                ₹{monthlyProfit.toLocaleString()}
              </Text>
              <Text className="text-white text-xs opacity-75 mt-1">
                From ₹{report.totalEMICollected.toLocaleString()} EMI collected
              </Text>
            </View>

            {/* Average Savings */}
            <View className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4">
              <Text className="text-white text-sm opacity-90 mb-1">Average Savings/Member</Text>
              <Text className="text-white text-3xl font-bold">
                ₹{report.averageSavingsPerMember.toLocaleString()}
              </Text>
              <Text className="text-white text-xs opacity-75 mt-1">
                Across {report.totalMembers} members
              </Text>
            </View>
          </View>

          {/* Top Performers */}
          {report.highestSavingsMember && (
            <View className="bg-surface border border-border rounded-lg p-4 gap-3">
              <Text className="text-lg font-bold text-foreground">Top Savers</Text>
              
              <View className="bg-background rounded-lg p-3 border border-green-200">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-sm font-semibold text-foreground">
                    🥇 Highest Savings
                  </Text>
                  <Text className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    ₹{report.highestSavingsMember.totalSavings.toLocaleString()}
                  </Text>
                </View>
                <Text className="text-sm text-muted">{report.highestSavingsMember.memberName}</Text>
              </View>

              {report.lowestSavingsMember && (
                <View className="bg-background rounded-lg p-3 border border-orange-200">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-sm font-semibold text-foreground">
                      📊 Lowest Savings
                    </Text>
                    <Text className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                      ₹{report.lowestSavingsMember.totalSavings.toLocaleString()}
                    </Text>
                  </View>
                  <Text className="text-sm text-muted">{report.lowestSavingsMember.memberName}</Text>
                </View>
              )}
            </View>
          )}

          {/* Distribute Profits Button */}
          <TouchableOpacity
            onPress={() => setShowDistributeModal(true)}
            className="bg-primary rounded-lg py-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              Distribute Monthly Profits
            </Text>
          </TouchableOpacity>

          {/* Members Savings List */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">
              Member Savings Details
            </Text>
            <FlatList
              data={members}
              keyExtractor={(item) => item.memberId.toString()}
              renderItem={({ item }) => renderMemberSavingsItem(item)}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>

      {/* Distribute Profits Modal */}
      <Modal visible={showDistributeModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-2xl p-6 gap-4">
            <Text className="text-2xl font-bold text-foreground">
              Distribute Monthly Profits
            </Text>

            <View className="bg-surface border border-border rounded-lg p-4 gap-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Total Pool Amount:</Text>
                <Text className="text-sm font-semibold text-foreground">
                  ₹{report.totalPoolAmount.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Total EMI Collected:</Text>
                <Text className="text-sm font-semibold text-foreground">
                  ₹{report.totalEMICollected.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row justify-between border-t border-border pt-3">
                <Text className="text-sm font-bold text-foreground">Monthly Profit (2%):</Text>
                <Text className="text-sm font-bold text-green-600">
                  ₹{monthlyProfit.toLocaleString()}
                </Text>
              </View>
            </View>

            <View className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <Text className="text-xs text-blue-700">
                💡 Profit will be divided equally among all members, regardless of their savings amount.
              </Text>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowDistributeModal(false)}
                className="flex-1 bg-surface border border-border rounded-lg py-3"
              >
                <Text className="text-foreground font-semibold text-center">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDistributeProfits}
                disabled={isLoading}
                className="flex-1 bg-primary rounded-lg py-3"
              >
                <Text className="text-white font-semibold text-center">
                  {isLoading ? 'Distributing...' : 'Confirm & Distribute'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Member Details Modal */}
      <Modal visible={selectedMember !== null} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-2xl p-6 gap-4 max-h-[80%]">
            <ScrollView>
              <Text className="text-2xl font-bold text-foreground mb-4">
                {selectedMember?.memberName}
              </Text>

              {selectedMember && (
                <View className="gap-4">
                  <View className="bg-surface border border-border rounded-lg p-4 gap-3">
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">Member ID:</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {selectedMember.memberId}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">Monthly Deposit:</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        ₹{selectedMember.monthlyDeposit.toLocaleString()}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-t border-border pt-3">
                      <Text className="text-sm font-bold text-foreground">Total Savings:</Text>
                      <Text className="text-sm font-bold text-primary">
                        ₹{selectedMember.totalSavings.toLocaleString()}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm font-bold text-foreground">Profit Earned:</Text>
                      <Text className="text-sm font-bold text-green-600">
                        ₹{selectedMember.profitEarned.toLocaleString()}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm font-bold text-foreground">Net Benefit:</Text>
                      <Text className="text-sm font-bold text-primary">
                        ₹{calculateMemberNetBenefit(selectedMember).toLocaleString()}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-t border-border pt-3">
                      <Text className="text-sm font-bold text-foreground">ROI:</Text>
                      <Text className="text-sm font-bold text-green-600">
                        {calculateMemberROI(selectedMember).toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setSelectedMember(null)}
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
