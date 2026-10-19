import React, { forwardRef } from 'react';
import './Input.css';

/**
 * Reusable Input Component
 */
export const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helper,
  icon,
  iconRight,
  disabled = false,
  required = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 6)}`;
  return (
    <div className={`input-group ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''} ${className}`}>
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label} {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon input-icon-left">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`input-field ${icon ? 'has-icon-left' : ''} ${iconRight ? 'has-icon-right' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        />
        {iconRight && <span className="input-icon input-icon-right">{iconRight}</span>}
      </div>
      {error && <span className="input-error-msg">{error}</span>}
      {helper && !error && <span className="input-helper">{helper}</span>}
    </div>
  );
});

/**
 * Reusable Select Component
 */
export const Select = ({ label, options = [], value, onChange, error, disabled = false, required = false, placeholder = 'Select...', id, className = '', ...props }) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 6)}`;
  return (
    <div className={`input-group ${error ? 'input-error' : ''} ${className}`}>
      {label && (
        <label className="input-label" htmlFor={selectId}>
          {label} {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        <select
          id={selectId}
          className="input-field select-field"
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="select-arrow">▾</span>
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};

/**
 * Reusable Textarea Component
 */
export const Textarea = ({ label, rows = 3, value, onChange, placeholder, error, required = false, id, className = '', ...props }) => {
  const taId = id || `ta-${Math.random().toString(36).substr(2, 6)}`;
  return (
    <div className={`input-group ${error ? 'input-error' : ''} ${className}`}>
      {label && (
        <label className="input-label" htmlFor={taId}>
          {label} {required && <span className="input-required">*</span>}
        </label>
      )}
      <textarea
        id={taId}
        className="input-field textarea-field"
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...props}
      />
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};

Input.displayName = 'Input';
export default Input;
