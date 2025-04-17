import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Sparkles } from "lucide-react";
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

  // Smart Mix state
  const [isSmartMixActive, setIsSmartMixActive] = useState(false);
  const [listeningPreferences, setListeningPreferences] = useState({});
  const [hasEligibleSounds, setHasEligibleSounds] = useState(false);
  const smartMixTimerRef = useRef(null);

  // Listen for listening preferences updates from App component
  // Check if there are eligible sounds for Smart Mix
  const checkEligibleSounds = useCallback(() => {
    const MINIMUM_LISTENING_TIME = 300; // in seconds (5 minutes)

    // Check if any sounds have been listened to for at least 5 minutes
    const eligibleSoundsExist = Object.entries(listeningPreferences).some(
      ([_, data]) => {
        return (
          data &&
          data.totalMinutes &&
          data.totalMinutes * 60 > MINIMUM_LISTENING_TIME
        );
      }
    );

    setHasEligibleSounds(eligibleSoundsExist);
    return eligibleSoundsExist;
  }, [listeningPreferences]);

  // Update eligible sounds check whenever listening preferences change
  useEffect(() => {
    checkEligibleSounds();
  }, [listeningPreferences, checkEligibleSounds]);

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

  // Clean up smart mix on component unmount
  useEffect(() => {
    return () => {
      if (smartMixTimerRef.current) {
        clearTimeout(smartMixTimerRef.current);
      }
    };
  }, []);

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

  // Smart Mix Functions
  const getSmartMix = () => {
    // Log what we're working with for debugging
    console.log("Current listening preferences:", listeningPreferences);

    // Only include sounds that have been listened to for at least 5 minutes (300 seconds)
    const MINIMUM_LISTENING_TIME = 300; // in seconds (5 minutes)

    const eligibleSounds = Object.entries(listeningPreferences)
      .filter(([key, data]) => {
        // Make sure we have valid data with totalMinutes exceeding minimum threshold
        return (
          data &&
          data.totalMinutes &&
          data.totalMinutes * 60 > MINIMUM_LISTENING_TIME
        ); // Convert minutes to seconds
      })
      .sort((a, b) => b[1].totalMinutes - a[1].totalMinutes); // Sort by most listened

    console.log("Eligible sounds found:", eligibleSounds);

    if (eligibleSounds.length === 0) {
      // If no listening history, use the top 3 sounds from soundscapes
      console.log("No eligible sounds, using default top 3 sounds");
      return soundscapes.slice(0, 3).map((sound, index) => ({
        soundIndex: index,
        soundObject: sound,
        duration: 2, // Default 2 minute duration
      }));
    }

    // Get top sounds (up to 5)
    const topSounds = eligibleSounds.slice(0, 5);
    console.log("Top sounds selected:", topSounds);

    // Create a mix with durations based on average listening session
    return topSounds.map(([soundKey, data]) => {
      // Calculate mean duration of listening sessions
      // Default duration - at least 1.5 minutes
      let meanDuration = 1.5;

      // Calculate actual mean using total minutes and session count
      if (data.sessionCount && data.sessionCount > 0) {
        // Mean duration = total time / number of sessions
        meanDuration = data.totalMinutes / data.sessionCount;

        // Ensure minimum duration of 1.5 minutes for better experience
        meanDuration = Math.max(meanDuration, 1.5);
      }

      // Find sound in soundscapes by searching for matching name pattern
      const foundSoundIndex = soundscapes.findIndex((s) => {
        const normalizedName = s.name.toLowerCase().replace(/\s+/g, "-");
        return (
          normalizedName === soundKey ||
          normalizedName.includes(soundKey) ||
          soundKey.includes(normalizedName)
        );
      });

      // Use direct index if found, otherwise use first sound
      const soundIndex = foundSoundIndex >= 0 ? foundSoundIndex : 0;
      const soundObject = soundscapes[soundIndex];

      console.log(`Found sound ${soundKey}:`, {
        soundIndex,
        soundObject,
        meanDuration,
      });

      return {
        soundIndex,
        soundObject,
        duration: meanDuration,
      };
    });
  };

  const startSmartMix = () => {
    console.log("Starting Smart Mix");

    // Stop any current playlist
    if (currentPlaylist) {
      stopPlaylist();
    }

    // Stop any current playback
    const audio = audioRef.current || document.getElementById("player");
    audio.pause();

    // Clear any existing timers
    if (smartMixTimerRef.current) {
      clearTimeout(smartMixTimerRef.current);
      smartMixTimerRef.current = null;
    }

    // Get smart mix sounds
    const smartMixSounds = getSmartMix();
    console.log("Smart mix sounds generated:", smartMixSounds);

    if (!smartMixSounds || smartMixSounds.length === 0) {
      console.log("No sounds available for Smart Mix");
      return;
    }

    // Force isSmartMixActive to true first
    setIsSmartMixActive(true);

    // Play immediately without waiting - we've ensured smart mix is active
    // Store the mixSounds in a ref to avoid state update issues
    const currentMixRef = { sounds: smartMixSounds, active: true };
    playNextSmartMixSound(smartMixSounds, 0);
  };

  const playNextSmartMixSound = (mixSounds, index) => {
    console.log(`Playing sound ${index} of ${mixSounds.length}`);

    // Check if we've reached the end of the playlist
    // Don't check isSmartMixActive here since it may not have updated yet
    if (index >= mixSounds.length) {
      console.log(
        "End of Smart Mix playlist reached - looping back to beginning"
      );
      // Reset index to 0 to loop back to the beginning of the playlist
      index = 0;
    }

    // If we're transitioning to a new sound, ensure the current session is properly recorded
    if (index > 0 || mixSounds.length === 1) {
      // Get reference to the audio element
      const audio = audioRef.current || document.getElementById("player");

      // Create a custom event to force recording the current session
      // This will update listeningSessions array with accurate duration before switching sounds
      if (audio && audio.title) {
        const soundKey = audio.title.toLowerCase().replace(/\s+/g, "-");
        const event = new CustomEvent("smart-mix-transition", {
          detail: { soundKey },
        });
        window.dispatchEvent(event);
      }
    }

    const currentSound = mixSounds[index];
    if (!currentSound.soundObject) {
      console.log("Invalid sound object, skipping to next");
      // Skip if sound not found and try the next one
      playNextSmartMixSound(mixSounds, index + 1);
      return;
    }

    console.log("About to play sound:", currentSound);

    // Make sure we have all the required properties
    const soundObject = currentSound.soundObject;
    const url = soundObject.url;
    const volume = soundObject.volume || 1.0;
    const name = soundObject.name;
    const image = soundObject.image || "";
    const soundIndex = currentSound.soundIndex || 0;

    // Extract the sound key for incrementing session count
    const soundName = name.toLowerCase().replace(/\s+/g, "-");

    // Increment the session count FOR THIS SOUND right when it's selected to play in Smart Mix
    window.incrementSessionCount?.(soundName);
    console.log(
      `Smart Mix selecting sound: incrementing session count for ${soundName}`
    );

    // Play the current sound directly
    try {
      const audio = audioRef.current || document.getElementById("player");

      // Set up new audio source
      audio.src = url;
      audio.title = name;
      audio.setAttribute("image", image);
      audio.setAttribute("index", soundIndex);
      setCurrentURL(url);
      audio.volume = volume;

      // Update UI state
      setPlaying(true);

      // Update message
      const durationText = currentSound.duration.toFixed(1);
      setMessage(`Smart Mix: ${name} (${durationText} minutes)`);

      // Play the audio
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch((err) => {
          console.error("Error playing sound:", err);
        });
      }

      // Schedule next sound with minimum duration of 90 seconds
      const MINIMUM_PLAY_DURATION = 90 * 1000; // 90 seconds in ms
      let durationMs = currentSound.duration * 60 * 1000; // Convert minutes to ms

      // Ensure each sound plays for at least 90 seconds while still respecting mean listening session duration
      durationMs = Math.max(durationMs, MINIMUM_PLAY_DURATION);

      console.log(
        `Scheduling next sound in ${durationMs}ms (${
          durationMs / 1000
        } seconds)`
      );

      smartMixTimerRef.current = setTimeout(() => {
        playNextSmartMixSound(mixSounds, index + 1);
      }, durationMs);
    } catch (error) {
      console.error("Error in Smart Mix playback:", error);
      // Try to recover by playing the next sound
      setTimeout(() => {
        playNextSmartMixSound(mixSounds, index + 1);
      }, 1000);
    }
  };

  const stopSmartMix = () => {
    console.log("Explicitly stopping Smart Mix");
    setIsSmartMixActive(false);
    setMessage("");
    if (smartMixTimerRef.current) {
      clearTimeout(smartMixTimerRef.current);
      smartMixTimerRef.current = null;
    }

    // Pause any currently playing audio
    const audio = audioRef.current || document.getElementById("player");
    if (audio && !audio.paused) {
      audio.pause();
      setPlaying(false);
    }
  };

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
    if (
      playlistItems.some((item) => item.soundscapeIndex === soundscape.index)
    ) {
      return;
    }
    setPlaylistItems([
      ...playlistItems,
      { soundscapeIndex: soundscape.index, duration: 5 },
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

  const playSound = (url, volume, name, image, index) => {
    const audio = audioRef.current || document.getElementById("player");

    // If smart mix is active and this is a manual sound change, stop the smart mix
    if (isSmartMixActive && !smartMixTimerRef.current) {
      stopSmartMix();
    }

    // Check if we are playing or pausing the same sound
    const isSameSound = audio.src === url;
    const isCurrentlyPlaying = !document.getElementById("player").paused;

    // If clicking the currently playing sound, just pause it
    if (isSameSound && isCurrentlyPlaying) {
      audio.pause();
      return;
    } else {
      // Extract the soundKey from the URL or name
      const soundName = name.toLowerCase().replace(/\s+/g, "-");

      // Increment the session count right when a new sound is selected to play
      // This happens at the moment of clicking, before changing the audio source
      if (!isSameSound) {
        window.incrementSessionCount?.(soundName);
        console.log(
          `Button clicked: incrementing session count for ${soundName}`
        );
      }

      // Set up new audio source
      audio.src = url;
      audio.title = name;
      audio.setAttribute("image", image);
      audio.setAttribute("index", index);
      setCurrentURL(url);

      // Find the corresponding soundscape to get the volume
      const soundscape = soundscapes.find((s) => s.url === url);
      if (soundscape) {
        // Set volume directly from the soundscape
        audio.volume = soundscape.volume || 1.0;
      } else {
        // Fallback volume
        audio.volume = volume || 1.0;
      }

      // Play the audio
      audio.play();
    }
  };

  const playPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentPlaylistIndex(0);
    playPlaylistItem(playlist, 0);

    // Dispatch event to notify App component about playlist change
    window.dispatchEvent(
      new CustomEvent("playlist-change", {
        detail: { playlist, index: 0 },
      })
    );
  };

  const playPlaylistItem = (playlist, index) => {
    if (index >= playlist.items.length) {
      playPlaylistItem(playlist, 0);
      return;
    }

    const item = playlist.items[index];
    const soundscape = soundscapes[item.soundscapeIndex];

    const audio = audioRef.current || document.getElementById("player");
    audio.src = soundscape.url;
    // Set all necessary attributes for the media bar to update properly
    audio.title = soundscape.name;
    audio.setAttribute("image", soundscape.image);
    audio.setAttribute("index", soundscape.index);
    // Set volume directly from soundscape
    audio.volume = soundscape.volume || 1.0;
    setCurrentURL(soundscape.url);
    setPlaying(true);

    // Play the audio
    audio.play();

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
    if (playlistTimer) {
      clearTimeout(playlistTimer);
    }
    setCurrentPlaylist(null);
    setCurrentPlaylistIndex(0);
    setPlaylistTimer(null);

    const audio = audioRef.current || document.getElementById("player");
    audio.pause();
    setPlaying(false);
    setMessage("");

    // Dispatch event to notify App component that playlist has stopped
    window.dispatchEvent(new CustomEvent("playlist-stop"));
  };

  useEffect(() => {
    if (window.location.pathname === "/") {
      document.title = "Noisefill";
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
        <Button
          variant={isSmartMixActive ? "secondary" : "outline"}
          onClick={() => {
            if (isSmartMixActive) {
              stopSmartMix();
            } else {
              startSmartMix();
            }
          }}
          className={cn("flex items-center gap-2", {
            "bg-purple-900/20 text-purple-300 border-purple-500":
              isSmartMixActive,
            hidden: !isSmartMixActive && hasEligibleSounds,
          })}
          title={
            !hasEligibleSounds && !isSmartMixActive
              ? "Listen to sounds for at least 5 minutes to unlock Smart Mix"
              : ""
          }
        >
          <Sparkles
            className={`h-4 w-4 ${isSmartMixActive ? "text-purple-300" : ""}`}
          />
          <span>
            {isSmartMixActive ? "Stop Smart Mix" : "Smart Mix (beta)"}
          </span>
        </Button>
        {soundscapes
          .filter((sound) => {
            if (
              new URL(window.location.href).hostname.startsWith("reversed.")
            ) {
              return sound.reversedURL != null;
            }
            return true;
          })
          .map((sound, index) => (
            <Button
              variant="outline"
              key={index}
              onMouseDown={(event) => {
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
          ))}
        <SleepTimer />
      </div>
      <br />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Playlists</h1>
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
                          (item) => item.soundscapeIndex === soundscape.index
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
                          <span>{soundscapes[item.soundscapeIndex].emoji}</span>
                          <span>{soundscapes[item.soundscapeIndex].name}</span>
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
                        <span>{soundscapes[item.soundscapeIndex].emoji}</span>
                        <span>{soundscapes[item.soundscapeIndex].name}</span>
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
