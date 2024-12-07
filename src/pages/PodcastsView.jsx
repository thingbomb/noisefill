import React, { useState, useEffect } from "react";

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const delta = Math.round((now - date) / 1000);

  const minute = 60,
    hour = minute * 60,
    day = hour * 24,
    week = day * 7,
    month = day * 30.44,
    year = day * 365.25;

  if (delta < 30) {
    return delta + "s";
  } else if (delta < minute) {
    return delta + "s";
  } else if (delta < 2 * minute) {
    return "1min";
  } else if (delta < hour) {
    return Math.floor(delta / minute) + "mins";
  } else if (Math.floor(delta / hour) === 1) {
    return "1hr";
  } else if (delta < day) {
    return Math.floor(delta / hour) + "hrs";
  } else if (Math.floor(delta / day) === 1) {
    return "1d";
  } else if (delta < week) {
    return Math.floor(delta / day) + "d";
  } else if (Math.floor(delta / week) === 1) {
    return "1w";
  } else if (delta < month) {
    return Math.floor(delta / week) + "w";
  } else if (Math.floor(delta / month) === 1) {
    return "1mo";
  } else if (delta < year) {
    return Math.floor(delta / month) + "mo";
  } else if (Math.floor(delta / year) === 1) {
    return "1y";
  } else {
    return Math.floor(delta / year) + "y";
  }
}

function stripHtmlTags(input) {
  return input.replace(/<[^>]*>/g, "");
}

function PodcastsView() {
  const [podcastData, setPodcastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcastData = async () => {
      try {
        let queryParams = new URLSearchParams(window.location.search);
        let podcastId = queryParams.get("feedUrl");

        if (podcastId) {
          const response = await fetch("https://corsproxy.io/?" + podcastId);
          const data = await response.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "text/xml");
          console.log(xmlDoc);
          setPodcastData(xmlDoc);
        } else {
          setError("Podcast feed URL not found in query parameters.");
        }
      } catch (error) {
        setError("Error fetching podcast data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcastData();
  }, []);

  if (loading) return <div className="mx-6">Loading podcast</div>;
  if (error) return <div>{error}</div>;

  document.title =
    podcastData.querySelector("title")?.textContent || "Noisefill";
  const imageElement = podcastData.querySelector("image");
  const itunesImageElements = podcastData.getElementsByTagName("itunes:image");
  const itunesImageElement =
    itunesImageElements.length > 0 ? itunesImageElements[0] : null;

  const favicon =
    imageElement?.textContent ||
    (itunesImageElement ? itunesImageElement.getAttribute("href") : "") ||
    "https://via.placeholder.com/150";

  if (favicon) {
    if (document.head.querySelector("link[rel='icon']")) {
      document.head.querySelector("link[rel='icon']").href = favicon;
    } else {
      const faviconLink = document.createElement("link");
      faviconLink.rel = "icon";
      faviconLink.href = favicon;
      faviconLink.type = "image/x-icon";
      document.head.appendChild(faviconLink);
    }
  }
  return (
    <div>
      {podcastData ? (
        <div>
          <div className="grid grid-cols-[15%,85%]">
            <div className="left">
              <img
                className="rounded-[20px]"
                src={favicon || "https://via.placeholder.com/150"}
                alt="Podcast Image"
              />
            </div>
            <div className="right pl-6">
              <h1 className="text-2xl font-bold">
                {podcastData.querySelector("title")?.textContent || "No Title"}
              </h1>
              <p className="text-gray-400">
                {stripHtmlTags(
                  podcastData.querySelector("description")?.textContent
                ) || "No Description"}
              </p>
            </div>
          </div>
          <br />
          <ul>
            {Array.from(podcastData.querySelectorAll("item")).map(
              (item, index) => (
                <li
                  key={item.querySelector("title")?.textContent}
                  className="mb-6"
                >
                  <div className="left flex gap-4 mb-2">
                    <span className="text-gray-400">
                      {formatDate(
                        new Date(item.querySelector("pubDate")?.textContent)
                      ) || "No Date"}
                    </span>
                    {item.querySelector("title")?.textContent || "No Title"}
                  </div>
                  <div className="right">
                    <audio
                      controls
                      preload={index === 0 ? "auto" : "none"}
                      className="w-full"
                      onPlay={(e) => {
                        if (navigator.mediaSession) {
                          navigator.mediaSession.metadata = new MediaMetadata({
                            title: item.querySelector("title")?.textContent,
                            artist:
                              podcastData.querySelector("title")?.textContent,
                            album:
                              podcastData.querySelector("title")?.textContent,
                            artwork: [
                              {
                                src: favicon,
                                type: "image/x-icon",
                                sizes: "256x256",
                              },
                            ],
                          });
                        }
                      }}
                      onLoadedMetadata={(e) => {
                        let currentTime = localStorage.getItem(
                          item
                            .querySelector("enclosure")
                            ?.getAttribute("url") || ""
                        );
                        if (currentTime) {
                          e.target.currentTime = currentTime;
                        }
                      }}
                      onTimeUpdate={(e) => {
                        localStorage.setItem(
                          item
                            .querySelector("enclosure")
                            ?.getAttribute("url") || "",
                          e.target.currentTime
                        );
                      }}
                    >
                      <source
                        src={
                          item
                            .querySelector("enclosure")
                            ?.getAttribute("url") || ""
                        }
                        type={
                          item
                            .querySelector("enclosure")
                            ?.getAttribute("type") || ""
                        }
                      />
                    </audio>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
      ) : (
        <div>No podcast data available</div>
      )}
    </div>
  );
}

export default PodcastsView;
