// src/components/Home.js
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client, urlFor } from './sanityClient';

import '../stylesheets/DarkMode.css';
import '../stylesheets/App.css';
import '../stylesheets/Home.css';

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
    <div className="home">
      <div className="homeGrid">
        {cases.map((item) => (
          <Link
            to={`/portfolio/${item.slug.current}`}
            key={item.slug.current}
            className={`homeItem ${item.layoutType || 'wide'}`} // wide / square / wideHalf
          >
            <div className="homeMediaWrapper">
              {item.headerVideo?.asset?.playbackId ? (
                <MuxVideo playbackId={item.headerVideo.asset.playbackId} />
              ) : item.headerImage?.length ? (
                <img
                  src={urlFor(item.headerImage[0]).url()}
                  alt={item.headerImage[0].alt || item.title}
                  className="homeImage"
                />
              ) : null}
            </div>

            <div className={`homeTitle ${item.layoutType || 'wide'}`}>
              <span className="homeClient">{item.client}</span>
              <span className="homeProject">{item.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;



// import React, { useState, useEffect, useRef } from 'react';
// import { PortableText } from '@portabletext/react';
// import { client, urlFor } from './sanityClient';
// import '../stylesheets/App.css';
// import '../stylesheets/Home.css';

// const MuxVideo = ({ playbackId }) => {
//   const playerRef = useRef();

//   useEffect(() => {
//     const el = playerRef.current;
//     if (!el) return;

//     el.muted = true;
//     el.play().catch(() => {});

//     const handleTimeUpdate = () => {
//       if (el.currentTime >= 5) {
//         el.currentTime = 0;
//         el.play();
//       }
//     };

//     el.addEventListener('timeupdate', handleTimeUpdate);
//     return () => el.removeEventListener('timeupdate', handleTimeUpdate);
//   }, []);

//   return (
//     <mux-player
//       ref={playerRef}
//       playback-id={playbackId}
//       autoPlay
//       muted
//       loop={false}
//       no-controls
//       style={{ width: '100%', height: '100%' }}
//     />
//   );
// };

// const ptComponents = {
//   types: {
//     image: ({ value }) =>
//       value?.asset?._ref ? (
//         <img
//           src={urlFor(value).width(1200).url()}
//           alt={value.alt || ''}
//           style={{ maxWidth: '100%', margin: '2rem 0', display: 'block' }}
//         />
//       ) : null,

//     'mux.video': ({ value }) =>
//       value?.asset?.playbackId ? (
//         <div className="homeMuxVideoWrapper">
//           <mux-player
//             playback-id={value.asset.playbackId}
//             stream-type="on-demand"
//             controls
//             playsinline
//             preload="metadata"
//             style={{
//               width: '100%',
//               maxHeight: '30rem',
//               height: 'auto',
//               objectFit: 'cover',
//               backgroundColor: 'black',
//             }}
//           />
//         </div>
//       ) : null,
//   },
// };

// const Home = () => {
//   const [home, setHome] = useState([]);

//   useEffect(() => {
//     client
//       .fetch(`*[_type == "home" && (!defined(archived) || archived == false)]{
//         title,
//         tagline,
//         headerImage,
//         headerVideo{
//           asset->{
//             _id,
//             playbackId
//           }
//         },
//         description[]{
//           ...,
//           _type == "mux.video" => {
//             ...,
//             asset->{ playbackId }
//           }
//         }
//       }`)
//       .then((data) => setHome(data))
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <div className="home">
//       <div className="homeContainer">
//         {home.map((item, index) => (
//           <div key={index} className="homeItem">

//             {item.headerVideo?.asset?.playbackId ? (
//               <MuxVideo playbackId={item.headerVideo.asset.playbackId} />
//             ) : item.headerImage ? (
//               <img
//                 src={urlFor(item.headerImage).url()}
//                 alt={item.title}
//                 className="homeHeaderImage"
//               />
//             ) : null}

//             {/* {item.title && <h2 className="homeTitle">{item.title}</h2>} */}

//             {item.description && (
//               <div className="homeDescription">
//                 <PortableText value={item.description} components={ptComponents} />
//               </div>
//             )}

//             {item.tagline && <div className="homeTagline">{item.tagline}</div>}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;
