import { useState } from 'react';
import { useAuth, useAuthForm } from '@lyricnote/shared';
import { apiService } from '../services/api';

export default function ProfilePage() {
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
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password } = loginForm.values;
    if (!email || !password) {
      alert('请输入邮箱和密码');
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      loginForm.reset();
      alert('登录成功！');
    } else {
      alert(result.error || '登录失败');
    }
  };

  // 处理注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password, username } = registerForm.values;
    if (!email || !password || !username) {
      alert('请填写所有字段');
      return;
    }

    if (password.length < 6) {
      alert('密码长度至少6位');
      return;
    }

    const result = await register(email, password, username);

    if (result.success) {
      registerForm.reset();
      alert('注册成功！');
    } else {
      alert(result.error || '注册失败');
    }
  };

  // 处理登出
  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      logout();
    }
  };

  // 加载中状态
  if (checkingAuth) {
    return (
      <div className="page-container">
        <div className="profile-card">
          <div className="loading">正在加载...</div>
        </div>
      </div>
    );
  }

  // 已登录状态
  if (isLoggedIn && user) {
    return (
      <div className="page-container">
        <div className="profile-card">
          <h2 className="profile-title">个人信息</h2>

          <div className="user-info">
            <div className="avatar">
              {user.username?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
            </div>

            <div className="user-details">
              <div className="user-name">{user.username || '未设置用户名'}</div>
              <div className="user-email">{user.email}</div>
              {user.role && (
                <div className="user-role">
                  {user.role === 'SUPER_ADMIN' && (
                    <span className="role-badge super-admin">超级管理员</span>
                  )}
                  {user.role === 'ADMIN' && <span className="role-badge admin">管理员</span>}
                  {user.role === 'USER' && <span className="role-badge user">普通用户</span>}
                </div>
              )}
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout} disabled={loading}>
            {loading ? '退出中...' : '退出登录'}
          </button>
        </div>
      </div>
    );
  }

  // 未登录状态 - 登录/注册表单
  return (
    <div className="page-container">
      <div className="profile-card">
        <div className="tabs">
          <button className={`tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
            登录
          </button>
          <button className={`tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
            注册
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="auth-form">
            <h2 className="form-title">登录账号</h2>

            <div className="form-group">
              <label>邮箱</label>
              <input
                type="email"
                value={loginForm.values.email}
                onChange={(e) => loginForm.handleChange('email', e.target.value)}
                onBlur={() => loginForm.handleBlur('email')}
                placeholder="请输入邮箱"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>密码</label>
              <input
                type="password"
                value={loginForm.values.password}
                onChange={(e) => loginForm.handleChange('password', e.target.value)}
                onBlur={() => loginForm.handleBlur('password')}
                placeholder="请输入密码"
                disabled={loading}
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <h2 className="form-title">注册账号</h2>

            <div className="form-group">
              <label>用户名</label>
              <input
                type="text"
                value={registerForm.values.username}
                onChange={(e) => registerForm.handleChange('username', e.target.value)}
                onBlur={() => registerForm.handleBlur('username')}
                placeholder="请输入用户名"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>邮箱</label>
              <input
                type="email"
                value={registerForm.values.email}
                onChange={(e) => registerForm.handleChange('email', e.target.value)}
                onBlur={() => registerForm.handleBlur('email')}
                placeholder="请输入邮箱"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>密码</label>
              <input
                type="password"
                value={registerForm.values.password}
                onChange={(e) => registerForm.handleChange('password', e.target.value)}
                onBlur={() => registerForm.handleBlur('password')}
                placeholder="请输入密码（至少6位）"
                disabled={loading}
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? '注册中...' : '注册'}
            </button>
          </form>
        )}
      </div>

      <style>{`
        .page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 60px);
          padding: 20px;
        }

        .profile-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 32px;
          min-width: 400px;
          max-width: 500px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }

        .profile-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 24px;
          text-align: center;
        }

        .user-info {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          padding: 20px;
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          border-radius: 12px;
          color: white;
        }

        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 600;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .user-email {
          opacity: 0.9;
          font-size: 14px;
        }

        .user-role {
          margin-top: 8px;
        }

        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          background: rgba(255, 255, 255, 0.3);
        }

        .logout-button {
          width: 100%;
          padding: 12px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .logout-button:hover:not(:disabled) {
          background: #dc2626;
        }

        .logout-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          padding: 12px;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab.active {
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          color: white;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-title {
          font-size: 20px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 8px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .form-group input {
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #8b5cf6;
        }

        .form-group input:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        .submit-button {
          padding: 12px;
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          opacity: 0.9;
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
