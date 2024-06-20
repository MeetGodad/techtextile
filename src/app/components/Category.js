import React, { useState } from 'react';

const Category = ({ category, onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryChange = (event) => {
    onCategoryChange(event);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      <button onClick={handleToggle} className="font-semibold">
        Category
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
          <button onClick={handleCategoryChange} value="all" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            All
          </button>
          <button onClick={handleCategoryChange} value="fabric" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Fabric
          </button>
          <button onClick={handleCategoryChange} value="yarn" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Yarn
          </button>
        </div>
      )}
    </div>
  );
};

export default Category;
