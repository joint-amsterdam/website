import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Nav from './components/Nav';
import ScrollManager from './components/Scrollmanager';
import AnimatedRoutes from './components/AnimatedRoutes';

import './stylesheets/App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <ScrollManager>
          <Nav />
          <AnimatedRoutes />
        </ScrollManager>
      </Router>
    </div>

  );
}

export default App;