import React, { useState, useEffect } from 'react';
import { Database } from './Database';
import VideoPlayer from './VideoPlayer';
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion/dist/framer-motion';
import Protect from 'react-app-protect';
import "react-app-protect/dist/index.css";

import '../stylesheets/App.css';
import '../stylesheets/Case.css';

const CaseDetail = ({ imageDetails }) => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams(); // get the id parameter from the URL
  const item = Database.find(i => i.slug === params.id); // find the corresponding item in the Database array
  const currentIndex = Database.findIndex((item) => item.slug === params.id);
  const nextIndex = (currentIndex + 1) % Database.length; // Ensure it loops back to the first case if it's the last one
  const nextCase = Database[nextIndex];
  const [currentItem] = useState(item); // set state to store the selected item
  const transition = { duration: 1.4, ease: [0.6, 0.01, -0.05, 0.9] };
  const isCaseDetailRoute = window.location.pathname.startsWith('/portfolio/');
  const isHomeRoute = window.location.pathname === '/';
  const isItemProtected = (item.protected && !isHomeRoute)|| (!isCaseDetailRoute && nextCase.protected && !isHomeRoute);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Create an event listener for the resize event
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);     // Add the event listener when the component mounts
    const unlisten = history.listen(() => {        // Listen for changes in the location
      window.scrollTo(0, 0);         // Scroll to the top of the page
    });

    return () => {
      unlisten();
      window.removeEventListener('resize', handleResize);     // Remove the event listener when the component unmounts
    };
  }, [history, location.pathname]); // Empty dependency array to only add/remove the event listener on mount/unmount

  const renderProtectedContent = (item, imageDetails, nextCase) => {
    let imageHeaderSrc = item.protected ? currentItem.headerImageRevealed[0].url : currentItem.headerImage[0].url;

    return (
      <motion.div initial="initial"  animate="animate" exit="exit" className="case">
        <div key={currentItem.id} className="caseContainer">
          <div className="caseHeader">
            <div className="caseHeaderContent">
              <div className="caseHeaderImageContainer">
                <motion.img 
                  initial={{
                    left: windowWidth > 1024 ? '47vw' : '26vw',
                    top: windowWidth > 1024 ? '22vh' : '32vh',
                    width: imageDetails.width,
                    height: imageDetails.height,
                  }}
                  animate={{
                    left: "0",
                    top: "10vh",
                    width: "100%",
                    height: windowWidth > 1024 ? '60vh' : '60vh',
                    transition: { delay: 0.1, ...transition },
                  }}
                  exit={{
                    left: windowWidth > 1024 ? '47vw' : '26vw',
                    top: windowWidth > 1024 ? '22vh' : '32vh',
                    width: imageDetails.width,
                    height: imageDetails.height,
                    opacity: 0,
                    transition: { transition: 0.1, ...transition },
                  }}
                  className="caseHeaderImage" 
                  src={imageHeaderSrc} 
                  alt={currentItem.title}
                  onTransitionEnd={() => {console.log("transition ended")}}
                />
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.7 } }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                transition={transition}
                className="caseContent">            
                  <div className="caseItemContainer">
                      <div className="caseCaseItem">
                          <div className="caseTitle" dangerouslySetInnerHTML={ { __html: currentItem.title } } />
                          <div className="caseMetadata">
                              <div className="caseClient"><span className="bold">Client: </span> {currentItem.client} </div> 
                              <div className="caseType"><span className="bold">Type: </span> {currentItem.type} </div> 
                              <div className="caseProductionCompany"><span className="bold">Production Company </span> {currentItem.productionCompany} </div> 
                              <div className="caseDirector"><span className="bold">Director: </span> {currentItem.director} </div> 
                              {currentItem.locations !== "" && (
                                <div className="caseFilmingLocations" ><span className="bold">Filming Location: </span> {currentItem.locations} </div>
                              )}
                              <div className="caseRole"><span className="bold">Role: </span> {currentItem.role} </div> 
                          </div>
                      </div>
                      <div className="caseDescription" dangerouslySetInnerHTML={ { __html: currentItem.description } } />
                  </div>

                  {currentItem.videoOne && currentItem.videoOne.length > 0 && (
                    <VideoPlayer videos={currentItem.videoOne} />
                  )}

                  {currentItem.imageOne && currentItem.imageOne.length > 0 && (
                    <motion.div className="caseImageContainer">
                      {currentItem.imageOne.map((image, index) => (
                        <img 
                          className={`caseImage ${image.style ? image.style : ''}`}
                          key={image.url} 
                          src={image.url} 
                          alt={image.title} 
                        />
                      ))}
                    </motion.div>
                  )}

                  {currentItem.copyOne && currentItem.copyOne.length > 0 && (
                    <div className="caseCopyContainer">{currentItem.copyOne}</div>
                  )}
                                    
                  {currentItem.videoTwo && currentItem.videoTwo.length > 0 && (
                    <VideoPlayer videos={currentItem.videoTwo} />
                  )}

                  {currentItem.copyTwo && currentItem.copyTwo.length > 0 && (
                    <div className="caseCopyContainer">{currentItem.copyTwo}</div>
                  )}

                  {currentItem.imageTwo && currentItem.imageTwo.length > 0 && (
                    <motion.div className="caseImageContainer">
                      {currentItem.imageTwo.map((image, index) => (
                        <img 
                          className={`caseImage ${image.style ? image.style : ''}`}
                          key={image.url} 
                          src={image.url} 
                          alt={image.title} 
                        />
                      ))}
                    </motion.div>
                  )}
                                    
                  {currentItem.videosTwoPart && currentItem.videosTwoPart.length > 0 && (
                    <VideoPlayer videos={currentItem.videosTwoPart} style="--TwoPart" />
                  )}

                  {currentItem.copyThree && currentItem.copyThree.length > 0 && (
                    <div className="caseCopyContainer">{currentItem.copyThree}</div>
                  )}

                  {currentItem.imageThree && currentItem.imageThree.length > 0 && (
                    <motion.div className="caseImageContainer">
                      {currentItem.imageThree.map((image, index) => (
                        <img 
                          className={`caseImage ${image.style ? image.style : ''}`}
                          key={image.url} 
                          src={image.url} 
                          alt={image.title} 
                        />
                      ))}
                    </motion.div>
                  )}

                  {currentItem.videoThree && currentItem.videoThree.length > 0 && (
                    <VideoPlayer videos={currentItem.videoThree} style="--FullWidth" />
                  )}
                                    
                  {currentItem.videosThreePart && currentItem.videosThreePart.length > 0 && (
                    <VideoPlayer videos={currentItem.videosThreePart} style="--ThreePart" />
                  )}

                  {currentItem.copyFour && currentItem.copyFour.length > 0 && (
                    <div className="caseCopyContainer">{currentItem.copyFour}</div>
                  )}
                
                  {currentItem.imageFour && currentItem.imageFour.length > 0 && (
                    <motion.div className="caseImageContainer">
                      {currentItem.imageFour.map((image, index) => (
                        <img 
                          className={`caseImage ${image.style ? image.style : ''}`}
                          key={image.url} 
                          src={image.url} 
                          alt={image.title} 
                        />
                      ))}
                    </motion.div>
                  )}

                  {currentItem.videosThreePartTwo && currentItem.videosThreePartTwo.length > 0 && (
                    <VideoPlayer videos={currentItem.videosThreePartTwo} style="--ThreePart" />
                  )}
          
                  {currentItem.videosFourPart && currentItem.videosFourPart.length > 0 && (
                    <VideoPlayer videos={currentItem.videosFourPart} style="--FourPart" />
                  )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.7 } }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                transition={transition}
                className="caseButtons"
              >
                <div className="caseBackButton">
                  <Link to="/">Back ←</Link>
                </div>
                <div className="caseNextCaseButton">
                  <Link to={`/portfolio/${nextCase.slug}`} key={nextCase.slug}>→ Next Case: {nextCase.client} - {nextCase.title}</Link>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </motion.div>
    )
  };

  if (isItemProtected) {
    return (
      <Protect sha512="54f4a6ed409a7bb1c4856e32ceae96c551ecacf9cd8a3ecaa2e7c5d773736bfc66fc94c559014df42917498604d87e799321b169dcab38942166e8d6e3744134" blur>
        {renderProtectedContent(item, imageDetails, nextCase)}
      </Protect>
    );
  } else {
    return renderProtectedContent(item, imageDetails, nextCase);
  }
}

export default CaseDetail;