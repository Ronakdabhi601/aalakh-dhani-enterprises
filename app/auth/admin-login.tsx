import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/lib/i18n-context';
import { useAuth } from '@/lib/auth-context';
import { useColors } from '@/hooks/use-colors';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { signInAdmin } = useAuth();
  const colors = useColors();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('validation.required'));
      return;
    }

    setIsLoading(true);
    try {
      await signInAdmin(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('auth.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.replace('/auth/role-selection' as any);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-between px-6 py-8">
          {/* Header */}
          <View className="gap-6">
            <TouchableOpacity onPress={handleBack} className="mb-2">
              <Text className="text-lg text-primary">← {t('common.back')}</Text>
            </TouchableOpacity>

            <View className="gap-2">
              <Text className="text-3xl font-bold text-foreground">
                {t('auth.adminLogin')}
              </Text>
              <Text className="text-base text-muted">
                Enter your credentials to access the admin panel
              </Text>
            </View>
          </View>

          {/* Form */}
          <View className="gap-4">
            {/* Email Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">
                {t('auth.email')}
              </Text>
              <TextInput
                placeholder={t('auth.email')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Password Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">
                {t('auth.password')}
              </Text>
              <View className="flex-row items-center bg-surface border border-border rounded-lg px-4 py-3">
                <TextInput
                  placeholder={t('auth.password')}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                  className="flex-1 text-foreground"
                  placeholderTextColor={colors.muted}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text className="text-lg ml-2">
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className="bg-primary rounded-lg py-4 items-center mt-6"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">
                {isLoading ? 'Logging in...' : t('common.login')}
              </Text>
            </TouchableOpacity>
          </View>


        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
