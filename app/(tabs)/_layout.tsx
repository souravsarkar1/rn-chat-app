import { router, Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Home, MessageCircle, User, Settings } from 'lucide-react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as SecureStore from 'expo-secure-store';
import { useAppSelector } from '@/redux/store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const iconSize = 24;
  const { isAuthenticated } = useAppSelector((state: any) => state.auth)
  if (!isAuthenticated) {
    router.replace('/login')
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconSelected,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: 88,
            paddingBottom: 32,
            paddingTop: 12,
            backgroundColor: Platform.select({
              ios: 'transparent',
              default: Colors[colorScheme ?? 'light'].background,
            }),
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          default: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
        }),
        tabBarLabelStyle: {
          fontFamily: Platform.select({ ios: 'System', default: 'Roboto' }),
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Home
              size={iconSize}
              color={color}
              strokeWidth={2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => (
            <MessageCircle
              size={iconSize}
              color={color}
              strokeWidth={2}
            />
          ),
          tabBarBadge: 3,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <User
              size={iconSize}
              color={color}
              strokeWidth={2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Settings
              size={iconSize}
              color={color}
              strokeWidth={2}
            />
          ),
        }}
      />
    </Tabs>
  );
}