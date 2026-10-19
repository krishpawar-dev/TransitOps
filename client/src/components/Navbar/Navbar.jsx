import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdNotifications, MdLightMode, MdDarkMode,
  MdPerson, MdLogout, MdSettings, MdSearch, MdMenu
} from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const notifications = [
  { id: 1, msg: 'Vehicle KA-01-AB-1234 needs maintenance', time: '5m ago', unread: true },
  { id: 2, msg: 'Driver Mehul Shah license expiring soon', time: '1h ago', unread: true },
  { id: 3, msg: 'Trip TR-006 is now In Transit', time: '2h ago', unread: false },
  { id: 4, msg: 'Monthly report ready to download', time: '1d ago', unread: false },
];

const Navbar = ({ onMenuToggle, sidebarCollapsed }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('') || 'U';

  return (
    <header className="navbar">
      {/* Left */}
      <div className="navbar-left">
        <button className="navbar-menu-btn" onClick={onMenuToggle} aria-label="Toggle sidebar">
          <MdMenu size={22} />
        </button>
        <div className="navbar-search">
          <MdSearch className="navbar-search-icon" size={18} />
          <input
            type="text"
            placeholder="Search vehicles, drivers, trips..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="navbar-search-input"
          />
        </div>
      </div>

      {/* Right */}
      <div className="navbar-right">
        {/* Dark Mode Toggle */}
        <button
          className="navbar-icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
        </button>

        {/* Notifications */}
        <div className="navbar-dropdown-wrap" ref={notifRef}>
          <button
            className="navbar-icon-btn navbar-notif-btn"
            onClick={() => setNotifOpen(o => !o)}
            aria-label="Notifications"
          >
            <MdNotifications size={20} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="navbar-dropdown notif-dropdown">
              <div className="notif-header">
                <span className="notif-title">Notifications</span>
                <span className="notif-count">{unreadCount} new</span>
              </div>
              <ul className="notif-list">
                {notifications.map(n => (
                  <li key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                    <span className="notif-dot" />
                    <div className="notif-content">
                      <p className="notif-msg">{n.msg}</p>
                      <span className="notif-time">{n.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="notif-footer">
                <button className="notif-all-btn">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="navbar-dropdown-wrap" ref={profileRef}>
          <button
            className="navbar-avatar-btn"
            onClick={() => setProfileOpen(o => !o)}
            aria-label="User menu"
          >
            <div className="navbar-avatar">{initials}</div>
            <div className="navbar-user-info">
              <span className="navbar-user-name">{user?.name || 'User'}</span>
              <span className="navbar-user-role">{user?.role || 'Manager'}</span>
            </div>
          </button>

          {profileOpen && (
            <div className="navbar-dropdown profile-dropdown">
              <div className="profile-header">
                <div className="profile-avatar-lg">{initials}</div>
                <div>
                  <p className="profile-name">{user?.name}</p>
                  <p className="profile-email">{user?.email}</p>
                </div>
              </div>
              <ul className="profile-menu">
                <li>
                  <button onClick={() => { navigate('/settings'); setProfileOpen(false); }}>
                    <MdSettings size={16} /> Profile Settings
                  </button>
                </li>
                <li className="profile-menu-divider" />
                <li>
                  <button className="danger" onClick={handleLogout}>
                    <MdLogout size={16} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
