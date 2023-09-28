import React, { useState, useEffect, useRef } from 'react';

interface MultiSelectDropdownProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ title, options, selected, onChange }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const updatedSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(updatedSelected);
  };

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowOptions(false);
    }
  }

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);


  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        style={{
          height: '40px',
          padding: '10px',
          width: '200px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
        onClick={() => setShowOptions(!showOptions)}
      >
        {title}
      </button>
      {showOptions && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              style={{
                zIndex: 1,
                cursor: 'pointer',
                backgroundColor: hoverIndex === index ? '#f1f1f1' : 'transparent',
                border: '1px solid #f1f1f1',
                borderRadius: '4px',
                width: '200px',  // Set the width to match the button
                maxHeight: '200px',  // Set a max height
              }}       
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <input
                type="checkbox"
                id={`option-${index}`}
                value={option}
                checked={selected.includes(option)}
                onChange={handleCheckboxChange}
                style={{ marginRight: '8px' }}
              />
              <label htmlFor={`option-${index}`}>{option}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
