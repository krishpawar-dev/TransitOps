import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdPerson, MdNotifications, MdLock, MdLanguage, MdPalette, MdCheck, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import Button from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Settings.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

const Toggle = ({ checked, onChange, label }) => (
  <label className="settings-toggle">
    <span className="settings-toggle-label">{label}</span>
    <div className={`toggle-track ${checked ? 'active' : ''}`} onClick={() => onChange(!checked)}>
      <div className="toggle-thumb" />
    </div>
  </label>
);

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [profile, setProfile] = useState({ name: user?.name || 'Alex Johnson', email: user?.email || 'admin@transitops.com', phone: '+91 98765 43210', role: user?.role || 'Fleet Manager', company: 'TransitOps Pvt. Ltd.' });
  const [notifs, setNotifs] = useState({ emailAlerts: true, smsAlerts: false, pushAlerts: true, maintenanceAlerts: true, tripAlerts: true, fuelAlerts: false, reportAlerts: true });
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <MdPerson /> },
    { id: 'notifications', label: 'Notifications', icon: <MdNotifications /> },
    { id: 'appearance', label: 'Appearance', icon: <MdPalette /> },
    { id: 'security', label: 'Security', icon: <MdLock /> },
    { id: 'language', label: 'Language', icon: <MdLanguage /> },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account preferences</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Sidebar Tabs */}
        <motion.div className="settings-sidebar card" {...fadeUp(0)}>
          {/* Profile Card */}
          <div className="settings-profile-card">
            <div className="settings-avatar">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="settings-profile-info">
              <h4>{profile.name}</h4>
              <p>{profile.role}</p>
            </div>
          </div>
          <nav className="settings-nav">
            {tabs.map(t => (
              <button
                key={t.id}
                className={`settings-nav-item ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <span className="settings-nav-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Content */}
        <div className="settings-content">
          {/* Profile */}
          {activeTab === 'profile' && (
            <motion.div className="card settings-section" {...fadeUp(0.05)}>
              <div className="card-header">
                <h3 className="card-title">Profile Information</h3>
              </div>
              <div className="card-body">
                <div className="settings-avatar-row">
                  <div className="settings-avatar-lg">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <Button variant="secondary" size="sm">Change Photo</Button>
                    <p className="settings-hint">JPG, PNG or GIF – max 2MB</p>
                  </div>
                </div>
                <div className="settings-form-grid">
                  <Input label="Full Name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                  <Input label="Email Address" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                  <Input label="Phone Number" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                  <Input label="Role / Title" value={profile.role} onChange={e => setProfile(p => ({ ...p, role: e.target.value }))} />
                  <Input label="Company" value={profile.company} onChange={e => setProfile(p => ({ ...p, company: e.target.value }))} className="settings-full-col" />
                </div>
                <div className="settings-save-row">
                  <Button onClick={handleSave} icon={saved ? <MdCheck /> : undefined} id="save-profile-btn">
                    {saved ? 'Saved!' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <motion.div className="card settings-section" {...fadeUp(0.05)}>
              <div className="card-header">
                <h3 className="card-title">Notification Preferences</h3>
              </div>
              <div className="card-body">
                <div className="settings-notif-group">
                  <h4 className="settings-group-title">Alert Channels</h4>
                  <Toggle checked={notifs.emailAlerts} onChange={v => setNotifs(p => ({ ...p, emailAlerts: v }))} label="Email Alerts" />
                  <Toggle checked={notifs.smsAlerts} onChange={v => setNotifs(p => ({ ...p, smsAlerts: v }))} label="SMS Alerts" />
                  <Toggle checked={notifs.pushAlerts} onChange={v => setNotifs(p => ({ ...p, pushAlerts: v }))} label="Push Notifications" />
                </div>
                <div className="settings-notif-group">
                  <h4 className="settings-group-title">Alert Types</h4>
                  <Toggle checked={notifs.maintenanceAlerts} onChange={v => setNotifs(p => ({ ...p, maintenanceAlerts: v }))} label="Maintenance Alerts" />
                  <Toggle checked={notifs.tripAlerts} onChange={v => setNotifs(p => ({ ...p, tripAlerts: v }))} label="Trip Status Updates" />
                  <Toggle checked={notifs.fuelAlerts} onChange={v => setNotifs(p => ({ ...p, fuelAlerts: v }))} label="Fuel Level Alerts" />
                  <Toggle checked={notifs.reportAlerts} onChange={v => setNotifs(p => ({ ...p, reportAlerts: v }))} label="Monthly Report Ready" />
                </div>
                <div className="settings-save-row">
                  <Button onClick={handleSave} id="save-notifications-btn">{saved ? 'Saved!' : 'Save Preferences'}</Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <motion.div className="card settings-section" {...fadeUp(0.05)}>
              <div className="card-header">
                <h3 className="card-title">Appearance</h3>
              </div>
              <div className="card-body">
                <div className="settings-theme-section">
                  <h4 className="settings-group-title">Theme</h4>
                  <div className="theme-options">
                    {[{ id: 'light', label: 'Light', desc: 'Clean & bright interface' }, { id: 'dark', label: 'Dark', desc: 'Easy on the eyes' }].map(t => (
                      <button key={t.id} className={`theme-option ${theme === t.id ? 'selected' : ''}`} onClick={() => theme !== t.id && toggleTheme()} id={`theme-${t.id}`}>
                        <div className={`theme-preview theme-preview-${t.id}`} />
                        <div className="theme-option-info">
                          <span className="theme-option-label">{t.label}</span>
                          <span className="theme-option-desc">{t.desc}</span>
                        </div>
                        {theme === t.id && <MdCheck className="theme-check" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-color-section">
                  <h4 className="settings-group-title">Accent Color</h4>
                  <div className="color-options">
                    {['#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706', '#0E7490'].map(c => (
                      <button key={c} className="color-option" style={{ background: c }} title={c}>
                        {c === '#2563EB' && <MdCheck size={14} style={{ color: '#fff' }} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <motion.div className="card settings-section" {...fadeUp(0.05)}>
              <div className="card-header">
                <h3 className="card-title">Security</h3>
              </div>
              <div className="card-body">
                <h4 className="settings-group-title">Change Password</h4>
                <div className="settings-form-grid">
                  <div className="settings-pass-field">
                    <Input label="Current Password" type={showOldPass ? 'text' : 'password'} value={passwords.old} onChange={e => setPasswords(p => ({ ...p, old: e.target.value }))}
                      iconRight={<button type="button" onClick={() => setShowOldPass(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)' }}>{showOldPass ? <MdVisibilityOff /> : <MdVisibility />}</button>}
                    />
                  </div>
                  <div className="settings-pass-field">
                    <Input label="New Password" type={showNewPass ? 'text' : 'password'} value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))}
                      iconRight={<button type="button" onClick={() => setShowNewPass(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)' }}>{showNewPass ? <MdVisibilityOff /> : <MdVisibility />}</button>}
                    />
                  </div>
                  <Input label="Confirm New Password" type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} className="settings-full-col" />
                </div>
                <div className="settings-save-row">
                  <Button variant="danger" onClick={handleSave} id="change-password-btn">Update Password</Button>
                </div>

                <div className="settings-security-info">
                  <h4 className="settings-group-title" style={{ marginTop: 24 }}>Account Security</h4>
                  {[{ label: 'Two-Factor Authentication', status: 'Not enabled', btn: 'Enable 2FA' },
                    { label: 'Active Sessions', status: '1 active session', btn: 'Revoke All' },
                    { label: 'Login History', status: 'Last login: just now', btn: 'View History' }].map(item => (
                    <div key={item.label} className="security-row">
                      <div>
                        <p className="security-row-label">{item.label}</p>
                        <p className="security-row-status">{item.status}</p>
                      </div>
                      <Button variant="secondary" size="sm">{item.btn}</Button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Language */}
          {activeTab === 'language' && (
            <motion.div className="card settings-section" {...fadeUp(0.05)}>
              <div className="card-header">
                <h3 className="card-title">Language & Region</h3>
              </div>
              <div className="card-body">
                <div className="language-options">
                  {[{ code: 'en', label: 'English', flag: '🇮🇳', region: 'India' },
                    { code: 'hi', label: 'Hindi', flag: '🇮🇳', region: 'India' },
                    { code: 'ta', label: 'Tamil', flag: '🇮🇳', region: 'India' },
                    { code: 'te', label: 'Telugu', flag: '🇮🇳', region: 'India' }].map(lang => (
                    <button key={lang.code} className={`language-option ${lang.code === 'en' ? 'selected' : ''}`} id={`lang-${lang.code}`}>
                      <span className="lang-flag">{lang.flag}</span>
                      <div>
                        <p className="lang-name">{lang.label}</p>
                        <p className="lang-region">{lang.region}</p>
                      </div>
                      {lang.code === 'en' && <MdCheck className="lang-check" />}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
