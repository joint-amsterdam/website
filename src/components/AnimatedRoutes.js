import React, { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import Home from '../components/Home';
import CaseDetail from './CaseDetail';
import About from '../components/About';
import Work from '../components/Work';
import { AnimatePresence } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Create an event listener for the resize event
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    // Add the event listener when the component mounts
    window.addEventListener('resize', handleResize);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array to only add/remove the event listener on mount/unmount

  const imageDetails = {
    width: '46vw',
    height: windowWidth > 1024 ? '56vh' : '36vh',
  }
  
  return (
    <AnimatePresence initial={false}>
      <Switch location={location} key={location.pathname} >
        <Route exact path="/" render={() => <Home imageDetails={imageDetails} />} />
        <Route path="/work" render={() => <Work />} />
        <Route path="/about" render={() => <About />} />
        <Route path="/portfolio/:id" render={() => <CaseDetail imageDetails={imageDetails} />} />
        <Route path="*" render={() => <Home imageDetails={imageDetails} />} />
      </Switch>
    </AnimatePresence>
  );
  
}

export default AnimatedRoutes;

