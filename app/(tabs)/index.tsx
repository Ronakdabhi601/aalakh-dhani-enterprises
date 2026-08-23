import { Alert, ScrollView, Text, View, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/lib/i18n-context';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '@/lib/auth-context';

export default function HomeScreen() {
  const { t } = useI18n();
  const colors = useColors();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      router.replace('/auth/role-selection' as any);
    }
  };

  const handleViewReports = () => {
    Alert.alert('Reports', 'Reports are not available yet.');
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Mock dashboard data
  const dashboardData = {
    totalMembers: 45,
    activeLoans: 38,
    todayCollection: 125000,
    monthlyCollection: 2850000,
    pendingInstallments: 12,
    totalOutstanding: 1850000,
  };

  const quickStats = [
    {
      label: 'Total Members',
      value: dashboardData.totalMembers,
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Active Loans',
      value: dashboardData.activeLoans,
      icon: '💰',
      color: 'from-green-500 to-green-600',
    },
    {
      label: "Today's Collection",
      value: `₹${(dashboardData.todayCollection / 1000).toFixed(0)}K`,
      icon: '📊',
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Pending EMI',
      value: dashboardData.pendingInstallments,
      icon: '⏰',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="px-6 pt-6 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-4xl font-bold text-foreground">
                Dashboard
              </Text>
              <Text className="text-sm text-muted mt-2">
                Welcome back, {user?.name || 'Admin'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.8}
              className="bg-error rounded-lg px-4 py-2 ml-3"
            >
              <Text className="text-white text-sm font-semibold">{t('common.logout')}</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats Grid */}
          <View className="px-6 gap-4">
            {quickStats.map((stat, index) => (
              <View
                key={index}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 gap-3`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-white/80 text-sm font-semibold">
                      {stat.label}
                    </Text>
                    <Text className="text-white font-bold text-3xl mt-2">
                      {stat.value}
                    </Text>
                  </View>
                  <Text className="text-4xl">{stat.icon}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Key Metrics Section */}
          <View className="px-6 gap-3">
            <Text className="text-lg font-bold text-foreground">
              Key Metrics
            </Text>

            <View className="bg-surface border border-border rounded-2xl p-6 gap-4">
              <View className="flex-row items-center justify-between pb-4 border-b border-border">
                <View>
                  <Text className="text-muted text-sm mb-1">Monthly Collection</Text>
                  <Text className="text-2xl font-bold text-foreground">
                    ₹{(dashboardData.monthlyCollection / 100000).toFixed(1)}L
                  </Text>
                </View>
                <Text className="text-3xl">📈</Text>
              </View>

              <View className="flex-row items-center justify-between pb-4 border-b border-border">
                <View>
                  <Text className="text-muted text-sm mb-1">Total Outstanding</Text>
                  <Text className="text-2xl font-bold text-foreground">
                    ₹{(dashboardData.totalOutstanding / 100000).toFixed(1)}L
                  </Text>
                </View>
                <Text className="text-3xl">💳</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-muted text-sm mb-1">Pending Installments</Text>
                  <Text className="text-2xl font-bold text-warning">
                    {dashboardData.pendingInstallments}
                  </Text>
                </View>
                <Text className="text-3xl">⚠️</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="px-6 gap-3">
            <Text className="text-lg font-bold text-foreground">
              Quick Actions
            </Text>

            <View className="gap-3">
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/members-management' as any)}
                className="bg-primary rounded-lg p-4 flex-row items-center justify-between active:opacity-80"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">➕</Text>
                  <Text className="text-white font-semibold">Add New Member</Text>
                </View>
                <Text className="text-white">→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(tabs)/payment-recording' as any)}
                className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between active:opacity-80"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">💰</Text>
                  <Text className="text-foreground font-semibold">Record Payment</Text>
                </View>
                <Text className="text-foreground">→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleViewReports}
                className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between active:opacity-80"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">📊</Text>
                  <Text className="text-foreground font-semibold">View Reports</Text>
                </View>
                <Text className="text-foreground">→</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* System Status */}
          <View className="px-6 gap-3">
            <View className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <View className="flex-row items-center gap-2">
                <Text className="text-2xl">✅</Text>
                <View className="flex-1">
                  <Text className="text-green-900 dark:text-green-100 font-semibold text-sm">
                    System Status
                  </Text>
                  <Text className="text-green-800 dark:text-green-200 text-xs mt-1">
                    All systems operational. Last sync: Just now
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
