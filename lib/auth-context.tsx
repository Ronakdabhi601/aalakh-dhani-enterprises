import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trpc } from '@/lib/trpc';

export type UserRole = 'admin' | 'member';

export interface AuthUser {
  id: string;
  role: UserRole;
  email?: string;
  mobileNumber?: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signInAdmin: (email: string, password: string) => Promise<void>;
  signInMember: (mobileNumber: string, password: string) => Promise<void>;
  verifyOTP: (mobileNumber: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: AuthUser) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on app start
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      // Try to restore token
      const token = await SecureStore.getItemAsync('authToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.error('Failed to restore token:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signInAdmin = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Call tRPC admin login endpoint
      const response = await (trpc.admin.login as any)({ email, password });
      
      if (response.success && response.admin) {
        const authUser: AuthUser = {
          id: response.admin.id.toString(),
          role: 'admin',
          email: response.admin.email,
          name: response.admin.name,
        };

        // Store token and user data
        await SecureStore.setItemAsync('authToken', 'token-' + Date.now());
        await AsyncStorage.setItem('userData', JSON.stringify(authUser));
        setUser(authUser);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  };

  const signInMember = async (mobileNumber: string, password: string) => {
    try {
      if (!mobileNumber || !password) {
        throw new Error('Mobile number and password are required');
      }

      // Call tRPC member login endpoint
      const response = await (trpc.member.login as any)({ mobileNumber, password });
      
      if (response.success && response.member) {
        const authUser: AuthUser = {
          id: response.member.id.toString(),
          role: 'member',
          mobileNumber: response.member.mobileNumber,
          name: response.member.name,
        };

        // Store token and user data
        await SecureStore.setItemAsync('authToken', 'token-' + Date.now());
        await AsyncStorage.setItem('userData', JSON.stringify(authUser));
        setUser(authUser);
      }
    } catch (error) {
      console.error('Member login error:', error);
      throw error;
    }
  };

  const verifyOTP = async (mobileNumber: string, otp: string) => {
    try {
      if (!mobileNumber || !otp) {
        throw new Error('Mobile number and OTP are required');
      }

      // Call tRPC OTP verification endpoint
      const response = await (trpc.member.verifyOTP as any)({ mobileNumber, otp });
      
      if (response.success && response.member) {
        const authUser: AuthUser = {
          id: response.member.id.toString(),
          role: 'member',
          mobileNumber: response.member.mobileNumber,
          name: response.member.name,
        };

        // Store token and user data
        await SecureStore.setItemAsync('authToken', 'token-' + Date.now());
        await AsyncStorage.setItem('userData', JSON.stringify(authUser));
        setUser(authUser);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (updatedUser: AuthUser) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSignedIn: user !== null,
        signInAdmin,
        signInMember,
        verifyOTP,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
