import React from 'react';
import './Badge.css';

/**
 * Reusable Badge Component
 * Variants map to status colors
 */
const Badge = ({ children, variant = 'default', size = 'sm', dot = false }) => {
  return (
    <span className={`badge badge-${variant} badge-${size} ${dot ? 'badge-dot' : ''}`}>
      {dot && <span className="badge-dot-indicator" />}
      {children}
    </span>
  );
};

export default Badge;
