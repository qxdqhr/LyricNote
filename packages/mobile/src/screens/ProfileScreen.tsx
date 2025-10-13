import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuth, useAuthForm } from '@lyricnote/shared';
import { apiService } from '../services/api';

export default function ProfileScreen(): React.JSX.Element {
  // 使用统一的 useAuth Hook
  const { user, isLoggedIn, loading, checkingAuth, login, register, logout } = useAuth(apiService);
  
  // 登录/注册模式切换
  const [isLogin, setIsLogin] = useState(true);
  
  // 登录表单
  const loginForm = useAuthForm({
    email: '',
    password: ''
  });
  
  // 注册表单
  const registerForm = useAuthForm({
    email: '',
    password: '',
    username: ''
  });

  // 处理登录
  const handleLogin = async () => {
    const { email, password } = loginForm.values;
    if (!email || !password) {
      Alert.alert('提示', '请输入邮箱和密码');
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      loginForm.reset();
      Alert.alert('成功', '登录成功！');
    } else {
      Alert.alert('登录失败', result.error || '请检查邮箱和密码');
    }
  };

  // 处理注册
  const handleRegister = async () => {
    const { email, password, username } = registerForm.values;
    if (!email || !password || !username) {
      Alert.alert('提示', '请填写所有字段');
      return;
    }

    if (password.length < 6) {
      Alert.alert('提示', '密码长度至少6位');
      return;
    }

    const result = await register(email, password, username);
    
    if (result.success) {
      registerForm.reset();
      Alert.alert('成功', '注册成功！');
    } else {
      Alert.alert('注册失败', result.error || '请重试');
    }
  };

  // 处理登出
  const handleLogout = () => {
    Alert.alert(
      '确认',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '退出', 
          style: 'destructive',
          onPress: logout
        },
      ]
    );
  };

  // 加载中状态
  if (checkingAuth) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={styles.loadingText}>正在加载...</Text>
        </View>
      </View>
    );
  }

  // 已登录状态
  if (isLoggedIn && user) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>个人信息</Text>
          
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.username?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.username || '未设置用户名'}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              {user.role && (
                <View style={styles.roleContainer}>
                  {user.role === 'SUPER_ADMIN' && (
                    <View style={[styles.roleBadge, styles.superAdminBadge]}>
                      <Text style={styles.roleBadgeText}>超级管理员</Text>
                    </View>
                  )}
                  {user.role === 'ADMIN' && (
                    <View style={[styles.roleBadge, styles.adminBadge]}>
                      <Text style={styles.roleBadgeText}>管理员</Text>
                    </View>
                  )}
                  {user.role === 'USER' && (
                    <View style={[styles.roleBadge, styles.userBadge]}>
                      <Text style={styles.roleBadgeText}>普通用户</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.logoutButton, loading && styles.buttonDisabled]} 
            onPress={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.logoutButtonText}>退出登录</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // 未登录状态 - 登录/注册表单
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, isLogin && styles.tabActive]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>登录</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, !isLogin && styles.tabActive]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>注册</Text>
          </TouchableOpacity>
        </View>

        {isLogin ? (
          <View style={styles.form}>
            <Text style={styles.formTitle}>登录账号</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>邮箱</Text>
              <TextInput
                style={styles.input}
                value={loginForm.values.email}
                onChangeText={(text) => loginForm.handleChange('email', text)}
                onBlur={() => loginForm.handleBlur('email')}
                placeholder="请输入邮箱"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>密码</Text>
              <TextInput
                style={styles.input}
                value={loginForm.values.password}
                onChangeText={(text) => loginForm.handleChange('password', text)}
                onBlur={() => loginForm.handleBlur('password')}
                placeholder="请输入密码"
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>登录</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.formTitle}>注册账号</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>用户名</Text>
              <TextInput
                style={styles.input}
                value={registerForm.values.username}
                onChangeText={(text) => registerForm.handleChange('username', text)}
                onBlur={() => registerForm.handleBlur('username')}
                placeholder="请输入用户名"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>邮箱</Text>
              <TextInput
                style={styles.input}
                value={registerForm.values.email}
                onChangeText={(text) => registerForm.handleChange('email', text)}
                onBlur={() => registerForm.handleBlur('email')}
                placeholder="请输入邮箱"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>密码</Text>
              <TextInput
                style={styles.input}
                value={registerForm.values.password}
                onChangeText={(text) => registerForm.handleChange('password', text)}
                onBlur={() => registerForm.handleBlur('password')}
                placeholder="请输入密码（至少6位）"
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.buttonDisabled]} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>注册</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#111827',
  },
  userInfo: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  userDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  roleContainer: {
    marginTop: 8,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  superAdminBadge: {},
  adminBadge: {},
  userBadge: {},
  roleBadgeText: {
    fontSize: 12,
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#8b5cf6',
  },
  tabText: {
    fontSize: 16,
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  form: {
    gap: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#111827',
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    fontSize: 16,
    color: '#111827',
  },
  submitButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
