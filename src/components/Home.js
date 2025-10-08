import React, { useState, useEffect } from 'react';
import { Database } from './Database';
import { Link, useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';

import '../stylesheets/DarkMode.css';
import '../stylesheets/App.css';
import '../stylesheets/Home.css';

const transition = { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96 ], delay: 0.3 };
const transitionContent = { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96 ] };
const fadeTransition = { delay: 0.5, duration: 0.8, ease: 'easeOut' };


const Home = ({ imageDetails, image }) => {
  const items = Database;
  const [imageSource, setImageSource] = useState('');
  const [classImage, setClassImage] = useState('');
  const [currentCase, setCurrentCase] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false); // State to track transitions
  const [isNavigating, setIsNavigating] = useState(false);
  const totalCases = items.length;
  const history = useHistory();

  const showImage = (item, i) => {
    if (!isTransitioning && !isNavigating && history.location.pathname === '/') {
      setImageSource(item.headerImage[0].url);
      setClassImage('showcaseImage--visible');
      setCurrentCase(i + 1);
    }
  };
  
  const hideImage = () => {
    if (!isTransitioning) {
      // Only hide the image if you're not navigating
      if (!isNavigating) {
        setImageSource('#');
        setClassImage('');
      }
    }
  };

  // Use useEffect to detect route changes
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsTransitioning(true);
    };

    const handleRouteChangeComplete = () => {
      setIsTransitioning(false);
    };

    const unlisten = history.listen((location, action) => {
      if (action === 'PUSH' || action === 'REPLACE') {
        // A new route is being pushed or replaced, set isNavigating to true.
        setIsNavigating(true);
      }
    });

    // Attach and detach event listeners
    window.addEventListener('routeChangeStart', handleRouteChangeStart);
    window.addEventListener('routeChangeComplete', handleRouteChangeComplete);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('routeChangeStart', handleRouteChangeStart);
      window.removeEventListener('routeChangeComplete', handleRouteChangeComplete);
      unlisten();
    };
  }, [history]);

  return (
    <div className="showcase">
      <div className="showcaseList">
        {items.map((item, i) =>
          <Link to={`/portfolio/${item.slug}`} key={item.slug}>
            <motion.div 
              key={i} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1, transition: fadeTransition }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              className="showcaseItem"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
              {item.headerImage && item.headerImage[0] && (
                <img 
                  src={item.headerImage[0].url} 
                  alt={item.headerImage[0].title} 
                  className="showcaseGridImage" 
                />
              )}
            </motion.div>

            <motion.div 
              key={i} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: fadeTransition }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              className="showcaseTitle"
            >
              <span className="showcaseClient">{item.client}</span>
              <span className="showcaseProject">{item.title}</span>
            </motion.div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;