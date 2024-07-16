"use client";
import React, { useState } from 'react';
import Home from "./Home";
import Header from "../components/Navbar";
import Footer from "../components/Footer";


export default function Page() {
  const [category, setCategory] = useState('all');
  const [subCategory, setSubCategory] = useState('');
  const [subSubCategory, setSubSubCategory] = useState('');
  const [searchResults, setSearchResults] = useState([]);
 
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setSubCategory('');
    setSubSubCategory('');
  };
  const handleSubCategoryChange = (event) => {
    setSubCategory(event.target.value);
    setSubSubCategory('');
  };

  const handleSubSubCategoryChange = (event) => {
    setSubSubCategory(event.target.value);
  };

   const handleSearchResults = (results) => {
    setSearchResults(results);
  };

   return (
    <div>
      <div className="flex flex-col min-h-screen">
        <Header
          category={category}
          subCategory={subCategory}
          subSubCategory={subSubCategory}
          onCategoryChange={handleCategoryChange}
          onSubCategoryChange={handleSubCategoryChange}
          onSubSubCategoryChange={handleSubSubCategoryChange}
          onSearchResults={handleSearchResults}
        />
        <div className="flex-grow">
          <Home
            category={category}
            subCategory={subCategory}
            subSubCategory={subSubCategory}
            searchResults={searchResults}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
}