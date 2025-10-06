import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { APP_CONFIG, UI_TEXT } from '@lyricnote/shared'

export default function Layout() {
  return (
    <div className="app-container">
      {/* 侧边导航 */}
      <nav className="sidebar">
        <div className="logo">
          <span className="logo-icon">{APP_CONFIG.icon}</span>
          <span className="logo-text">{APP_CONFIG.name}</span>
        </div>
        
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">🏠</span>
            <span className="nav-text">{UI_TEXT.navigation.home}</span>
          </NavLink>
          
          <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">👤</span>
            <span className="nav-text">{UI_TEXT.navigation.profile}</span>
          </NavLink>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

