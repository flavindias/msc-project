import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Navigation = () => {
  return (
    <nav>
      <Link to="/">Home</Link>

      <Link to="/about">About</Link>
    </nav>
  )
};

const App = () => {
  return (
    <div className="App">
      <Navigation />
    </div>
  );
}

export default App;
