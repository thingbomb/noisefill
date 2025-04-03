import { useEffect } from "react";
import { soundscapes } from "../soundscapes";

/**
 * A page that displays credits for all the soundscapes used in the app.
 *
 * It renders a grid of soundscapes with their emoji, name, and attribution.
 */
function Credits() {
  useEffect(() => {
    if (window.location.pathname === "/credits") {
      document.title = "Credits - Noisefill";
    }
  }, []);
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-3">Credits</h1>
      <p className="mb-6 text-zinc-400">
        Soundscapes are created by wonderful artists from around the world.
        Soundscapes here do not imply an endorsement/affiliation to Noisefill by
        the author. Special thanks for{" "}
        <a
          href="https://freesound.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          freesound.org
        </a>{" "}
        (not an affiliate link) for providing an amazing platform for finding
        sounds.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {soundscapes.map((sound, index) => (
          <div key={index}>
            <div className="flex items-center">
              <span className="mr-2">{sound.emoji}</span>
              <span>{sound.name}</span>
            </div>
            <p className="text-zinc-300">{sound.attribution}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Credits;
