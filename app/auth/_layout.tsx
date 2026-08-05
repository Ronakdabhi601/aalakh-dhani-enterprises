import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="role-selection"
        options={{
          title: 'Select Role',
        }}
      />
      <Stack.Screen
        name="admin-login"
        options={{
          title: 'Admin Login',
        }}
      />
      <Stack.Screen
        name="member-login"
        options={{
          title: 'Member Login',
        }}
      />
    </Stack>
  );
}
