import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MdHome, MdWarning } from 'react-icons/md';
import './NotFound.css';

const NotFound = () => (
  <div className="notfound-page">
    <motion.div
      className="notfound-content"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="notfound-icon"><MdWarning size={48} /></div>
      <h1 className="notfound-code">404</h1>
      <h2 className="notfound-title">Page Not Found</h2>
      <p className="notfound-desc">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" className="notfound-btn">
        <MdHome size={18} /> Go to Dashboard
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
