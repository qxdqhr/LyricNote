import { useState, useEffect } from 'react';
import { apiService, User } from '../services/api';
import { APP_TITLES, APP_CONFIG } from '@lyricnote/shared';

export default function HomePage() {
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
    <div className="page home-page">
      <div className="page-header">
        <h1 className="page-title">{APP_TITLES.main}</h1>
      </div>

      <div className="page-content">
        <div className="welcome-section">
          <div className="emoji-large">🎵</div>
          <h2 className="welcome-title">{APP_TITLES.welcome}</h2>
          <p className="welcome-subtitle">{APP_CONFIG.description}</p>

          {!loading && user && <div className="user-welcome">你好，{user.username}！</div>}

          {!loading && !user && <div className="auth-hint">请前往"我的"页面登录</div>}
        </div>
      </div>
    </div>
  );
}
