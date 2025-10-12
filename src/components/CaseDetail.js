// src/components/CaseDetail.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import { client, urlFor } from './sanityClient';
import '@mux/mux-player';

import '../stylesheets/App.css';
import '../stylesheets/CaseDetail.css';

const fadeTransition = { delay: 0.5, duration: 0.8, ease: 'easeOut' };

// ----- Header video -----
const HeaderMuxVideo = ({ playbackId }) => {
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
    <div className="muxWrapper">
      <mux-player
        ref={playerRef}
        playback-id={playbackId}
        autoPlay
        muted
        loop={false}
        no-controls
      />
    </div>
  );
};

// ----- PortableText components -----
const ptComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <img
          src={urlFor(value).width(1200).url()}
          alt={value.alt || ''}
          style={{
            width: '100%',
            margin: '2rem 0',
            display: 'block',
          }}
        />
      );
    },

    'mux.video': ({ value }) => {
      if (!value?.asset?.playbackId) return null;
      return (
        <div className="caseDetailContentVideoWrapper">
          <mux-player
            playback-id={value.asset.playbackId}
            stream-type="on-demand"
            controls
            playsinline
            preload="metadata"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              backgroundColor: 'black',
            }}
          />
        </div>
      );
    },
  },
};

const CaseDetail = () => {
  const { id } = useParams();
  const [currentCase, setCurrentCase] = useState(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type=="case" && slug.current == $id && (!defined(archived) || archived == false)][0]{
          title,
          client,
          type,
          productionCompany,
          director,
          locations,
          role,
          description,
          headerVideo{ asset->{ playbackId } },
          headerImage,
          caseContent[]{
            ...,
            _type == "mux.video" => {
              ...,
              asset->{ playbackId }
            }
          }
        }`,
        { id }
      )
      .then((data) => setCurrentCase(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!currentCase) return null;

  const transition = { duration: 1.4, ease: [0.6, 0.01, -0.05, 0.9] };
  const caseVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  return (
    <motion.div
      className="caseDetail"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={caseVariants}
    >
      <div className="caseDetailContainer">
        {/* Header Section */}
        <div className="caseDetailHeader">
          <div className="caseDetailHeaderImageContainer">
            {currentCase.headerVideo?.asset?.playbackId ? (
              <HeaderMuxVideo playbackId={currentCase.headerVideo.asset.playbackId} />
            ) : currentCase.headerImage?.length ? (
              <img
                src={urlFor(currentCase.headerImage[0]).url()}
                alt={currentCase.title}
                className="caseDetailHeaderImage"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : null}
          </div>
        </div>

        {/* Metadata + Description */}
        <motion.div className="caseDetailTopContent" transition={transition}>
          <div className="caseDetailItemContainer">
            <div className="caseDetailLeft">
              <div className="caseDetailItem">
                <div className="caseDetailTitle">{currentCase.title}</div>
                <div className="caseDetailMetadata">
                  {currentCase.client && (
                    <div><span className="bold">Client: </span>{currentCase.client}</div>
                  )}
                  {currentCase.type && (
                    <div><span className="bold">Type: </span>{currentCase.type}</div>
                  )}
                  {currentCase.productionCompany && (
                    <div><span className="bold">Production Company: </span>{currentCase.productionCompany}</div>
                  )}
                  {currentCase.director && (
                    <div><span className="bold">Director: </span>{currentCase.director}</div>
                  )}
                  {currentCase.locations && (
                    <div><span className="bold">Filming Location: </span>{currentCase.locations}</div>
                  )}
                  {currentCase.role && (
                    <div><span className="bold">Role: </span>{currentCase.role}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="caseDetailRight">
              <div
                className="caseDetailDescription"
                dangerouslySetInnerHTML={{ __html: currentCase.description }}
              />
            </div>
          </div>
        </motion.div>

        {/* ✅ Restored middle video section (custom slot) */}
        {currentCase.headerVideo?.asset?.playbackId && (
          <div className="caseDetailMiddleVideo">
            <mux-player
              playback-id={currentCase.headerVideo.asset.playbackId}
              stream-type="on-demand"
              controls
              playsinline
              preload="metadata"
              style={{
                width: '100%',
                objectFit: 'cover',
                backgroundColor: 'black',
              }}
            />
          </div>
        )}

        {/* ✅ Full WYSIWYG / Case Content */}
        {currentCase.caseContent && (
          <div className="caseDetailBottomContent">
            <PortableText value={currentCase.caseContent} components={ptComponents} />
          </div>
        )}

        {/* Back Button */}
        <motion.div className="caseDetailButtons" transition={transition}>
          <div className="caseDetailBackButton">
            <Link to="/work">Back ←</Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CaseDetail;
