import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/lib/i18n-context';
import { useAuth } from '@/lib/auth-context';
import { useColors } from '@/hooks/use-colors';

export default function MemberLoginScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { signInMember, verifyOTP } = useAuth();
  const colors = useColors();

  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [useOTP, setUseOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async () => {
    if (!mobileNumber) {
      Alert.alert(t('common.error'), t('validation.required'));
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Integrate with actual OTP service
      setOtpSent(true);
      Alert.alert(t('common.success'), 'OTP sent to your mobile number');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert(t('common.error'), t('validation.required'));
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(mobileNumber, otp);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!mobileNumber || !password) {
      Alert.alert(t('common.error'), t('validation.required'));
      return;
    }

    setIsLoading(true);
    try {
      await signInMember(mobileNumber, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('auth.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (otpSent) {
      setOtpSent(false);
      setOtp('');
    } else {
      router.replace('/auth/role-selection' as any);
    }
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
                {t('auth.memberLogin')}
              </Text>
              <Text className="text-base text-muted">
                Login with your mobile number
              </Text>
            </View>
          </View>

          {/* Form */}
          <View className="gap-4">
            {/* Mobile Number Input */}
            {!otpSent && (
              <>
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">
                    {t('auth.mobileNumber')}
                  </Text>
                  <TextInput
                    placeholder="10-digit mobile number"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
                    editable={!isLoading}
                    className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholderTextColor={colors.muted}
                  />
                </View>

                {!useOTP ? (
                  <>
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
                      onPress={handlePasswordLogin}
                      disabled={isLoading}
                      className="bg-primary rounded-lg py-4 items-center mt-6"
                      activeOpacity={0.8}
                    >
                      <Text className="text-white font-semibold text-base">
                        {isLoading ? 'Logging in...' : t('common.login')}
                      </Text>
                    </TouchableOpacity>

                    {/* OTP Option */}
                    <TouchableOpacity onPress={() => setUseOTP(true)}>
                      <Text className="text-center text-primary text-sm font-semibold">
                        {t('auth.sendOTP')} instead
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* Send OTP Button */}
                    <TouchableOpacity
                      onPress={handleSendOTP}
                      disabled={isLoading}
                      className="bg-primary rounded-lg py-4 items-center"
                      activeOpacity={0.8}
                    >
                      <Text className="text-white font-semibold text-base">
                        {isLoading ? 'Sending...' : t('auth.sendOTP')}
                      </Text>
                    </TouchableOpacity>

                    {/* Use Password Option */}
                    <TouchableOpacity onPress={() => setUseOTP(false)}>
                      <Text className="text-center text-primary text-sm font-semibold">
                        Use password instead
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}

            {/* OTP Verification */}
            {otpSent && (
              <>
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">
                    {t('auth.enterOTP')}
                  </Text>
                  <Text className="text-xs text-muted">
                    Enter the OTP sent to {mobileNumber}
                  </Text>
                  <TextInput
                    placeholder="6-digit OTP"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!isLoading}
                    className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground text-center text-lg"
                    placeholderTextColor={colors.muted}
                  />
                </View>

                {/* Verify OTP Button */}
                <TouchableOpacity
                  onPress={handleVerifyOTP}
                  disabled={isLoading}
                  className="bg-primary rounded-lg py-4 items-center mt-6"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-base">
                    {isLoading ? 'Verifying...' : t('auth.verifyOTP')}
                  </Text>
                </TouchableOpacity>

                {/* Resend OTP */}
                <TouchableOpacity onPress={handleSendOTP}>
                  <Text className="text-center text-primary text-sm font-semibold">
                    {t('auth.resendOTP')}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>


        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
