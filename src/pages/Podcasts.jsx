import React, { useState, useEffect } from "react";

export default function Podcasts() {
  const [urls, setUrls] = useState("");

  useEffect(() => {
    const savedPodcasts = localStorage.getItem("podcastData");
    if (savedPodcasts) {
      const podcasts = JSON.parse(savedPodcasts);
      const urls = podcasts.map((podcast) => podcast.feedUrl).join("\n");
      setUrls(urls);
    }
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold">We're sunsetting podcasts</h1>
      <p>
        We've decided to focus on the one thing we do best: soundscapes. Please
        save a copy of your library below soon as this page may be removed.
      </p>
      <br />
      <textarea readOnly className="text-black" value={urls}></textarea>
    </div>
  );
}
