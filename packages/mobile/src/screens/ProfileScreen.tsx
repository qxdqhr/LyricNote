import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/api';

interface User {
  id: string;
  email: string;
  username: string;
  nickname?: string;
  role: string;
}

export default function ProfileScreen(): React.JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true); // true: 登录模式, false: 注册模式
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // 表单数据
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // 检查登录状态
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setCheckingAuth(true);
      const isAuth = await apiService.isAuthenticated();
      
      if (isAuth) {
        // 验证 token 并获取用户信息
        const response = await apiService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data.user);
          setIsLoggedIn(true);
        } else {
          // Token 无效，清除登录状态
          await apiService.clearUserData();
        }
      }
    } catch (error) {
      console.error('检查登录状态失败:', error);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('提示', '请输入邮箱和密码');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        setEmail('');
        setPassword('');
        Alert.alert('成功', '登录成功！');
      } else {
        Alert.alert('登录失败', response.error || '请检查邮箱和密码');
      }
    } catch (error) {
      Alert.alert('错误', '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !username) {
      Alert.alert('提示', '请填写所有字段');
      return;
    }

    if (password.length < 6) {
      Alert.alert('提示', '密码长度至少6位');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.register(email, password, username);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        setEmail('');
        setPassword('');
        setUsername('');
        Alert.alert('成功', '注册成功！');
      } else {
        Alert.alert('注册失败', response.error || '请重试');
      }
    } catch (error) {
      Alert.alert('错误', '注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      '确认登出',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: async () => {
            setLoading(true);
            try {
              await apiService.logout();
              setUser(null);
              setIsLoggedIn(false);
              Alert.alert('成功', '已退出登录');
            } catch (error) {
              Alert.alert('错误', '登出失败');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // 加载中状态
  if (checkingAuth) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 已登录状态
  if (isLoggedIn && user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎌 我的</Text>
        </View>

        {/* 用户信息 */}
        <ScrollView style={styles.content}>
          <View style={styles.userInfoContainer}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarText}>
                {user.username?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
            
            <Text style={styles.userName}>{user.username}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            
            {user.role && (
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>
                  {user.role === 'ADMIN' ? '管理员' : user.role === 'SUPER_ADMIN' ? '超级管理员' : '普通用户'}
                </Text>
              </View>
            )}
          </View>

          {/* 登出按钮 */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={24} color="white" style={styles.buttonIcon} />
                <Text style={styles.logoutButtonText}>退出登录</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 未登录状态 - 登录/注册表单
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎌 我的</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* 切换登录/注册 */}
          <View style={styles.tabContainer}>
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

          {/* 表单 */}
          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>用户名</Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入用户名"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>邮箱</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入邮箱"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>密码</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入密码"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={isLogin ? handleLogin : handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons 
                    name={isLogin ? "log-in-outline" : "person-add-outline"} 
                    size={24} 
                    color="white" 
                    style={styles.buttonIcon} 
                  />
                  <Text style={styles.submitButtonText}>
                    {isLogin ? '登录' : '注册'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.hint}>
              {isLogin ? '还没有账号？' : '已有账号？'}
              <Text 
                style={styles.link} 
                onPress={() => setIsLogin(!isLogin)}
              >
                {isLogin ? ' 立即注册' : ' 立即登录'}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  },
  keyboardAvoid: {
    flex: 1,
  },
  formContainer: {
    flexGrow: 1,
    padding: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 25,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: '#8b5cf6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: 'white',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  hint: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#6b7280',
  },
  link: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  userInfoContainer: {
    alignItems: 'center',
    padding: 32,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    marginHorizontal: 24,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
