import React, { useState, useEffect } from 'react';
import { Database } from './Database';
import { Link, useHistory } from 'react-router-dom';
import { motion } from 'framer-motion/dist/framer-motion';
import ProgressBar from 'react-bootstrap/ProgressBar';

import '../stylesheets/DarkMode.css';
import '../stylesheets/App.css';
import '../stylesheets/Home.css';


const transition = { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96 ], delay: 0.3 };
const transitionContent = { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96 ] };

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
        <div className="showcaseNav">
            <motion.div exit={{opacity: 0}} transition={transition} className="showcaseProgress">
                <ProgressBar className="showcaseProgressBar">
                    <ProgressBar animated className="showcaseProgressCurrent" now={currentCase} max={totalCases} />
                </ProgressBar>
                <div className="showcaseProgressStatus">{(currentCase < 10 ? '0'+(currentCase) : currentCase) + ' - ' + (totalCases < 10 ? '0'+(totalCases) : totalCases)} </div>
            </motion.div>
        </div>


        <div className="showcaseList">
            {items.map((item, i) =>
                <Link to={`/portfolio/${item.slug}`} key={item.slug}>
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{opacity: 0}} 
                      transition={transitionContent} 
                      className="showcaseItem" 
                      data-img={item.headerImage.url} 
                      onMouseOver={() => showImage(item, i)} 
                      onMouseLeave={hideImage
                    }>
                        <div className="showcaseItemDetail">{(i<9 ? '0'+(i+1) : i+1) + ' - ' + item.type}</div>
                        <div className="showcaseTitle">{item.client + ' - ' + item.title}</div>
                    </motion.div>
                </Link>
            )}
        </div>

        <img 
          className={'showcaseImage ' + classImage} 
          src={imageSource} 
          alt="" 
          ref={image}
          style={{
            width: imageDetails.width,
            height: imageDetails.height,
          }}>
        </img>
    </div>
  );
};

export default Home;