import React, { useRef, useEffect } from 'react';
import { MdSearch, MdClose } from 'react-icons/md';
import './SearchBar.css';

/**
 * Reusable SearchBar Component
 */
const SearchBar = ({ value, onChange, placeholder = 'Search...', onClear, className = '' }) => {
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange({ target: { value: '' } });
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className={`searchbar ${className}`}>
      <MdSearch className="searchbar-icon" size={18} />
      <input
        ref={inputRef}
        type="text"
        className="searchbar-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {value && (
        <button className="searchbar-clear" onClick={handleClear} aria-label="Clear search">
          <MdClose size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
