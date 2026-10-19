import React from 'react';
import { motion } from 'framer-motion';
import './EmptyState.css';
import { MdInbox } from 'react-icons/md';

/**
 * Empty State Component
 */
const EmptyState = ({ icon, title = 'No data found', subtitle, action }) => {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="empty-state-icon">
        {icon || <MdInbox size={40} />}
      </div>
      <h4 className="empty-state-title">{title}</h4>
      {subtitle && <p className="empty-state-subtitle">{subtitle}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
