import { useEffect, useState, useRef } from "react";
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

  useEffect(() => {
    if (window.location.hostname === "/") {
      document.title = "Noisefill";
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
    if (
      audio.src === url &&
      document.getElementById("player").paused === false
    ) {
      audio.pause();
      return;
    } else {
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
      <div className="flex flex-wrap gap-2">
        <CreditsMenu />
        {soundscapes.map((sound, index) => (
          <Button
            variant="outline"
            key={index}
            onClick={() => {
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
            {playing ? (sound.url == currentURL ? message : "") : ""}
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
