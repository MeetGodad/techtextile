import React, { useState } from 'react';

const CategoryDropdown = ({ category, subCategory, subSubCategory, onCategoryChange, onSubCategoryChange, onSubSubCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [isSubSubOpen, setIsSubSubOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setIsSubOpen(false);
    setIsSubSubOpen(false);
  };

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'fabric', label: 'Fabric' },
    { value: 'yarn', label: 'Yarn' },
  ];

  const fabricSubCategories = [
    { value: 'fabric_print_tech', label: 'Print Tech' },
    { value: 'fabric_material', label: 'Material' },
  ];

  const yarnSubCategories = [
    { value: 'Wool', label: 'Wool' },
    { value: 'Cotton', label: 'Cotton' },
    { value: 'Linen', label: 'Linen' },
    { value: 'Polyster', label: 'Polyster' },
    { value: 'Nylon', label: 'Nylon' },
    { value: 'Silk', label: 'Silk' },
    { value: 'Acrylic', label: 'Acrylic' },
    { value: 'All Yarns', label: 'All Yarns' },
  ];

  const subSubCategories = {
    fabric: {
      fabric_print_tech: [
     { value: 'Handblock & Dyed', label: 'Handblock & Dyed' },
      { value: 'Screen Print', label: 'Screen Print' },
      { value: 'Digital Print', label: 'Digital Print' },
      { value: 'Marble Print', label: 'Marble Print' },
      { value : 'Plain', label: 'Plain'},
      { value: 'Other', label: 'Other' },
      ],
      fabric_material: [
        { value: 'Viscose', label: 'Viscose' },
        { value: 'Cotton', label: 'Cotton' },
        { value: 'Silk & Blends', label: 'Silk & Blends' },
        { value: 'Linen', label: 'Linen' },
        { value: 'Polyester', label: 'Polyester' },
        { value: 'Sustainable', label: 'Sustainable' },
        { value: 'Wool', label: 'Wool' },
        { value: 'Nylon', label: 'Nylon' },
        { value: 'All Fabrics', label: 'All Fabrics' },
      ],
    },
  };

  const handleCategoryChange = (e) => {
    onCategoryChange(e);
    setIsSubOpen(true);
    setIsSubSubOpen(false);
  };

  const handleSubCategoryChange = (e) => {
  onSubCategoryChange(e);
  // Check if the current category is not 'fabric' before closing the submenu
  if (category !== 'fabric') {
    setIsSubOpen(false)
    setIsOpen(false);
  }
  setIsSubSubOpen(true);
};

  const handleSubSubCategoryChange = (e) => {
    onSubSubCategoryChange(e);
    setIsOpen(false);
    setIsSubOpen(false);
    setIsSubSubOpen(false);
  };

  return (
    <div className="relative z-50 ">
      <button onClick={handleToggle} className="font-semibold">
        Category
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-200 border border-gray-200 rounded shadow-lg z-50">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={(e) => handleCategoryChange(e)}
              value={cat.value}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
      {category === 'fabric' && (
        <div className="absolute  ml-2 mt-2 w-48 bg-gray-200 border text-center border-gray-200 rounded shadow-lg z-50" style={{ position: 'absolute', top: '75px', width: '144px', marginLeft: '85px' }}>
          {fabricSubCategories.map((subCat) => (
            <button
              key={subCat.value}
              onClick={(e) => handleSubCategoryChange(e)}
              value={subCat.value}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {subCat.label}
            </button>
          ))}
        
      
      {category === 'yarn' && (
        <div className="absolute ml-2 mt-2 w-48 bg-gray-200 border border-gray-200 rounded shadow-lg z-50" style={{ position: 'absolute', top: '75px', width: '144px', marginLeft: '85px' }}>
          {yarnSubCategories.map((subCat) => (
            <button
              key={subCat.value}
              onClick={(e) => handleSubCategoryChange(e)}
              value={subCat.value}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {subCat.label}
            </button>
          ))}
        </div>
      )}
      {subCategory && subSubCategories[category] && subSubCategories[category][subCategory] && (
        <div className="absolute  ml-2 mt-2 w-48 bg-gray-200 border border-gray-200 rounded shadow-lg z-50" style={{ position: 'absolute', top: '105px', width: '144px', marginLeft: '230px' }}>
          {subSubCategories[category][subCategory].map((subSubCat) => (
            <button
              key={subSubCat.value}
              onClick={(e) => handleSubSubCategoryChange(e)}
              value={subSubCat.value}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {subSubCat.label}
            </button>
          ))}
        </div>
          )}
      </div>
      )}
    </div>

  );
};

export default CategoryDropdown;
