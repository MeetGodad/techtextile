import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to= ""/>Home</li>
        <li><Link to="/cart">Cart</Link></li>
        <li><Link to="/additem">Add Item</Link></li>
        <li><Link to="/signup-seller">Sign Up Seller</Link></li>
        <li><Link to="/login-seller">Log In Seller</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
