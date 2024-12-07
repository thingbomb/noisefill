import { useEffect, useState } from "react";
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
import { Analytics } from "@vercel/analytics/react";
import {
  soundscapes,
  savePlaylist,
  getPlaylists,
  deletePlaylist,
} from "../soundscapes";

let timer;

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
    <a href="/credits">
      <Button variant="outline">📝 Credits</Button>
    </a>
  );
}

function Home() {
  const [currentURL, setCurrentURL] = useState(null);
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
    audio.addEventListener("pause", () => {
      setPlaying(false);
      setMessage("");
    });
    audio.addEventListener("play", () => {
      setPlaying(true);
      if (document.getElementById("player").currentTime < 1) {
        setMessage("(loading)");
      } else {
        setMessage("(playing)");
      }
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
    audio.addEventListener("loadedmetadata", () => {
      setMessage("(playing)");
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

  const playSound = (url, volume, name, image, index) => {
    const audio = document.getElementById("player");
    if (audio.src === url && playing) {
      audio.pause();
      return;
    } else {
      audio.src = url;
      audio.volume = volume;
      audio.title = name;
      audio.setAttribute("image", image);
      audio.setAttribute("index", index);
      setCurrentURL(url);
      audio.play();
    }
  };

  const playPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentPlaylistIndex(0);
    playPlaylistItem(playlist, 0);
  };

  const playPlaylistItem = (playlist, index) => {
    if (index >= playlist.items.length) {
      playPlaylistItem(playlist, 0);
      return;
    }

    const item = playlist.items[index];
    const soundscape = soundscapes[item.soundscapeIndex];

    const audio = document.getElementById("player");
    audio.src = soundscape.url;
    audio.volume = soundscape.volume;
    setCurrentURL(soundscape.url);
    setPlaying(true);
    audio.play();

    setMessage(
      `Playing playlist: ${playlist.name} - ${soundscape.name} (${item.duration} minutes)`
    );

    const timer = setTimeout(() => {
      playPlaylistItem(playlist, index + 1);
    }, item.duration * 60 * 1000);

    setPlaylistTimer(timer);
    setCurrentPlaylistIndex(index);
  };

  const stopPlaylist = () => {
    if (playlistTimer) {
      clearTimeout(playlistTimer);
    }
    setCurrentPlaylist(null);
    setCurrentPlaylistIndex(0);
    setPlaylistTimer(null);

    const audio = document.getElementById("player");
    audio.pause();
    setPlaying(false);
    setMessage("");
  };

  return (
    <div>
      <audio id="player" loop></audio>
      <h1 className="text-3xl font-bold">Relax</h1>
      <p className="mb-4 text-lg">Relax with some noise</p>
      <div className="flex flex-wrap gap-2">
        {soundscapes.map((sound, index) => {
          if (sound.categories.includes("relax")) {
            return (
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
            );
          }
        })}
      </div>
      <br />
      <h1 className="text-3xl font-bold">Focus</h1>
      <p className="mb-4 text-lg">Soundscapes for focus</p>
      <div className="flex flex-wrap gap-2">
        {soundscapes.map((sound, index) => {
          if (sound.categories.includes("focus")) {
            return (
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
            );
          }
        })}
      </div>
      <br />
      <h1 className="text-3xl font-bold">Nature</h1>
      <p className="mb-4 text-lg">Listen to some nature soundscapes</p>
      <div className="flex flex-wrap gap-2">
        {soundscapes.map((sound, index) => {
          if (sound.categories.includes("nature")) {
            return (
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
            );
          }
        })}
      </div>
      <br />
      <h1 className="text-3xl font-bold">Ambience</h1>
      <p className="mb-4 text-lg">Light, ambient soundscapes</p>
      <div className="flex flex-wrap gap-2">
        {soundscapes.map((sound, index) => {
          if (sound.categories.includes("ambience")) {
            return (
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
            );
          }
        })}
      </div>
      <br />
      <h1 className="text-3xl font-bold">Sleep</h1>
      <p className="mb-4 text-lg">
        The lightest soundscapes optimized for sleep
      </p>
      <div className="flex flex-wrap gap-2">
        {soundscapes.map((sound, index) => {
          if (sound.categories.includes("sleep")) {
            return (
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
            );
          }
        })}
      </div>
      <br />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Playlists</h1>
          <Button onClick={() => setShowPlaylistDialog(true)}>
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
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">Your Playlists</h3>
            <div className="grid gap-4">
              {playlists.map((playlist, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{playlist.name}</h4>
                      <p className="text-sm text-gray-600">
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
                          >
                            Edit
                          </Button>
                          <Button onClick={() => playPlaylist(playlist)}>
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
                        <span className="text-gray-500">
                          - {item.duration} minutes
                        </span>
                        {currentPlaylist?.name === playlist.name &&
                          currentPlaylistIndex === itemIndex && (
                            <span className="ml-2 text-blue-500">
                              ▶ Playing
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
        <br />
        <h1 className="text-3xl font-bold">More</h1>
        <div className="flex flex-wrap gap-2">
          <SleepTimer />
          <CreditsMenu />
        </div>
        <br />
      </div>
      <Analytics />
    </div>
  );
}

export default Home;
