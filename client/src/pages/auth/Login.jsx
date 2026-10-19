import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdFlashOn, MdDirectionsCar, MdPeople, MdRoute } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: 'admin@transitops.com', password: 'password123', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter email and password.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // simulate API
    const ok = login(form.name, form.email, form.password);
    if (ok) navigate('/dashboard');
    else setError('Invalid credentials.');
    setLoading(false);
  };

  return (
    <div className="login-page">
      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="login-left-content">
          {/* Logo */}
          <motion.div
            className="login-logo"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="login-logo-icon">
              <MdFlashOn size={28} />
            </div>
            <span className="login-logo-text">TransitOps</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            className="login-headline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1>Smart Transport<br />Operations Platform</h1>
            <p>Manage your entire fleet from one intelligent dashboard. Track vehicles, drivers, trips & more in real-time.</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="login-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[
              { icon: <MdDirectionsCar />, value: '12', label: 'Vehicles Tracked' },
              { icon: <MdPeople />, value: '10', label: 'Active Drivers' },
              { icon: <MdRoute />, value: '360+', label: 'Trips Completed' },
            ].map(stat => (
              <div className="login-stat" key={stat.label}>
                <span className="login-stat-icon">{stat.icon}</span>
                <span className="login-stat-value">{stat.value}</span>
                <span className="login-stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Illustration blobs */}
          <div className="login-blob login-blob-1" />
          <div className="login-blob login-blob-2" />
          <div className="login-blob login-blob-3" />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <motion.div
          className="login-form-card"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="login-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your TransitOps account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" id="login-form">
            {error && (
              <div className="login-error">
                <span>{error}</span>
              </div>
            )}

            {/* Name */}
            <div className="login-field">
              <label htmlFor="login-name">Your name</label>
              <div className="login-input-wrap">
                <MdPeople className="login-input-icon" size={18} />
                <input
                  id="login-name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="login-field">
              <label htmlFor="login-email">Email address</label>
              <div className="login-input-wrap">
                <MdEmail className="login-input-icon" size={18} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-field-header">
                <label htmlFor="login-password">Password</label>
                <a href="#" className="login-forgot">Forgot password?</a>
              </div>
              <div className="login-input-wrap">
                <MdLock className="login-input-icon" size={18} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-show-pass"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="login-remember">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
              />
              <span>Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className={`login-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <><span className="login-spinner" /> Signing in...</>
              ) : (
                'Sign in to TransitOps'
              )}
            </button>
          </form>

          <p className="login-demo-hint">
            Enter your name and sign in. Your name and email will appear in your dashboard.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
