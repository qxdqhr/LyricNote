import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_TITLES, APP_CONFIG } from '@lyricnote/shared';
import { apiService } from '../services/api';

interface User {
  id: string;
  email: string;
  username: string;
  nickname?: string;
  role: string;
}

export default function HomeScreen(): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const isAuth = await apiService.isAuthenticated();

      if (isAuth) {
        const response = await apiService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        }
      }
    } catch (error) {
      console.error('检查登录状态失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{APP_TITLES.main}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.emoji}>🎵</Text>
        <Text style={styles.title}>{APP_TITLES.welcome}</Text>
        <Text style={styles.subtitle}>{APP_CONFIG.description}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#8b5cf6" style={styles.loading} />
        ) : user ? (
          <View style={styles.userWelcome}>
            <Text style={styles.welcomeMessage}>你好，{user.username}！</Text>
          </View>
        ) : (
          <View style={styles.authHint}>
            <Text style={styles.hintText}>请前往"我的"页面登录</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  loading: {
    marginTop: 20,
  },
  userWelcome: {
    backgroundColor: '#f0fdf4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#166534',
    fontWeight: '500',
  },
  authHint: {
    backgroundColor: '#fef3c7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  hintText: {
    fontSize: 16,
    color: '#854d0e',
    fontWeight: '500',
  },
});
