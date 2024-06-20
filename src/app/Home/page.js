"use client";
import React, { useState } from 'react';
import Home from "./Home";
import Header from "../components/Navbar";
import Footer from "../components/Footer";


export default function Page() {
    const [category, setCategory] = useState('all');

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
    return (
    <div>
      <div className="flex flex-col min-h-screen">
        <Header category={category} onCategoryChange={handleCategoryChange} />
        <div className="flex-grow">
          <Home category={category} /> 
        </div>
        <Footer />
      </div>
    </div>
  );
}