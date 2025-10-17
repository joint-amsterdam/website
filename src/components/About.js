import React, { useState, useEffect, useRef } from 'react';
import { PortableText } from '@portabletext/react';
import { client, urlFor } from './sanityClient';
import '../stylesheets/App.css';
import '../stylesheets/About.css';

const MuxVideo = ({ playbackId }) => {
  const playerRef = useRef();

  useEffect(() => {
    const el = playerRef.current;
    if (!el) return;

    el.muted = true;
    el.play().catch(() => {});

    const handleTimeUpdate = () => {
      if (el.currentTime >= 5) {
        el.currentTime = 0;
        el.play();
      }
    };

    el.addEventListener('timeupdate', handleTimeUpdate);
    return () => el.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  return (
    <mux-player
      ref={playerRef}
      playback-id={playbackId}
      autoPlay
      muted
      loop={false}
      no-controls
      style={{ width: '100%', height: '100%' }}
    />
  );
};

const ptComponents = {
  types: {
    image: ({ value }) =>
      value?.asset?._ref ? (
        <img
          src={urlFor(value).width(1200).url()}
          alt={value.alt || ''}
          style={{ maxWidth: '100%', margin: '2rem 0', display: 'block' }}
        />
      ) : null,

    'mux.video': ({ value }) =>
      value?.asset?.playbackId ? (
        <div className="aboutMuxVideoWrapper">
          <mux-player
            playback-id={value.asset.playbackId}
            stream-type="on-demand"
            controls
            playsinline
            preload="metadata"
            style={{
              width: '100%',
              maxHeight: '30rem',
              height: 'auto',
              objectFit: 'cover',
              backgroundColor: 'black',
            }}
          />
        </div>
      ) : null,
  },
};

const About = () => {
  const [about, setAbout] = useState([]);

  useEffect(() => {
    client
      .fetch(`*[_type == "about" && (!defined(archived) || archived == false)]{
        title,
        description[]{
          ...,
          _type == "mux.video" => {
            ...,
            asset->{ playbackId }
          }
        }
      }`)
      .then((data) => setAbout(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="about">
      <div className="aboutContainer">
        {about.map((item, index) => (
          <div key={index} className="aboutItem">

            {/* {item.title && <h2 className="aboutTitle">{item.title}</h2>} */}

            {item.description && (
              <div className="aboutDescription">
                <PortableText value={item.description} components={ptComponents} />
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
