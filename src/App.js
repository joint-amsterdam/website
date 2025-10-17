import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ScrollManager from './components/Scrollmanager';
import AnimatedRoutes from './components/AnimatedRoutes';
import MenuOverlay from './components/MenuOverlay';

import '@mux/mux-player';

import './stylesheets/App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <ScrollManager>
          <MenuOverlay />
          <AnimatedRoutes />
        </ScrollManager>
      </Router>
    </div>

  );
}

export default App;