import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import customCursorPause from '../images/pause-icon.png';
import playIcon from '../images/play-icon.png';

const VideoPlayer = ({ videos, style }) => {
  const [isPlaying, setIsPlaying] = useState(videos.map(() => false));
  const [showPlayIcon, setShowPlayIcon] = useState(videos.map(() => true));
  const videoRefs = useRef(videos.map(() => React.createRef()));
  const history = useHistory();

  const handlePlayPause = (index, autoPlay) => () => {
    const video = videoRefs.current[index].current;

    if (!video || autoPlay) {
      return;
    }

    if (isPlaying[index]) {
      video.pause();
    } else {
      video.play();
      setShowPlayIcon((prev) => prev.map((state, i) => (i === index ? false : state)));
    }
    setIsPlaying((prev) => prev.map((state, i) => (i === index ? !state : state)));
  };

  const resetCursorToAuto = () => {
    document.body.style.cursor = 'auto';
    setShowPlayIcon((prev) => prev.map((state, i) => (isPlaying[i] ? false : true)));
  };

  useEffect(() => {
    videos.forEach((_, index) => {
      const video = videoRefs.current[index].current;

      if (!video) {
        return;
      }

      const handleVideoPlay = () => {
        setIsPlaying((prev) => prev.map((state, i) => (i === index ? true : state)));
        document.body.style.cursor = `url(${customCursorPause}), auto`;
        setShowPlayIcon((prev) => prev.map((state, i) => (i === index ? false : state)));
      };

      const handleVideoPause = () => {
        setIsPlaying((prev) => prev.map((state, i) => (i === index ? false : state)));
        document.body.style.cursor = 'auto';
        setShowPlayIcon((prev) => prev.map((state, i) => (i === index ? true : state)));
      };

      const handleVideoEnded = () => {
        setIsPlaying((prev) => prev.map((state, i) => (i === index ? false : state)));
        setShowPlayIcon((prev) => prev.map((state, i) => (i === index ? true : state)));
      };

      video.addEventListener('play', handleVideoPlay);
      video.addEventListener('pause', handleVideoPause);
      video.addEventListener('ended', handleVideoEnded);

      return () => {
        video.removeEventListener('play', handleVideoPlay);
        video.removeEventListener('pause', handleVideoPause);
        video.removeEventListener('ended', handleVideoEnded);
      };
    });

    const unlisten = history.listen(() => {
      resetCursorToAuto();
    });

    return () => {
      unlisten();
    };
  }, [history, videos]);

  return (
    <div className={`caseVideoContainer${style ? style : ''}`}>
      {videos.map((video, index) => (
        <div
          key={index}
          className="caseVideoWrapper"
          onClick={handlePlayPause(index, video.autoplay)}
          onMouseEnter={() => {
            if (!isPlaying[index]) {
              setShowPlayIcon((prev) => prev.map((state, i) => (i === index ? true : state)));
              document.body.style.cursor = 'auto';
            } else if (video.autoplay) {
              document.body.style.cursor = 'auto';
            } else {
              document.body.style.cursor = `url(${customCursorPause}), auto`;
            }
          }}
          onMouseLeave={resetCursorToAuto}
        >
          <video
            className="caseVideo"
            ref={videoRefs.current[index]}
            src={video.url}
            poster={video.poster ? video.poster : ''}
            autoPlay={video.autoplay ? video.autoplay : ''}
            loop={video.autoplay ? video.autoplay : ''}
            muted={video.autoplay ? video.autoplay : ''}
          />
          {showPlayIcon[index] && (
            <img
              className="caseVideoPlayIcon"
              src={playIcon}
              alt="Play Icon"
              onClick={handlePlayPause(index)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default VideoPlayer;