import { Outlet, NavLink } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app-container">
      {/* 侧边导航 */}
      <nav className="sidebar">
        <div className="logo">
          <span className="logo-icon">🎵</span>
          <span className="logo-text">LyricNote</span>
        </div>

        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">🏠</span>
            <span className="nav-text">首页</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">个人中心</span>
          </NavLink>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
