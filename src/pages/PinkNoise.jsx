import React, { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

function PinkNoise() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const pinkNoiseNodeRef = useRef(null);
  const bufferSize = 4096;

  const initializePinkNoise = () => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    const node = audioContext.createScriptProcessor(bufferSize, 1, 1);
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;

    node.onaudioprocess = function (e) {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }
    };

    node.connect(audioContext.destination);
    pinkNoiseNodeRef.current = node;
  };

  const playPinkNoise = () => {
    if (!isPlaying) {
      initializePinkNoise();
      setIsPlaying(true);
    }
  };

  const pausePinkNoise = () => {
    if (pinkNoiseNodeRef.current) {
      pinkNoiseNodeRef.current.disconnect();
      pinkNoiseNodeRef.current = null;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (window.location.pathname === "/pink-noise") {
      document.title = "Pink Noise - Noisefill";
    }
    return () => {
      if (pinkNoiseNodeRef.current) {
        pinkNoiseNodeRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="pink-noise-player">
      <div className="controls">
        <span className="mr-4">Pink Noise</span>
        {!isPlaying ? (
          <Button variant="outline" onClick={playPinkNoise}>
            Play
          </Button>
        ) : (
          <Button variant="outline" onClick={pausePinkNoise}>
            Pause
          </Button>
        )}
      </div>
      <br />
      <p className="text-orange-200">
        ⚠︎ Please check your volume before playing. Pink Noise can be harsh and
        potentially harmful at high volumes. Start at a low volume and gradually
        increase it until you find a comfortable level. Try out{" "}
        <Link to="/brown-noise" className="text-orange-400 hover:underline">
          Brown Noise
        </Link>{" "}
        if Pink Noise is too harsh.
      </p>
    </div>
  );
}

export default PinkNoise;
