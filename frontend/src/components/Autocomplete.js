// frontend/src/components/Autocomplete.js
import React, { useState } from 'react';

const Autocomplete = ({ items, onSelect, inputProps, ...props }) => {
  const [value, setValue] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    setFilteredItems(
      items.filter(item =>
        item.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  };

  const handleSelect = (val) => {
    setValue(val);
    setFilteredItems([]);
    if (onSelect) onSelect(val);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        {...inputProps}  
        {...props}       
      />
      {filteredItems.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto w-full">
          {filteredItems.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
