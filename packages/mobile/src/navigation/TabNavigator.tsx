import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TabParamList } from '../types';
import { texts } from '../constants/texts';
import HomeScreen from '../screens/HomeScreen';
import LyricsScreen from '../screens/LyricsScreen';
import CollectionScreen from '../screens/CollectionScreen';
import { UIShowcase } from '../screens/UIShowcase';

const Tab = createBottomTabNavigator<TabParamList>();

import { View, Text } from 'react-native';

// 临时占位组件
const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={{ 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f9fafb'
  }}>
    <Text style={{ fontSize: 48, marginBottom: 16 }}>🚧</Text>
    <Text style={{ fontSize: 20, color: '#6b7280' }}>{title} 开发中...</Text>
  </View>
);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Lyrics') {
            iconName = focused ? 'musical-notes' : 'musical-notes-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'create' : 'create-outline';
          } else if (route.name === 'Collection') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8b5cf6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          paddingTop: 5,
          height: 65,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: texts.navigation.home,
        }}
      />
      <Tab.Screen
        name="Lyrics"
        component={LyricsScreen}
        options={{
          tabBarLabel: texts.navigation.lyrics,
        }}
      />
      <Tab.Screen
        name="Create"
        component={UIShowcase}
        options={{
          tabBarLabel: 'UI展示',
        }}
      />
      <Tab.Screen
        name="Collection"
        component={CollectionScreen}
        options={{
          tabBarLabel: texts.navigation.collection,
        }}
      />
      <Tab.Screen
        name="Profile"
        children={() => <PlaceholderScreen title="我的" />}
        options={{
          tabBarLabel: texts.navigation.profile,
        }}
      />
    </Tab.Navigator>
  );
}
