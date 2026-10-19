import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheckCircle, MdError, MdWarning, MdInfo, MdClose } from 'react-icons/md';
import './Toast.css';

// Toast icons by type
const icons = {
  success: <MdCheckCircle size={20} />,
  error: <MdError size={20} />,
  warning: <MdWarning size={20} />,
  info: <MdInfo size={20} />,
};

/**
 * Single Toast Item
 */
export const ToastItem = ({ toast, onDismiss }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (toast.duration !== Infinity) {
      timerRef.current = setTimeout(() => onDismiss(toast.id), toast.duration || 3500);
    }
    return () => clearTimeout(timerRef.current);
  }, [toast, onDismiss]);

  return (
    <motion.div
      className={`toast toast-${toast.type || 'info'}`}
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.22 }}
    >
      <span className="toast-icon">{icons[toast.type] || icons.info}</span>
      <div className="toast-content">
        {toast.title && <p className="toast-title">{toast.title}</p>}
        <p className="toast-message">{toast.message}</p>
      </div>
      <button className="toast-close" onClick={() => onDismiss(toast.id)}>
        <MdClose size={16} />
      </button>
    </motion.div>
  );
};

/**
 * Toast Container
 */
const ToastContainer = ({ toasts, onDismiss }) => {
  return createPortal(
    <div className="toast-container" role="log" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default ToastContainer;
