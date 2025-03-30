import React, { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

function WhiteNoise() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const whiteNoiseSourceRef = useRef(null);
  const bufferSize =
    2 * (window.AudioContext ? new AudioContext().sampleRate : 44100);

  const initializeWhiteNoise = () => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    const noiseBuffer = audioContext.createBuffer(
      1,
      bufferSize,
      audioContext.sampleRate
    );
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoiseSource = audioContext.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;
    whiteNoiseSource.connect(audioContext.destination);
    whiteNoiseSource.start(0);

    whiteNoiseSourceRef.current = whiteNoiseSource;
  };

  const playWhiteNoise = () => {
    if (!isPlaying) {
      initializeWhiteNoise();
      setIsPlaying(true);
    }
  };

  const pauseWhiteNoise = () => {
    if (whiteNoiseSourceRef.current) {
      whiteNoiseSourceRef.current.stop();
      whiteNoiseSourceRef.current.disconnect();
      whiteNoiseSourceRef.current = null;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (window.location.pathname === "/white-noise") {
      document.title = "White Noise - Noisefill";
    }
    return () => {
      if (whiteNoiseSourceRef.current) {
        whiteNoiseSourceRef.current.stop();
        whiteNoiseSourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="white-noise-player">
      <div className="controls">
        <span className="mr-4">White Noise</span>
        {!isPlaying ? (
          <Button variant="outline" onClick={playWhiteNoise}>
            Play
          </Button>
        ) : (
          <Button variant="outline" onClick={pauseWhiteNoise}>
            Pause
          </Button>
        )}
        <br />
        <br />
        <p className="text-red-200">
          ⚠︎ Please check your volume before playing. White Noise can be intense
          and potentially harmful at high volumes. Start at a low volume and
          gradually increase it until you find a comfortable level. Try out{" "}
          <Link to="/pink-noise" className="text-red-400 hover:underline">
            Pink Noise
          </Link>{" "}
          if White Noise is too harsh.
        </p>
      </div>
    </div>
  );
}

export default WhiteNoise;
