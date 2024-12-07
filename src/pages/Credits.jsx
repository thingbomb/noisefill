import React from "react";
import { soundscapes } from "../soundscapes";

/**
 * A page that displays credits for all the soundscapes used in the app.
 *
 * It renders a grid of soundscapes with their emoji, name, and attribution.
 */
function Credits() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Credits</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {soundscapes.map((sound, index) => (
          <div key={index}>
            <div className="flex items-center">
              <span className="mr-2">{sound.emoji}</span>
              <span>{sound.name}</span>
            </div>
            <p>{sound.attribution}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Credits;
