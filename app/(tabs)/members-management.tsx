import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, FlatList, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/lib/i18n-context';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';

interface Member {
  id: number;
  name: string;
  mobileNumber: string;
  email?: string | null;
  address?: string | null;
  isActive: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function MembersManagementScreen() {
  const { t } = useI18n();
  const colors = useColors();
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
  });

  // Load members on mount
  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const response = await trpc.members.getAll.useQuery();
      setMembers(response.data || []);
    } catch (error) {
      console.error('Failed to load members:', error);
      Alert.alert(t('common.error'), 'Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.mobileNumber.includes(searchQuery)
  );

  const handleAddMember = async () => {
    if (!formData.name || !formData.mobileNumber) {
      Alert.alert(t('common.error'), 'Name and mobile number are required');
      return;
    }

    if (formData.mobileNumber.length !== 10) {
      Alert.alert(t('common.error'), 'Mobile number must be 10 digits');
      return;
    }

    setIsLoading(true);
    try {
      const newMember = await trpc.members.create.useMutation().mutateAsync({
        mobileNumber: formData.mobileNumber,
        name: formData.name,
        email: formData.email || undefined,
        address: formData.address || undefined,
      });

      setMembers([...members, newMember]);
      setFormData({ name: '', mobileNumber: '', email: '', address: '' });
      setShowAddModal(false);
      Alert.alert(t('common.success'), 'Member added successfully with savings account!');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Failed to add member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMember = async () => {
    if (!selectedMember) {
      return;
    }

    setIsLoading(true);
    try {
      const updated = await trpc.members.update.useMutation().mutateAsync({
        id: selectedMember.id,
        name: formData.name || undefined,
        email: formData.email || undefined,
        address: formData.address || undefined,
      });

      setMembers(members.map((m) => (m.id === updated.id ? updated : m)));
      setFormData({ name: '', mobileNumber: '', email: '', address: '' });
      setShowEditModal(false);
      setSelectedMember(null);
      Alert.alert(t('common.success'), 'Member updated successfully');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Failed to update member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = (member: Member) => {
    Alert.alert(
      t('common.confirm'),
      `Are you sure you want to delete ${member.name}?`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            setIsLoading(true);
            try {
              await trpc.members.delete.useMutation().mutateAsync({ id: member.id });
              setMembers(members.filter((m) => m.id !== member.id));
              Alert.alert(t('common.success'), 'Member deleted successfully');
            } catch (error: any) {
              Alert.alert(t('common.error'), error.message || 'Failed to delete member');
            } finally {
              setIsLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const openEditModal = (member: Member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      mobileNumber: member.mobileNumber,
      email: member.email || '',
      address: member.address || '',
    });
    setShowEditModal(true);
  };

  const renderMemberItem = (member: Member) => (
    <TouchableOpacity
      onPress={() => router.push(`/member-detail?id=${member.id}`)}
      activeOpacity={0.7}
    >
      <View className="bg-surface border border-border rounded-lg p-4 mb-3">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">{member.name}</Text>
            <Text className="text-sm text-muted">📱 {member.mobileNumber}</Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => openEditModal(member)}
              className="bg-blue-100 px-3 py-1 rounded"
            >
              <Text className="text-blue-700 font-semibold text-xs">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteMember(member)}
              className="bg-red-100 px-3 py-1 rounded"
            >
              <Text className="text-red-700 font-semibold text-xs">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="gap-1">
          {member.email && <Text className="text-xs text-muted">📧 {member.email}</Text>}
          {member.address && <Text className="text-xs text-muted">📍 {member.address}</Text>}
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
              {t('member.management')}
            </Text>
            <Text className="text-base text-muted">
              Total Members: {members.length}
            </Text>
          </View>

          {/* Search Bar */}
          <View className="gap-2">
            <TextInput
              placeholder="Search by name or mobile..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Add Member Button */}
          <TouchableOpacity
            onPress={() => {
              setFormData({ name: '', mobileNumber: '', email: '', address: '' });
              setShowAddModal(true);
            }}
            className="bg-primary rounded-lg py-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              + Add New Member
            </Text>
          </TouchableOpacity>

          {/* Members List */}
          <View className="gap-3">
            {filteredMembers.length > 0 ? (
              <FlatList
                data={filteredMembers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderMemberItem(item)}
                scrollEnabled={false}
              />
            ) : (
              <View className="bg-surface border border-border rounded-lg p-6 items-center">
                <Text className="text-muted text-center">
                  {searchQuery ? 'No members found' : 'No members yet. Add one to get started!'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Add Member Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-2xl p-6 gap-4">
            <Text className="text-2xl font-bold text-foreground">Add New Member</Text>

            <TextInput
              placeholder="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor={colors.muted}
            />

            <TextInput
              placeholder="Mobile Number (10 digits)"
              value={formData.mobileNumber}
              onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
              keyboardType="phone-pad"
              maxLength={10}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor={colors.muted}
            />

            <TextInput
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor={colors.muted}
            />

            <TextInput
              placeholder="Address"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              multiline
              numberOfLines={3}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor={colors.muted}
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                className="flex-1 bg-surface border border-border rounded-lg py-3"
              >
                <Text className="text-foreground font-semibold text-center">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddMember}
                disabled={isLoading}
                className="flex-1 bg-primary rounded-lg py-3"
              >
                <Text className="text-white font-semibold text-center">
                  {isLoading ? 'Adding...' : 'Add Member'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Member Modal */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-2xl p-6 gap-4">
            <Text className="text-2xl font-bold text-foreground">Edit Member</Text>

            <TextInput
              placeholder="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor={colors.muted}
            />

            <TextInput
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              editable={false}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-muted"
              placeholderTextColor={colors.muted}
            />

            <TextInput
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor={colors.muted}
            />

            <TextInput
              placeholder="Address"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              multiline
              numberOfLines={3}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor={colors.muted}
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                className="flex-1 bg-surface border border-border rounded-lg py-3"
              >
                <Text className="text-foreground font-semibold text-center">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleEditMember}
                disabled={isLoading}
                className="flex-1 bg-primary rounded-lg py-3"
              >
                <Text className="text-white font-semibold text-center">
                  {isLoading ? 'Updating...' : 'Update Member'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
