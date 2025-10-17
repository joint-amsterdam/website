// src/components/Home.js
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client, urlFor } from './sanityClient';

import '../stylesheets/DarkMode.css';
import '../stylesheets/App.css';
import '../stylesheets/Work.css';

const fadeTransition = { delay: 0.5, duration: 0.8, ease: 'easeOut' };

const MuxVideo = ({ playbackId }) => {
  const playerRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const posterUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;

  useEffect(() => {
    const el = playerRef.current;
    if (!el) return;

    const handleLoadedData = () => setIsLoaded(true);

    el.addEventListener('loadeddata', handleLoadedData);
    el.muted = true;
    el.play().catch(() => {});

    const handleTimeUpdate = () => {
      if (el.currentTime >= 5) {
        el.currentTime = 0;
        el.play();
      }
    };
    el.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      el.removeEventListener('timeupdate', handleTimeUpdate);
      el.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {!isLoaded && (
        <img
          src={posterUrl}
          alt="Video preview"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            inset: 0,
          }}
        />
      )}
      <mux-player
        ref={playerRef}
        playback-id={playbackId}
        autoPlay
        muted
        loop={false}
        no-controls
        playsinline
        poster={posterUrl}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          visibility: isLoaded ? 'visible' : 'hidden',
        }}
      />
    </div>
  );
};


const Home = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    client
      .fetch(`*[_type == "case" && (!defined(archived) || archived == false)] | order(order asc){
        title,
        slug,
        client,
        layoutType,
        order,
        headerImage,
        headerVideo{
          asset->{
            _id,
            playbackId
          }
        }
      }`)
      .then((data) => setCases(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="work">
      <div className="workGrid">
        {cases.map((item) => (
          <Link
            to={`/portfolio/${item.slug.current}`}
            key={item.slug.current}
            className={`workItem ${item.layoutType || 'wide'}`} // wide / square / wideHalf
          >
            <div className="workMediaWrapper">
              {item.headerVideo?.asset?.playbackId ? (
                <MuxVideo playbackId={item.headerVideo.asset.playbackId} />
              ) : item.headerImage?.length ? (
                <img
                  src={urlFor(item.headerImage[0]).url()}
                  alt={item.headerImage[0].alt || item.title}
                  className="workImage"
                />
              ) : null}
            </div>

            <div className={`workTitle ${item.layoutType || 'wide'}`}>
              <span className="workProject">{item.title}</span>
              <span className="workClient">{item.client}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
