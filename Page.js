import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Category from './pages/Category';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AddItem from './pages/AddItem';
import SignUpSeller from './pages/SignUpSeller';
import LogInSeller from './pages/LogInSeller';
import ListedItems from './pages/ListedItems';
import EditItem from './pages/EditItem';
import HelpSupport from './pages/HelpSupport';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Page = () => {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/additem" component={AddItem} />
        <Route path="/signup-seller" component={SignUpSeller} />
        <Route path="/login-seller" component={LogInSeller} />
      </Switch>
      <Footer />
    </div>
  );
};

export default Page;
