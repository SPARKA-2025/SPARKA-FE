'use client'
import React, { useState, useEffect } from 'react';
import Hls from 'hls.js';

const TestPage = () => {
  const [videoUrl, setVideoUrl] = useState('http://34.101.183.181/cmaf/veda/index.m3u8');
  const [player, setPlayer] = useState(null);
  const videoElement = React.createRef();

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoElement.current);
      setPlayer(hls);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl]);

  useEffect(() => {
    if (videoElement.current) {
      videoElement.current.play();
    }
  }, [videoElement]);

  return (
    <div>
      <video
        ref={videoElement}
        width="100%"
        height="100%"
        playsInline
        autoPlay
      />
    </div>
  );
};

export default TestPage;