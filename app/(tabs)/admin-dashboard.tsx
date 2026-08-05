import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/lib/i18n-context';
import { useAuth } from '@/lib/auth-context';
import { useColors } from '@/hooks/use-colors';
import { useState, useCallback } from 'react';

interface DashboardMetrics {
  totalMembers: number;
  activeLoans: number;
  todaysCollection: number;
  monthlyCollection: number;
  pendingInstallments: number;
  totalOutstanding: number;
}

export default function AdminDashboardScreen() {
  const { t } = useI18n();
  const { user, signOut } = useAuth();
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API calls
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalMembers: 45,
    activeLoans: 38,
    todaysCollection: 15000,
    monthlyCollection: 450000,
    pendingInstallments: 12,
    totalOutstanding: 850000,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    await signOut();
  };

  const MetricCard = ({
    label,
    value,
    icon,
    color,
  }: {
    label: string;
    value: string | number;
    icon: string;
    color: string;
  }) => (
    <View className="flex-1 bg-surface rounded-lg p-4 border border-border gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl">{icon}</Text>
        <Text className="text-xs text-muted font-semibold">{label}</Text>
      </View>
      <Text className="text-2xl font-bold" style={{ color }}>
        {value}
      </Text>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-foreground">
                {t('admin.dashboard')}
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

          {/* Top Metrics */}
          <View className="gap-3">
            <View className="flex-row gap-3">
              <MetricCard
                label={t('admin.totalMembers')}
                value={metrics.totalMembers}
                icon="👥"
                color={colors.primary}
              />
              <MetricCard
                label={t('admin.activeLoans')}
                value={metrics.activeLoans}
                icon="💰"
                color={colors.success}
              />
            </View>

            <View className="flex-row gap-3">
              <MetricCard
                label={t('admin.todaysCollection')}
                value={`₹${metrics.todaysCollection.toLocaleString()}`}
                icon="📊"
                color={colors.primary}
              />
              <MetricCard
                label={t('admin.monthlyCollection')}
                value={`₹${(metrics.monthlyCollection / 1000).toFixed(0)}K`}
                icon="📈"
                color={colors.success}
              />
            </View>

            <View className="flex-row gap-3">
              <MetricCard
                label={t('admin.pendingInstallments')}
                value={metrics.pendingInstallments}
                icon="⏳"
                color={colors.warning}
              />
              <MetricCard
                label={t('admin.totalOutstanding')}
                value={`₹${(metrics.totalOutstanding / 1000).toFixed(0)}K`}
                icon="⚠️"
                color={colors.error}
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Quick Actions
            </Text>

            <TouchableOpacity
              className="bg-primary rounded-lg p-4 flex-row items-center justify-between"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">➕</Text>
                <Text className="text-white font-semibold">
                  {t('admin.addMember')}
                </Text>
              </View>
              <Text className="text-white text-lg">→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">💳</Text>
                <Text className="text-foreground font-semibold">
                  {t('admin.recordPayment')}
                </Text>
              </View>
              <Text className="text-foreground text-lg">→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">📋</Text>
                <Text className="text-foreground font-semibold">
                  {t('admin.viewReports')}
                </Text>
              </View>
              <Text className="text-foreground text-lg">→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">✅</Text>
                <Text className="text-foreground font-semibold">
                  {t('admin.approveLoans')}
                </Text>
              </View>
              <Text className="text-foreground text-lg">→</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Activity */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Recent Activity
            </Text>

            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                  <Text className="text-white font-bold">R</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">
                    Rajesh Kumar
                  </Text>
                  <Text className="text-xs text-muted">
                    Paid ₹5,000 - 2 hours ago
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-success items-center justify-center">
                  <Text className="text-white font-bold">P</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">
                    Priya Sharma
                  </Text>
                  <Text className="text-xs text-muted">
                    Loan approved - 4 hours ago
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
