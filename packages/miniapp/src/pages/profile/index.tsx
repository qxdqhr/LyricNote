import { View, Text, Input, Button } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { useAuth, useAuthForm } from '@lyricnote/shared';
import { apiService } from '../../services/api';
import './index.scss';

export default function Profile() {
  // 使用统一的 useAuth Hook
  const { user, isLoggedIn, loading, checkingAuth, login, register, logout } = useAuth(apiService);

  // 登录/注册模式切换
  const [isLogin, setIsLogin] = useState(true);

  // 登录表单
  const loginForm = useAuthForm({
    email: '',
    password: '',
  });

  // 注册表单
  const registerForm = useAuthForm({
    email: '',
    password: '',
    username: '',
  });

  // 处理登录
  const handleLogin = async () => {
    const { email, password } = loginForm.values;
    if (!email || !password) {
      Taro.showToast({ title: '请输入邮箱和密码', icon: 'none' });
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      loginForm.reset();
      Taro.showToast({ title: '登录成功！', icon: 'success' });
    } else {
      Taro.showToast({ title: result.error || '登录失败', icon: 'none' });
    }
  };

  // 处理注册
  const handleRegister = async () => {
    const { email, password, username } = registerForm.values;
    if (!email || !password || !username) {
      Taro.showToast({ title: '请填写所有字段', icon: 'none' });
      return;
    }

    if (password.length < 6) {
      Taro.showToast({ title: '密码长度至少6位', icon: 'none' });
      return;
    }

    const result = await register(email, password, username);

    if (result.success) {
      registerForm.reset();
      Taro.showToast({ title: '注册成功！', icon: 'success' });
    } else {
      Taro.showToast({ title: result.error || '注册失败', icon: 'none' });
    }
  };

  // 处理登出
  const handleLogout = async () => {
    const res = await Taro.showModal({
      title: '确认',
      content: '确定要退出登录吗？',
    });

    if (res.confirm) {
      await logout();
    }
  };

  // 加载中状态
  if (checkingAuth) {
    return (
      <View className="profile-container">
        <View className="loading-container">
          <Text className="loading-text">正在加载...</Text>
        </View>
      </View>
    );
  }

  // 已登录状态
  if (isLoggedIn && user) {
    return (
      <View className="profile-container">
        <View className="profile-card">
          <Text className="title">个人信息</Text>

          <View className="user-info">
            <View className="avatar">
              <Text className="avatar-text">
                {user.username?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View className="user-details">
              <Text className="user-name">{user.username || '未设置用户名'}</Text>
              <Text className="user-email">{user.email}</Text>
              {user.role && (
                <View className="role-container">
                  {user.role === 'SUPER_ADMIN' && (
                    <View className="role-badge super-admin">
                      <Text className="role-text">超级管理员</Text>
                    </View>
                  )}
                  {user.role === 'ADMIN' && (
                    <View className="role-badge admin">
                      <Text className="role-text">管理员</Text>
                    </View>
                  )}
                  {user.role === 'USER' && (
                    <View className="role-badge user">
                      <Text className="role-text">普通用户</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>

          <Button
            className="logout-button"
            onClick={handleLogout}
            loading={loading}
            disabled={loading}
          >
            {loading ? '退出中...' : '退出登录'}
          </Button>
        </View>
      </View>
    );
  }

  // 未登录状态 - 登录/注册表单
  return (
    <View className="profile-container">
      <View className="profile-card">
        <View className="tabs">
          <View className={`tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
            <Text className={`tab-text ${isLogin ? 'active' : ''}`}>登录</Text>
          </View>
          <View className={`tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
            <Text className={`tab-text ${!isLogin ? 'active' : ''}`}>注册</Text>
          </View>
        </View>

        {isLogin ? (
          <View className="form">
            <Text className="form-title">登录账号</Text>

            <View className="form-group">
              <Text className="label">邮箱</Text>
              <Input
                className="input"
                type="text"
                value={loginForm.values.email}
                onInput={(e) => loginForm.handleChange('email', e.detail.value)}
                onBlur={() => loginForm.handleBlur('email')}
                placeholder="请输入邮箱"
                disabled={loading}
              />
            </View>

            <View className="form-group">
              <Text className="label">密码</Text>
              <Input
                className="input"
                type="text"
                value={loginForm.values.password}
                onInput={(e) => loginForm.handleChange('password', e.detail.value)}
                onBlur={() => loginForm.handleBlur('password')}
                placeholder="请输入密码"
                password
                disabled={loading}
              />
            </View>

            <Button
              className="submit-button"
              onClick={handleLogin}
              loading={loading}
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </View>
        ) : (
          <View className="form">
            <Text className="form-title">注册账号</Text>

            <View className="form-group">
              <Text className="label">用户名</Text>
              <Input
                className="input"
                type="text"
                value={registerForm.values.username}
                onInput={(e) => registerForm.handleChange('username', e.detail.value)}
                onBlur={() => registerForm.handleBlur('username')}
                placeholder="请输入用户名"
                disabled={loading}
              />
            </View>

            <View className="form-group">
              <Text className="label">邮箱</Text>
              <Input
                className="input"
                type="text"
                value={registerForm.values.email}
                onInput={(e) => registerForm.handleChange('email', e.detail.value)}
                onBlur={() => registerForm.handleBlur('email')}
                placeholder="请输入邮箱"
                disabled={loading}
              />
            </View>

            <View className="form-group">
              <Text className="label">密码</Text>
              <Input
                className="input"
                type="text"
                value={registerForm.values.password}
                onInput={(e) => registerForm.handleChange('password', e.detail.value)}
                onBlur={() => registerForm.handleBlur('password')}
                placeholder="请输入密码（至少6位）"
                password
                disabled={loading}
              />
            </View>

            <Button
              className="submit-button"
              onClick={handleRegister}
              loading={loading}
              disabled={loading}
            >
              {loading ? '注册中...' : '注册'}
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}
