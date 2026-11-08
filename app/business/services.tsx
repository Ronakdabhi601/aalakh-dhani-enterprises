import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BrandHeader, Card, useGoBack } from '@/components/business/ui';
import { BIZ } from '@/lib/business-theme';

interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
}

export default function ServicesScreen() {
  const router = useRouter();
  const goBack = useGoBack();

  const services: ServiceItem[] = [
    {
      id: 'emi',
      icon: '🧮',
      title: 'Loan & EMI Calculator',
      description: 'Estimate monthly payments and total interest.',
      onPress: () => router.push('/business/emi-calculator' as any),
    },
    {
      id: 'interest',
      icon: '%',
      title: 'Interest Calculator',
      description: 'Work out the interest only, on the full loan amount.',
      onPress: () => router.push('/business/interest-calculator' as any),
    },
    {
      id: 'finance',
      icon: '🏦',
      title: 'Business Finance',
      description: 'Organize your funding needs in one place.',
      onPress: () => Alert.alert('Business Finance', 'This feature is coming soon.'),
    },
    {
      id: 'payments',
      icon: '💳',
      title: 'Payment Records',
      description: 'Review sample incoming and outgoing payments.',
      onPress: () => router.push('/business/transactions' as any),
    },
    {
      id: 'reports',
      icon: '📊',
      title: 'Business Reports',
      description: 'Get a clearer picture of your cash flow.',
      onPress: () => router.push('/business/reports' as any),
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <BrandHeader title="Services" subtitle="Everything for your business in one place." onBack={goBack} />

        <View style={styles.body}>
          <View style={styles.grid}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.item}
                onPress={service.onPress}
                activeOpacity={0.8}
              >
                <Card style={styles.card}>
                  <Text style={styles.emoji}>{service.icon}</Text>
                  <Text style={styles.title}>{service.title}</Text>
                  <Text style={styles.description}>{service.description}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BIZ.cream,
  },
  content: {
    paddingBottom: 32,
  },
  body: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  item: {
    width: '48%',
  },
  card: {
    minHeight: 170,
    gap: 8,
  },
  emoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: BIZ.text,
  },
  description: {
    fontSize: 13,
    color: BIZ.muted,
    lineHeight: 18,
  },
});
