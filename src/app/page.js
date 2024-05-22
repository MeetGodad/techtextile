import React from 'react';
import Header from './Components/Navbar';
import Foooter from './Components/Footer';
const App = () => {
  return (
    <div>
      <Header />
      {/* Other components and content go here */}
      <main>
        <h2>Welcome to Tech Textile</h2>
        {/* More content */}
      </main>
      <Foooter/>
    </div>
  );
};

export default App;