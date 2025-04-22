import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "../components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  soundscapes,
  savePlaylist,
  getPlaylists,
  deletePlaylist,
} from "../soundscapes";
import audioRef from "../audioRef";
import { Link } from "react-router-dom";
import { cn } from "../components/lib/utils";
import {
  saveAudioToIndexedDB,
  getAudioFromIndexedDB,
} from "../utils/indexedDB";

function SleepTimer() {
  const [duration, setDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let timer;

    if (isTimerActive && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            fadeOutAudio();
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isTimerActive, remainingTime]);

  const fadeOutAudio = () => {
    const audio = document.getElementById("player");
    const fadeDuration = 1000;
    const fadeStep = audio.volume / (fadeDuration / 100);
    let currentVolume = audio.volume;

    const fadeOutInterval = setInterval(() => {
      currentVolume -= fadeStep;
      if (currentVolume <= 0) {
        clearInterval(fadeOutInterval);
        audio.pause();
        audio.volume = 0;
      } else {
        audio.volume = currentVolume;
      }
    }, 100);
  };

  const handleStartTimer = () => {
    setRemainingTime(duration);
    setIsTimerActive(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">⏳ Sleep timer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sleep Timer</DialogTitle>
          <DialogDescription>
            Automatically turn off the sound after a specific amount of time.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration (min)
            </Label>
            <Input
              id="duration"
              type="number"
              value={duration / 60}
              onChange={(e) => setDuration(e.target.value * 60)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Remaining Time</Label>
            <span className="col-span-3 text-center">
              {formatTime(remainingTime)}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleStartTimer}
            className={isTimerActive ? "hidden" : ""}
          >
            Start timer
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsTimerActive(false)}
            className={isTimerActive ? "" : "hidden"}
          >
            Stop timer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreditsMenu() {
  return (
    <Link to="/credits">
      <Button variant="outline">📝 Credits</Button>
    </Link>
  );
}

function Home({ currentURL, setCurrentURL }) {
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedSoundscapes, setSelectedSoundscapes] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [playlistItems, setPlaylistItems] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [playlistTimer, setPlaylistTimer] = useState(null);
  const [editingPlaylist, setEditingPlaylist] = useState(null);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedSoundscapes, setCachedSoundscapes] = useState([]);

  const [listeningPreferences, setListeningPreferences] = useState({});

  const [playedLofiSounds, setPlayedLofiSounds] = useState([]);
  const lofiQueueRef = useRef([]);

  useEffect(() => {
    const handleOnline = () => {
      console.log("Network connection restored");
      setIsOnline(true);
      setMessage("You are back online");
      setTimeout(() => setMessage(""), 3000);
    };

    const handleOffline = () => {
      console.log("Network connection lost");
      setIsOnline(false);
      setMessage("You are offline - only cached sounds are available");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    async function checkCachedSoundscapes() {
      const cachedIds = [];

      for (const soundscape of soundscapes) {
        try {
          const dataUrl = await getAudioFromIndexedDB(soundscape.index);
          if (dataUrl) {
            cachedIds.push(soundscape.index);
          }
        } catch (error) {
          console.error(
            `Error checking cache for soundscape ${soundscape.index}:`,
            error
          );
        }
      }

      setCachedSoundscapes(cachedIds);
      console.log("Cached soundscapes:", cachedIds);
    }

    checkCachedSoundscapes();
  }, [isOnline]);

  useEffect(() => {
    const handlePreferencesUpdate = (event) => {
      if (event.detail && event.detail.listeningPreferences) {
        setListeningPreferences(event.detail.listeningPreferences);
      }
    };

    // Initial load from localStorage
    try {
      const savedPreferences = localStorage.getItem("listeningPreferences");
      if (savedPreferences) {
        setListeningPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error("Error loading listening preferences:", error);
    }

    // Listen for updates from App.jsx
    window.addEventListener(
      "listening-preferences-update",
      handlePreferencesUpdate
    );

    return () => {
      window.removeEventListener(
        "listening-preferences-update",
        handlePreferencesUpdate
      );
    };
  }, []);

  useEffect(() => {
    const initializeLofiQueue = () => {
      const lofiSounds = soundscapes.filter((sound) => sound.type === "lofi");

      if (lofiSounds.length === 0) return;

      const shuffled = [...lofiSounds].sort(() => Math.random() - 0.5);
      lofiQueueRef.current = shuffled.map((sound) => sound.index);
      console.log("Lofi queue initialized:", lofiQueueRef.current);
    };

    initializeLofiQueue();

    const audio = document.getElementById("player");
    const handleAudioEnded = () => {
      if (currentPlaylist) return;

      const currentIndex = parseInt(audio.getAttribute("index"));
      const currentSound = soundscapes[currentIndex];

      if (!currentSound) return;

      const isLofi = currentSound.type === "lofi";

      if (isLofi) {
        console.log("Lofi track ended, shuffling to next lofi");
        playNextLofiSound(currentIndex);
      } else {
        console.log("Regular soundscape ended, looping");
        audio.currentTime = 0;
        audio.play().catch((err) => console.error("Error looping sound:", err));
      }
    };

    audio.addEventListener("ended", handleAudioEnded);

    return () => {
      audio.removeEventListener("ended", handleAudioEnded);
    };
  }, [currentPlaylist]);

  const playNextLofiSound = (currentSoundIndex) => {
    const lofiSounds = soundscapes.filter((sound) => sound.type === "lofi");

    if (lofiSounds.length === 0) return;

    if (
      playedLofiSounds.length >= lofiSounds.length ||
      lofiQueueRef.current.length === 0
    ) {
      console.log("All lofi sounds have been played, resetting queue");
      setPlayedLofiSounds([]);

      const newQueue = lofiSounds
        .filter((sound) => sound.index !== currentSoundIndex)
        .sort(() => Math.random() - 0.5)
        .map((sound) => sound.index);

      lofiQueueRef.current = newQueue;
    }

    const nextSoundIndex = lofiQueueRef.current.shift();
    const nextSound = soundscapes[nextSoundIndex];

    if (nextSound) {
      console.log(
        `Lofi radio playing next: ${nextSound.name} (index: ${nextSoundIndex})`
      );

      setPlayedLofiSounds((prev) => [...prev, nextSoundIndex]);

      playSound(
        nextSound.url,
        nextSound.volume,
        nextSound.name,
        nextSound.image,
        nextSound.index
      );

      setMessage(`Now playing: ${nextSound.name}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    if (window.location.hostname === "/") {
      document.title = `${
        new URL(window.location.href).hostname.startsWith("reversed.")
          ? "Reversed Noisefill"
          : "Noisefill"
      }`;
    }
    const audio = document.getElementById("player");
    audioRef.current = audio;
    audio.addEventListener("pause", () => {
      setPlaying(false);
      setMessage("");
    });
    audio.addEventListener("play", () => {
      setPlaying(true);
      if (navigator.mediaSession) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: `${document.getElementById("player").title}`,
          artist: `Playing on Noisefill`,
          artwork: [
            {
              src: document.getElementById("player").getAttribute("image"),
              sizes: "128x128",
              type: "image/png",
            },
          ],
        });

        navigator.mediaSession.setActionHandler("play", () => {
          audio.play();
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          audio.pause();
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          const index = parseInt(audio.getAttribute("index"));
          const currentSound = soundscapes[index];

          // Check if current track is lofi
          if (currentSound && currentSound.type === "lofi") {
            // If lofi, find the next lofi track
            const lofiSounds = soundscapes.filter(
              (sound) => sound.type === "lofi"
            );
            const currentLofiIndex = lofiSounds.findIndex(
              (sound) => sound.index === index
            );

            let nextLofiSound;
            if (currentLofiIndex < lofiSounds.length - 1) {
              nextLofiSound = lofiSounds[currentLofiIndex + 1];
            } else {
              nextLofiSound = lofiSounds[0]; // Loop back to first lofi
            }

            if (nextLofiSound) {
              playSound(
                nextLofiSound.url,
                nextLofiSound.volume,
                nextLofiSound.name,
                nextLofiSound.image,
                nextLofiSound.index
              );
              return;
            }
          }

          // Default behavior for non-lofi tracks
          if (index < soundscapes.length - 1) {
            playSound(
              soundscapes[index + 1].url,
              soundscapes[index + 1].volume,
              soundscapes[index + 1].name,
              soundscapes[index + 1].image,
              soundscapes[index + 1].index
            );
          } else {
            playSound(
              soundscapes[0].url,
              soundscapes[0].volume,
              soundscapes[0].name,
              soundscapes[0].image,
              soundscapes[0].index
            );
          }
        });
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          const index = parseInt(audio.getAttribute("index"));
          const currentSound = soundscapes[index];

          // Check if current track is lofi
          if (currentSound && currentSound.type === "lofi") {
            // If lofi, find the previous lofi track
            const lofiSounds = soundscapes.filter(
              (sound) => sound.type === "lofi"
            );
            const currentLofiIndex = lofiSounds.findIndex(
              (sound) => sound.index === index
            );

            let prevLofiSound;
            if (currentLofiIndex > 0) {
              prevLofiSound = lofiSounds[currentLofiIndex - 1];
            } else {
              prevLofiSound = lofiSounds[lofiSounds.length - 1]; // Loop back to last lofi
            }

            if (prevLofiSound) {
              playSound(
                prevLofiSound.url,
                prevLofiSound.volume,
                prevLofiSound.name,
                prevLofiSound.image,
                prevLofiSound.index
              );
              return;
            }
          }

          // Default behavior for non-lofi tracks
          if (index > 0) {
            playSound(
              soundscapes[index - 1].url,
              soundscapes[index - 1].volume,
              soundscapes[index - 1].name,
              soundscapes[index - 1].image,
              soundscapes[index - 1].index
            );
          } else {
            playSound(
              soundscapes[soundscapes.length - 1].url,
              soundscapes[soundscapes.length - 1].volume,
              soundscapes[soundscapes.length - 1].name,
              soundscapes[soundscapes.length - 1].image,
              soundscapes[soundscapes.length - 1].index
            );
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    setPlaylists(getPlaylists());
  }, []);

  useEffect(() => {
    return () => {
      if (playlistTimer) {
        clearTimeout(playlistTimer);
      }
    };
  }, [playlistTimer]);

  // Add event listeners for playlist navigation from the media bar
  useEffect(() => {
    const handlePlaylistNext = (event) => {
      if (currentPlaylist) {
        // We're checking if we have a current playlist, regardless of ID
        // Clear any existing timer to prevent double transitions
        if (playlistTimer) {
          clearTimeout(playlistTimer);
        }
        playPlaylistItem(currentPlaylist, event.detail.index);
      }
    };

    const handlePlaylistPrevious = (event) => {
      if (currentPlaylist) {
        // We're checking if we have a current playlist, regardless of ID
        // Clear any existing timer to prevent double transitions
        if (playlistTimer) {
          clearTimeout(playlistTimer);
        }
        playPlaylistItem(currentPlaylist, event.detail.index);
      }
    };

    window.addEventListener("playlist-next", handlePlaylistNext);
    window.addEventListener("playlist-previous", handlePlaylistPrevious);

    return () => {
      window.removeEventListener("playlist-next", handlePlaylistNext);
      window.removeEventListener("playlist-previous", handlePlaylistPrevious);
    };
  }, [currentPlaylist, playlistTimer]);

  const handleAddToPlaylist = (soundscape) => {
    if (playlistItems.some((item) => item.index === soundscape.index)) {
      return;
    }
    setPlaylistItems([
      ...playlistItems,
      {
        index: soundscape.index,
        duration: 5,
      },
    ]);
  };

  const handleUpdateDuration = (index, duration) => {
    const newItems = [...playlistItems];
    newItems[index].duration = parseInt(duration) || 0;
    setPlaylistItems(newItems);
  };

  const handleRemoveFromPlaylist = (index) => {
    setPlaylistItems(playlistItems.filter((_, i) => i !== index));
  };

  const handleEditPlaylist = (playlist) => {
    setEditingPlaylist(playlist);
    setPlaylistName(playlist.name);
    setPlaylistDescription(playlist.description);
    setPlaylistItems(playlist.items);
    setShowPlaylistDialog(true);
  };

  const handleSavePlaylist = () => {
    if (!playlistName.trim()) {
      alert("Please enter a playlist name");
      return;
    }

    if (playlistItems.length === 0) {
      alert("Please add at least one soundscape to the playlist");
      return;
    }

    const newPlaylist = savePlaylist(
      playlistName,
      playlistDescription,
      playlistItems,
      editingPlaylist?.id
    );
    setPlaylists(getPlaylists());
    setShowPlaylistDialog(false);
    setPlaylistName("");
    setPlaylistDescription("");
    setPlaylistItems([]);
    setEditingPlaylist(null);
  };

  const handleCloseDialog = () => {
    setShowPlaylistDialog(false);
    setPlaylistName("");
    setPlaylistDescription("");
    setPlaylistItems([]);
    setEditingPlaylist(null);
  };

  // Simple function to set the volume based on the soundscape setting
  const setAudioVolume = (soundscape) => {
    if (!audioRef.current || !soundscape) return;

    // Use the volume setting directly from the soundscape object
    audioRef.current.volume = soundscape.volume || 1.0;
  };

  const playSound = async (url, volume, name, image, index) => {
    const audio = audioRef.current || document.getElementById("player");

    const currentSound = soundscapes[index];
    const isLofi = currentSound?.type === "lofi";
    if (isLofi) {
      setPlayedLofiSounds((prev) => [...prev, index]);
    }
    audio.loop = !isLofi;

    // Check if we are playing or pausing the same sound
    const isSameSound = audio.src === url;
    const isCurrentlyPlaying = !document.getElementById("player").paused;

    // If clicking the currently playing sound, just pause it
    if (isSameSound && isCurrentlyPlaying) {
      audio.pause();
      return;
    }

    // Extract the soundKey from the URL or name
    const soundName = name.toLowerCase().replace(/\s+/g, "-");

    // Increment the session count right when a new sound is selected to play
    if (!isSameSound) {
      window.incrementSessionCount?.(soundName);
      console.log(
        `Button clicked: incrementing session count for ${soundName}`
      );
    }

    const soundscape = soundscapes.find((s) => s.url === url);
    const soundscapeId = soundscape ? soundscape.index : index;

    const playFromCache = async () => {
      try {
        const cachedDataUrl = await getAudioFromIndexedDB(soundscapeId);
        if (cachedDataUrl) {
          console.log(`Playing from cache for soundscape ID: ${soundscapeId}`);
          audio.src = cachedDataUrl;
          audio.title = name;
          audio.setAttribute("image", image);
          audio.setAttribute("index", soundscapeId);
          setCurrentURL(cachedDataUrl);
          audio.volume = soundscape ? soundscape.volume || 1.0 : volume || 1.0;

          return audio
            .play()
            .then(() => {
              setMessage(`Playing cached version of: ${name}`);
              return true;
            })
            .catch((err) => {
              console.error("Error playing cached audio:", err);
              setMessage("Failed to play cached audio");
              return false;
            });
        }
        return false;
      } catch (error) {
        console.error("Error accessing cached audio:", error);
        return false;
      }
    };

    const handleAudioError = async (e) => {
      console.error(`Error loading audio from URL: ${url}`, e);
      setMessage("Network error: Attempting to load from cache...");
      audio.removeEventListener("error", handleAudioError);

      const playedFromCache = await playFromCache();

      if (!playedFromCache) {
        setMessage(`Network error: No cached version available for ${name}`);
      }
    };

    if (!isOnline && cachedSoundscapes.includes(soundscapeId)) {
      void playFromCache();
      return;
    }

    audio.addEventListener("error", handleAudioError);

    audio.src = url;
    audio.title = name;
    audio.setAttribute("image", image);
    audio.setAttribute("index", soundscapeId);
    setCurrentURL(url);

    if (soundscape) {
      // Set volume directly from the soundscape
      audio.volume = soundscape.volume || 1.0;

      // Save the audio data URL to IndexedDB when online
      if (isOnline) {
        saveAudioToIndexedDB(soundscape.index, url)
          .then(() => {
            // Update cached soundscapes list if this is newly cached
            if (!cachedSoundscapes.includes(soundscape.index)) {
              setCachedSoundscapes((prev) => [...prev, soundscape.index]);
            }
          })
          .catch((error) => {
            console.error("Error saving audio data URL to IndexedDB:", error);
          });
      }
    } else {
      // Fallback volume
      audio.volume = volume || 1.0;
    }

    // Play the audio
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  const playPlaylistItem = (playlist, index) => {
    if (index >= playlist.items.length) {
      playPlaylistItem(playlist, 0);
      return;
    }

    const item = playlist.items[index];
    const soundscapeIndex = item.index;
    const soundscape = soundscapes[soundscapeIndex];

    if (!soundscape) {
      console.error(`Soundscape with index ${soundscapeIndex} not found`);
      setTimeout(() => {
        playPlaylistItem(playlist, index + 1);
      }, 1000);
      return;
    }

    const audio = audioRef.current || document.getElementById("player");

    const playFromCache = async () => {
      try {
        const cachedDataUrl = await getAudioFromIndexedDB(soundscapeIndex);
        if (cachedDataUrl) {
          console.log(
            `Playing playlist item from cache, soundscape ID: ${soundscapeIndex}`
          );
          audio.src = cachedDataUrl;
          audio.title = soundscape.name;
          audio.setAttribute("image", soundscape.image);
          audio.setAttribute("index", soundscapeIndex);
          audio.volume = soundscape.volume || 1.0;
          setCurrentURL(cachedDataUrl);
          setPlaying(true);

          return audio
            .play()
            .then(() => {
              setMessage(
                `Playing cached version of: ${soundscape.name} (Playlist: ${playlist.name})`
              );

              setCurrentPlaylist(playlist);
              setCurrentPlaylistIndex(index);

              window.dispatchEvent(
                new CustomEvent("playlist-change", {
                  detail: { playlist, index },
                })
              );

              const minutes = parseInt(item.duration);
              clearTimeout(playlistTimer);
              const timer = setTimeout(() => {
                playPlaylistItem(playlist, index + 1);
              }, minutes * 60 * 1000);

              setPlaylistTimer(timer);
              return true;
            })
            .catch((err) => {
              console.error("Error playing cached playlist audio:", err);
              setMessage("Failed to play cached playlist audio");

              setTimeout(() => {
                playPlaylistItem(playlist, index + 1);
              }, 2000);
              return false;
            });
        }
        return false;
      } catch (error) {
        console.error("Error accessing cached playlist audio:", error);
        return false;
      }
    };

    const handleAudioError = async (e) => {
      console.error(
        `Error loading playlist audio from URL: ${soundscape.url}`,
        e
      );
      setMessage(
        "Network error: Attempting to load playlist item from cache..."
      );

      audio.removeEventListener("error", handleAudioError);

      const playedFromCache = await playFromCache();

      if (!playedFromCache) {
        setMessage(
          `Network error: No cached version available for ${soundscape.name}`
        );

        setTimeout(() => {
          playPlaylistItem(playlist, index + 1);
        }, 2000);
      }
    };

    if (!isOnline && cachedSoundscapes.includes(soundscapeIndex)) {
      void playFromCache();
      return;
    }

    audio.addEventListener("error", handleAudioError);

    audio.src = soundscape.url;
    audio.title = soundscape.name;
    audio.setAttribute("image", soundscape.image);
    audio.setAttribute("index", soundscapeIndex);
    audio.volume = soundscape.volume || 1.0;
    setCurrentURL(soundscape.url);
    setPlaying(true);

    if (isOnline) {
      saveAudioToIndexedDB(soundscapeIndex, soundscape.url)
        .then(() => {
          if (!cachedSoundscapes.includes(soundscapeIndex)) {
            setCachedSoundscapes((prev) => [...prev, soundscapeIndex]);
          }
        })
        .catch((error) => {
          console.error("Error saving audio data URL to IndexedDB:", error);
        });
    }

    // Play the audio
    audio.play().catch((error) => {
      console.error("Error playing playlist audio:", error);
    });

    // Set message
    setMessage(
      `Playing playlist: ${playlist.name} - ${soundscape.name} (${item.duration} minutes)`
    );

    // Set up playlist state
    setCurrentPlaylist(playlist);
    setCurrentPlaylistIndex(index);

    // Dispatch event to notify App component about playlist item change
    window.dispatchEvent(
      new CustomEvent("playlist-change", {
        detail: { playlist, index },
      })
    );

    // Set timer for next track
    const minutes = parseInt(item.duration);
    clearTimeout(playlistTimer);
    const timer = setTimeout(() => {
      playPlaylistItem(playlist, index + 1);
    }, minutes * 60 * 1000);

    setPlaylistTimer(timer);
  };

  const stopPlaylist = () => {
    if (!currentPlaylist) return;

    const audio = audioRef.current || document.getElementById("player");
    audio.pause();

    clearTimeout(playlistTimer);
    setPlaylistTimer(null);
    setCurrentPlaylist(null);
    setCurrentPlaylistIndex(0);
    setPlaying(false);
    setMessage("");

    // Dispatch event to notify App component that playlist has stopped
    window.dispatchEvent(new CustomEvent("playlist-stop"));
  };

  useEffect(() => {
    if (window.location.pathname === "/") {
      document.title = `${
        new URL(window.location.href).hostname.startsWith("reversed.")
          ? "Reversed Noisefill"
          : "Noisefill"
      }`;
    }
  }, []);

  return (
    <div className="overflow-y-auto">
      <span className="text-gray-400">
        Noisefill did not make the soundscapes below and does not imply an
        endorsement/affiliation by the author.{" "}
        {new URL(window.location.href).hostname.startsWith("reversed.")
          ? "Soundscapes below have been reversed on Noisefill's part. "
          : ""}
        <Link to="/credits" className="text-white hover:underline">
          Learn more
        </Link>
        .
      </span>
      <div className="flex flex-wrap gap-2 mt-2">
        <CreditsMenu />

        {soundscapes
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter((sound) => {
            if (
              new URL(window.location.href).hostname.startsWith("reversed.")
            ) {
              return sound.reversedURL != null;
            }
            return true;
          })
          .map((sound, index) => {
            const isDisabled =
              !isOnline && !cachedSoundscapes.includes(sound.index);

            return (
              <Button
                variant="outline"
                key={index}
                disabled={isDisabled}
                className={cn({
                  "opacity-40 cursor-not-allowed": isDisabled,
                })}
                title={isDisabled ? "Not available offline" : undefined}
                onMouseDown={(event) => {
                  if (isDisabled) return;

                  const soundURL = new URL(
                    window.location.href
                  ).hostname.startsWith("reversed.")
                    ? sound.reversedURL
                    : sound.url;
                  playSound(
                    soundURL,
                    sound.volume,
                    sound.name,
                    sound.image,
                    sound.index
                  );
                  event.target.mouseDownHandled = true;
                }}
                onClick={(event) => {
                  if (isDisabled) return;

                  if (event.target.mouseDownHandled) {
                    event.target.mouseDownHandled = false;
                    return;
                  }
                  playSound(
                    sound.url,
                    sound.volume,
                    sound.name,
                    sound.image,
                    sound.index
                  );
                }}
              >
                {sound.emoji} {sound.name}{" "}
              </Button>
            );
          })}
        <SleepTimer />
      </div>
      <br />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Playlists</h1>
            {!isOnline && (
              <span className="text-xs bg-yellow-800/60 px-2 py-1 rounded text-yellow-200">
                Offline Mode - {cachedSoundscapes.length} sounds available
              </span>
            )}
          </div>
          <Button
            className="py-1 h-9"
            variant="outline"
            onClick={() => setShowPlaylistDialog(true)}
          >
            Create Playlist
          </Button>
        </div>

        <Dialog open={showPlaylistDialog} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPlaylist ? "Edit Playlist" : "Create New Playlist"}
              </DialogTitle>
              <DialogDescription>
                {editingPlaylist
                  ? "Edit your playlist settings and soundscapes."
                  : "Create a custom playlist of soundscapes with specific durations."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Playlist Name</Label>
                <Input
                  id="name"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="My Relaxation Mix"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={playlistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
                  placeholder="A calming mix of nature sounds"
                />
              </div>

              <div className="grid gap-2">
                <Label>Available Soundscapes</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {soundscapes.map((soundscape) => (
                    <Button
                      key={soundscape.index}
                      variant={
                        playlistItems.some(
                          (item) => item.index === soundscape.index
                        )
                          ? "secondary"
                          : "outline"
                      }
                      onClick={() => handleAddToPlaylist(soundscape)}
                      className="flex items-center gap-2"
                    >
                      <span>{soundscape.emoji}</span>
                      <span>{soundscape.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {playlistItems.length > 0 && (
                <div className="grid gap-2">
                  <Label>Selected Soundscapes</Label>
                  <div className="space-y-2">
                    {playlistItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 border rounded"
                      >
                        <span className="flex items-center gap-1">
                          <span>{soundscapes[item.index].emoji}</span>
                          <span>{soundscapes[item.index].name}</span>
                        </span>
                        <Input
                          type="number"
                          min="1"
                          value={item.duration}
                          onChange={(e) =>
                            handleUpdateDuration(index, e.target.value)
                          }
                          className="w-20"
                        />
                        <span>minutes</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromPlaylist(index)}
                          className="ml-auto"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={handleSavePlaylist}>
                {editingPlaylist ? "Save Changes" : "Save Playlist"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {playlists.length > 0 && (
          <div>
            <div className="grid gap-4">
              {playlists.map((playlist, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg bg-background border-input"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{playlist.name}</h4>
                      <p className="text-[14.5px] text-zinc-400">
                        {playlist.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {currentPlaylist?.name === playlist.name ? (
                        <Button onClick={stopPlaylist} variant="destructive">
                          Stop Playlist
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={() => handleEditPlaylist(playlist)}
                            variant="outline"
                            className="h-9"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => playPlaylist(playlist)}
                            className="h-9"
                          >
                            Play Playlist
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    {playlist.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className={`text-sm flex items-center gap-1 p-1 rounded ${
                          currentPlaylist?.name === playlist.name &&
                          currentPlaylistIndex === itemIndex
                            ? "bg-gray-900"
                            : ""
                        }`}
                      >
                        <span>{soundscapes[item.index].emoji}</span>
                        <span>{soundscapes[item.index].name}</span>
                        <span className="text-zinc-400">
                          - {item.duration} minutes
                        </span>
                        {currentPlaylist?.name === playlist.name &&
                          currentPlaylistIndex === itemIndex && (
                            <span className="ml-2 text-blue-500">
                              {playing ? "⏸︎ Playing" : "▶︎ Paused"}
                            </span>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {currentURL && (
        <>
          <br />
          <br />
          <br />
        </>
      )}
    </div>
  );
}

export default Home;
