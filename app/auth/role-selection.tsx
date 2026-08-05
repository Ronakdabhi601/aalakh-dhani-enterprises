import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/lib/i18n-context';
import { useColors } from '@/hooks/use-colors';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const colors = useColors();

  const handleAdminPress = () => {
    router.navigate('admin-login' as any);
  };

  const handleMemberPress = () => {
    router.navigate('member-login' as any);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center items-center px-6 gap-8">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">
              {t('common.appName')}
            </Text>
            <Text className="text-base text-muted text-center">
              {t('auth.selectRole')}
            </Text>
          </View>

          {/* Admin Card */}
          <TouchableOpacity
            onPress={handleAdminPress}
            activeOpacity={0.7}
            className="w-full bg-surface rounded-2xl p-6 border border-border"
            style={{ borderColor: colors.border }}
          >
            <View className="items-center gap-4">
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-3xl">👨‍💼</Text>
              </View>
              <Text className="text-xl font-semibold text-foreground">
                {t('auth.admin')}
              </Text>
              <Text className="text-sm text-muted text-center">
                Manage members, loans, and payments
              </Text>
            </View>
          </TouchableOpacity>

          {/* Member Card */}
          <TouchableOpacity
            onPress={handleMemberPress}
            activeOpacity={0.7}
            className="w-full bg-surface rounded-2xl p-6 border border-border"
            style={{ borderColor: colors.border }}
          >
            <View className="items-center gap-4">
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.success }}
              >
                <Text className="text-3xl">👤</Text>
              </View>
              <Text className="text-xl font-semibold text-foreground">
                {t('auth.member')}
              </Text>
              <Text className="text-sm text-muted text-center">
                View your loan and payment history
              </Text>
            </View>
          </TouchableOpacity>

          {/* Version Info */}
          <Text className="text-xs text-muted mt-4">
            {t('common.version')}: 1.0.0
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
