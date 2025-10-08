import React, { useState, useEffect } from 'react';
import { Database } from './Database';
import VideoPlayer from './VideoPlayer';
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Protect from './Protect';

import '../stylesheets/App.css';
import '../stylesheets/Case.css';

// Hook to scroll to top based on navigation type
export function useScrollToTopWithNavigationType(delay = 300) {
  const location = useLocation();
  const history = useHistory();
  const prevAction = React.useRef(history.action);

  useEffect(() => {
    const currentAction = history.action;

    if (prevAction.current === 'POP') {
      // Immediate scroll on back/forward
      window.scrollTo(0, 0);
    } else {
      // Smooth scroll on normal navigation
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, delay);

      return () => clearTimeout(timer);
    }

    prevAction.current = currentAction;
  }, [location.key, delay, history.action]);
}

const CaseDetail = ({ imageDetails }) => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const item = Database.find(i => i.slug === params.id);
  const currentIndex = Database.findIndex(i => i.slug === params.id);
  const nextIndex = (currentIndex + 1) % Database.length;
  const nextCase = Database[nextIndex];
  const [currentItem] = useState(item);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const transition = { duration: 1.4, ease: [0.6, 0.01, -0.05, 0.9] };
  const isCaseDetailRoute = window.location.pathname.startsWith('/portfolio/');
  const isHomeRoute = window.location.pathname === '/';
  const isItemProtected = (item.protected && !isHomeRoute) || (!isCaseDetailRoute && nextCase.protected && !isHomeRoute);

  const caseVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  // Activate scroll behavior
  useScrollToTopWithNavigationType(500);

  // Resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderProtectedContent = (item, imageDetails, nextCase) => {
    const imageHeaderSrc = item.protected ? currentItem.headerImageRevealed[0].url : currentItem.headerImage[0].url;

    return (
      <motion.div initial="initial" animate="animate" exit="exit" className="case" variants={caseVariants}>
        <div key={currentItem.id} className="caseContainer">
          <div className="caseHeader">
            <div className="caseHeaderContent">
              <div className="caseHeaderImageContainer" style={{ position: 'relative', overflow: 'hidden' }}>
                <motion.img
                  initial={{
                    position: 'fixed',
                    top: '-70vw',
                    left: 0,
                    width: '100vw',
                    height: windowWidth > 1024 ? '70vh' : '50vh',
                    objectFit: 'cover',
                    zIndex: 999,
                  }}
                  animate={{
                    position: 'relative',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: windowWidth > 1024 ? '70vh' : '50vh',
                    transition: { delay: 0.1, ...transition },
                  }}
                  exit={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: windowWidth > 1024 ? '70vh' : '50vh',
                    opacity: 0,
                    transition: { ...transition, duration: 0.5 },
                  }}
                  className="caseHeaderImage"
                  src={imageHeaderSrc}
                  alt={currentItem.title}
                />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.7 } }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                transition={transition}
                className="caseContent"
              >
                <div className="caseItemContainer">
                  <div className="caseCaseItem">
                    <div className="caseTitle" dangerouslySetInnerHTML={{ __html: currentItem.title }} />
                    <div className="caseMetadata">
                      <div className="caseClient"><span className="bold">Client: </span>{currentItem.client}</div>
                      <div className="caseType"><span className="bold">Type: </span>{currentItem.type}</div>
                      <div className="caseProductionCompany"><span className="bold">Production Company </span>{currentItem.productionCompany}</div>
                      <div className="caseDirector"><span className="bold">Director: </span>{currentItem.director}</div>
                      {currentItem.locations && <div className="caseFilmingLocations"><span className="bold">Filming Location: </span>{currentItem.locations}</div>}
                      <div className="caseRole"><span className="bold">Role: </span>{currentItem.role}</div>
                    </div>
                  </div>
                  <div className="caseDescription" dangerouslySetInnerHTML={{ __html: currentItem.description }} />
                </div>

                {/* Videos and images sections */}
                {currentItem.videoOne?.length > 0 && <VideoPlayer videos={currentItem.videoOne} />}
                {currentItem.imageOne?.length > 0 && (
                  <motion.div className="caseImageContainer">
                    {currentItem.imageOne.map(image => (
                      <img className={`caseImage ${image.style || ''}`} key={image.url} src={image.url} alt={image.title} />
                    ))}
                  </motion.div>
                )}
                {currentItem.copyOne && <div className="caseCopyContainer">{currentItem.copyOne}</div>}

                {currentItem.videoTwo?.length > 0 && <VideoPlayer videos={currentItem.videoTwo} />}
                {currentItem.copyTwo && <div className="caseCopyContainer">{currentItem.copyTwo}</div>}
                {currentItem.imageTwo?.length > 0 && (
                  <motion.div className="caseImageContainer">
                    {currentItem.imageTwo.map(image => (
                      <img className={`caseImage ${image.style || ''}`} key={image.url} src={image.url} alt={image.title} />
                    ))}
                  </motion.div>
                )}

                {currentItem.videosTwoPart?.length > 0 && <VideoPlayer videos={currentItem.videosTwoPart} style="--TwoPart" />}
                {currentItem.copyThree && <div className="caseCopyContainer">{currentItem.copyThree}</div>}

                {currentItem.imageThree?.length > 0 && (
                  <motion.div className="caseImageContainer">
                    {currentItem.imageThree.map(image => (
                      <img className={`caseImage ${image.style || ''}`} key={image.url} src={image.url} alt={image.title} />
                    ))}
                  </motion.div>
                )}
                {currentItem.videoThree?.length > 0 && <VideoPlayer videos={currentItem.videoThree} style="--FullWidth" />}
                {currentItem.videosThreePart?.length > 0 && <VideoPlayer videos={currentItem.videosThreePart} style="--ThreePart" />}
                {currentItem.copyFour && <div className="caseCopyContainer">{currentItem.copyFour}</div>}

                {currentItem.imageFour?.length > 0 && (
                  <motion.div className="caseImageContainer">
                    {currentItem.imageFour.map(image => (
                      <img className={`caseImage ${image.style || ''}`} key={image.url} src={image.url} alt={image.title} />
                    ))}
                  </motion.div>
                )}
                {currentItem.videosThreePartTwo?.length > 0 && <VideoPlayer videos={currentItem.videosThreePartTwo} style="--ThreePart" />}
                {currentItem.videosFourPart?.length > 0 && <VideoPlayer videos={currentItem.videosFourPart} style="--FourPart" />}
              </motion.div>

              {/* Navigation buttons */}
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
                  <Link to={`/portfolio/${nextCase.slug}`} key={nextCase.slug}>
                    → Next Case: {nextCase.client} - {nextCase.title}
                  </Link>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (isItemProtected) {
    return (
      <Protect 
        hash="da6f94b6c86922f9ae3293627be27d912d562925a24f6b2643e616b0e0ba50dd32afb336ca4caf080739c9cb35747e0f4e26bcdcb8403a11d8fd0a663cdb3452" 
        blur={true}
      >
        {renderProtectedContent(item, imageDetails, nextCase)}
      </Protect>
    );
  } else {
    return renderProtectedContent(item, imageDetails, nextCase);
  }
}

export default CaseDetail;