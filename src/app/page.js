import React from 'react';
import Header from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  return (
    <div>
      <Header/>
      <main>
        <h2>Welcome to Tech Textile </h2>
      </main>
      <Footer/>
    </div>
  );
};

export default App;