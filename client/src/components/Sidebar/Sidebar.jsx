import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdDashboard, MdDirectionsCar, MdPeople, MdRoute,
  MdBuild, MdLocalGasStation, MdAccountBalance,
  MdBarChart, MdSettings, MdLogout, MdChevronLeft, MdChevronRight,
  MdFlashOn
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
  { path: '/vehicles', label: 'Vehicles', icon: <MdDirectionsCar /> },
  { path: '/drivers', label: 'Drivers', icon: <MdPeople /> },
  { path: '/trips', label: 'Trips', icon: <MdRoute /> },
  { path: '/maintenance', label: 'Maintenance', icon: <MdBuild /> },
  { path: '/fuel', label: 'Fuel Logs', icon: <MdLocalGasStation /> },
  { path: '/expenses', label: 'Expenses', icon: <MdAccountBalance /> },
  { path: '/reports', label: 'Reports', icon: <MdBarChart /> },
  { path: '/settings', label: 'Settings', icon: <MdSettings /> },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <MdFlashOn size={22} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              className="sidebar-logo-text"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
            >
              <span className="sidebar-brand">TransitOps</span>
              <span className="sidebar-tagline">Fleet Manager</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar collapse control */}
      <button className="sidebar-toggle" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        {collapsed ? <MdChevronRight size={18} /> : <MdChevronLeft size={18} />}
      </button>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {!collapsed && <span className="sidebar-section-label">MAIN MENU</span>}
        <ul className="sidebar-list">
          {navItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      className="sidebar-link-label"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button
          className="sidebar-logout"
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
        >
          <span className="sidebar-link-icon"><MdLogout /></span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                className="sidebar-link-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
