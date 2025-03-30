import React, { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";

function BrownNoise() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const brownNoiseNodeRef = useRef(null);
  const bufferSize = 4096;

  const initializeBrownNoise = () => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    let lastOut = 0.0;
    const brownNoiseNode = audioContext.createScriptProcessor(bufferSize, 1, 1);

    brownNoiseNode.onaudioprocess = function (e) {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    };

    brownNoiseNode.connect(audioContext.destination);
    brownNoiseNodeRef.current = brownNoiseNode;
  };

  const playBrownNoise = () => {
    if (!isPlaying) {
      initializeBrownNoise();
      setIsPlaying(true);
    }
  };

  const pauseBrownNoise = () => {
    if (brownNoiseNodeRef.current) {
      brownNoiseNodeRef.current.disconnect();
      brownNoiseNodeRef.current = null;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (window.location.pathname === "/brown-noise") {
        document.title = "Brown Noise - Noisefill";
      }
      if (brownNoiseNodeRef.current) {
        brownNoiseNodeRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="brown-noise-player">
      <div className="controls">
        <span className="mr-4">Brown Noise</span>
        {!isPlaying ? (
          <Button variant="outline" onClick={playBrownNoise}>
            Play
          </Button>
        ) : (
          <Button variant="outline" onClick={pauseBrownNoise}>
            Pause
          </Button>
        )}
        <br />
        <br />
        <p className="text-zinc-300">
          ⚠︎ Please check your volume before playing. Although Brown Noise is a
          lighter version of White Noise, it may still be loud, especially on
          headphone.
        </p>
      </div>
    </div>
  );
}

export default BrownNoise;
