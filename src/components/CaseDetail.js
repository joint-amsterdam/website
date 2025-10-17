import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { client, urlFor } from './sanityClient';
import '@mux/mux-player';

import '../stylesheets/App.css';
import '../stylesheets/CaseDetail.css';

const HeaderMuxVideo = ({ playbackId, onLoaded }) => {
  const playerRef = useRef();

  useEffect(() => {
    const el = playerRef.current;
    if (!el) return;

    // Try programmatic listener (most reliable) + pass-through attribute below
    const handleLoadedData = (e) => {
      console.log('[HeaderMuxVideo] loadeddata event', e?.type);
      onLoaded && onLoaded();
    };

    // Some browsers / custom element implementations might emit 'loadedmetadata' instead.
    el.addEventListener('loadeddata', handleLoadedData);
    el.addEventListener('loadedmetadata', handleLoadedData);
    el.addEventListener('loaded', handleLoadedData);

    // try autoplay (muted) — ignore errors
    try {
      el.muted = true;
      el.play()?.catch((err) => {
        console.warn('[HeaderMuxVideo] play() error:', err?.message || err);
      });
    } catch (e) { /* ignore */ }

    return () => {
      el.removeEventListener('loadeddata', handleLoadedData);
      el.removeEventListener('loadedmetadata', handleLoadedData);
      el.removeEventListener('loaded', handleLoadedData);
    };
  }, [onLoaded]);

  return (
    <div className="muxWrapper">
      <mux-player
        ref={playerRef}
        playback-id={playbackId}
        autoPlay
        muted
        loop
        no-controls
        preload="auto"
        // also provide the React prop in case it surfaces events that way in your React version
        onLoadedData={() => {
          console.log('[HeaderMuxVideo] onLoadedData prop called');
          onLoaded && onLoaded();
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          backgroundColor: 'black',
        }}
      />
    </div>
  );
};

const ptComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <img
          src={urlFor(value).width(1200).url()}
          alt={value.alt || ''}
          style={{ width: '100%', margin: '2rem 0', display: 'block' }}
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
            // if these inner mux players need to report loaded, they must call the same handler
            onLoadedData={() => console.log('[ptComponents mux.video] onLoadedData')}
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
  const [loaded, setLoaded] = useState(false);
  const [mediaToLoad, setMediaToLoad] = useState(0);
  const [mediaLoaded, setMediaLoaded] = useState(0);
  const fallbackTimerRef = useRef(null);

  useEffect(() => {
    console.log('[CaseDetail] fetching case', id);
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
            _type == "mux.video" => { ..., asset->{ playbackId } }
          }
        }`,
        { id }
      )
      .then((data) => {
        console.log('[CaseDetail] fetched data', data);
        setCurrentCase(data);

        // robust counting
        let count = 0;
        if (data?.headerVideo?.asset?.playbackId) {
          // header video + middle video (if you play one in header and one in middle)
          count += 2;
        } else if (Array.isArray(data?.headerImage) && data.headerImage.length > 0) {
          count += 1;
        }

        // If no media to wait for, mark loaded immediately
        if (count === 0) {
          console.log('[CaseDetail] no media to load, marking loaded');
          setLoaded(true);
        } else {
          console.log('[CaseDetail] mediaToLoad set to', count);
          setMediaToLoad(count);

          // fallback to avoid permanent stuck state while debugging
          // only set a fallback if media exists and hasn't loaded after 5s
          if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
          fallbackTimerRef.current = setTimeout(() => {
            console.warn('[CaseDetail] fallback timer fired — forcing loaded=true');
            setLoaded(true);
          }, 5000);
        }
      })
      .catch((err) => {
        console.error('[CaseDetail] fetch error', err);
        // don't block UI on fetch error
        setLoaded(true);
      });

    return () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };
  }, [id]);

  const handleMediaLoaded = () => {
    setMediaLoaded((prev) => {
      const next = prev + 1;
      console.log(`[CaseDetail] handleMediaLoaded called -> ${next}/${mediaToLoad}`);
      // clear fallback if things are moving
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      if (next >= mediaToLoad) {
        console.log('[CaseDetail] all media loaded — setting loaded=true');
        setLoaded(true);
      }
      return next;
    });
  };

  // debug helper (optional)
  useEffect(() => {
    console.log('[CaseDetail] state dump:', { mediaToLoad, mediaLoaded, loaded });
  }, [mediaToLoad, mediaLoaded, loaded]);

  if (!currentCase) return null;

  return (
    <div className={`caseDetail ${loaded ? 'loaded' : ''}`}>
      <div className="caseDetailContainer">
        {/* Header Section */}
        <div className="caseDetailHeader">
          <div className="caseDetailHeaderImageContainer">
            {currentCase.headerVideo?.asset?.playbackId ? (
              <HeaderMuxVideo
                playbackId={currentCase.headerVideo.asset.playbackId}
                onLoaded={handleMediaLoaded}
              />
            ) : Array.isArray(currentCase.headerImage) && currentCase.headerImage.length ? (
              <img
                src={urlFor(currentCase.headerImage[0]).url()}
                alt={currentCase.title}
                className="caseDetailHeaderImage"
                onLoad={() => {
                  console.log('[CaseDetail] header image onLoad');
                  handleMediaLoaded();
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : null}
          </div>
        </div>

        {/* Metadata + Description */}
        <div className="caseDetailTopContent">
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
        </div>

        {/* Middle video */}
        {currentCase.headerVideo?.asset?.playbackId && (
          <div className="caseDetailMiddleVideo">
            <mux-player
              playback-id={currentCase.headerVideo.asset.playbackId}
              stream-type="on-demand"
              controls
              playsinline
              preload="metadata"
              onLoadedData={() => {
                console.log('[middle mux-player] onLoadedData prop fired');
                handleMediaLoaded();
              }}
              style={{ width: '100%', objectFit: 'cover', backgroundColor: 'black' }}
            />
          </div>
        )}

        {/* WYSIWYG */}
        {currentCase.caseContent && (
          <div className="caseDetailBottomContent">
            <PortableText value={currentCase.caseContent} components={ptComponents} />
          </div>
        )}

        {/* Back Button */}
        <div className="caseDetailButtons">
          <div className="caseDetailBackButton">
            <Link to="/work">← Back</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
