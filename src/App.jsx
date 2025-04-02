"use client";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WhiteNoise from "./pages/WhiteNoise";
import NotFound from "./pages/NotFound";
import PinkNoise from "./pages/PinkNoise";
import Settings from "./pages/Settings";
import BrownNoise from "./pages/BrownNoise";
import Privacy from "./pages/Privacy";
import Support from "./pages/Support";
import Podcasts from "./pages/Podcasts";
import Embed from "./pages/Embed";
import Credits from "./pages/Credits";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
  SidebarProvider,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarInset,
} from "./components/ui/sidebar";
import { LucideHome } from "lucide-react";
import { Square } from "lucide-react";
import { useIsMobile } from "./components/hooks/use-mobile";
import { Link } from "react-router-dom";
import NoisefillSvg from "./components/NoisefillSvg";
import { SiteHeader } from "./components/SiteHeader";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { soundscapes } from "./soundscapes";
import { useState, useEffect } from "react";
import audioRef from "./audioRef";
import { SkipForward } from "lucide-react";
import { Button } from "./components/ui/button";
import { SkipBack } from "lucide-react";
import { Rewind } from "lucide-react";
import { Play } from "lucide-react";
import { Forward } from "lucide-react";
import { FastForward } from "lucide-react";
import { Pause } from "lucide-react";
import { cn } from "./components/lib/utils";
import { Shield } from "lucide-react";
import { Notebook } from "lucide-react";

const pathmap = {
  "/": "Home",
  "/white-noise": "White Noise",
  "/pink-noise": "Pink Noise",
  "/brown-noise": "Brown Noise",
  "/podcasts": "Podcasts",
  "/embed": "Embed",
  "/privacy": "Privacy",
  "/support": "Support",
  "/settings": "Settings",
  "/credits": "Credits",
};

function App() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [currentURL, setCurrentURL] = useState(null);
  const pathname = location.pathname;
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioTitle, setAudioTitle] = useState("");

  useEffect(() => {
    const audio = audioRef.current || document.getElementById("player");
    const handleTitleChange = (passedTitle) => {
      if (!passedTitle) return;
      setAudioTitle(passedTitle);
    };

    if (audio) {
      // Initial state
      setAudioPlaying(!audio.paused);
      handleTitleChange(audio.title);

      // Event listeners for play/pause state
      const handlePlay = () => setAudioPlaying(true);
      const handlePause = () => setAudioPlaying(false);

      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);

      // Listen only for title attribute changes
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.attributeName === "title") {
            let mutatedTitle = mutation.target.getAttribute("title");
            handleTitleChange(mutatedTitle);
          }
        }
      });

      observer.observe(audio, {
        attributes: true,
        attributeFilter: ["title"],
      });

      return () => {
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        observer.disconnect();
      };
    }
  }, []);

  // Add state to track if we're in a playlist
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);

  // Listen for custom events from Home component to sync playlist state
  useEffect(() => {
    const handlePlaylistChange = (event) => {
      setCurrentPlaylist(event.detail.playlist);
      setCurrentPlaylistIndex(event.detail.index);
    };

    const handlePlaylistStop = () => {
      setCurrentPlaylist(null);
      setCurrentPlaylistIndex(0);
    };

    window.addEventListener("playlist-change", handlePlaylistChange);
    window.addEventListener("playlist-stop", handlePlaylistStop);

    return () => {
      window.removeEventListener("playlist-change", handlePlaylistChange);
      window.removeEventListener("playlist-stop", handlePlaylistStop);
    };
  }, []);

  const playSound = (url, volume, name, image, index) => {
    const audio = audioRef.current || document.getElementById("player");
    if (audio.src === url && playing) {
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

  // Function to navigate to next playlist item
  const playNextPlaylistItem = () => {
    if (!currentPlaylist || !currentPlaylist.items) return false;

    const nextIndex = (currentPlaylistIndex + 1) % currentPlaylist.items.length;
    // Dispatch event to notify Home component to play next item
    window.dispatchEvent(
      new CustomEvent("playlist-next", {
        detail: { index: nextIndex },
      })
    );
    return true;
  };

  // Function to navigate to previous playlist item
  const playPreviousPlaylistItem = () => {
    if (!currentPlaylist || !currentPlaylist.items) return false;

    const prevIndex =
      currentPlaylistIndex === 0
        ? currentPlaylist.items.length - 1
        : currentPlaylistIndex - 1;
    // Dispatch event to notify Home component to play previous item
    window.dispatchEvent(
      new CustomEvent("playlist-previous", {
        detail: { index: prevIndex },
      })
    );
    return true;
  };

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <Link
            to="/"
            className="flex items-center gap-1.5 p-2 text-gray-200 hover:text-white transition-colors tracking-[-0.1px] font-medium text-sm"
          >
            {/*prettier-ignore*/}
            <NoisefillSvg />
            Noisefill
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem key={"home"}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/"}
                    className="text-gray-300 hover:text-white"
                  >
                    <NavLink to="/">
                      <LucideHome />
                      <span>Home</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400">
              Noises
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem key={"white-noise"}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/white-noise"}
                    className="text-gray-300 hover:text-white"
                  >
                    <NavLink to="/white-noise">
                      <Square fill="currentColor" />
                      <span>White Noise</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem key={"pink-noise"}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/pink-noise"}
                    className="text-gray-300 hover:text-white"
                  >
                    <NavLink to="/pink-noise">
                      <Square fill="pink" />
                      <span>Pink Noise</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem key={"brown-noise"}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/brown-noise"}
                    className="text-gray-300 hover:text-white"
                  >
                    <NavLink to="/brown-noise">
                      <Square fill="brown" />
                      <span>Brown Noise</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400">
              About
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem key={"privacy"}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/privacy"}
                    className="text-gray-300 hover:text-white"
                  >
                    <NavLink to="/privacy">
                      <Shield />
                      <span>Privacy</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem key={"credits"}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/credits"}
                    className="text-gray-300 hover:text-white"
                  >
                    <NavLink to="/credits">
                      <Notebook />
                      <span>Credits</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-[#101012] !border max-h-[calc(100vh-16px)] flex-col">
        <SiteHeader />
        <div className="overflow-y-auto flex-1">
          <div className="relative z-10 overflow-y-auto p-4">
            <Routes>
              <Route
                path="/"
                element={
                  <Home currentURL={currentURL} setCurrentURL={setCurrentURL} />
                }
              />
              <Route path="/embed" element={<Embed />} />
              <Route path="/white-noise" element={<WhiteNoise />} />
              <Route path="/pink-noise" element={<PinkNoise />} />
              <Route path="/brown-noise" element={<BrownNoise />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/support" element={<Support />} />
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
        <div
          className={cn(
            "flex px-4 py-2 justify-center gap-4 items-center",
            "rounded-2xl shadow-lg border absolute",
            "bg-[#101012]/40 backdrop-blur-xl bottom-4 z-10 w-fit",
            "left-1/2 -translate-x-1/2",
            {
              "!hidden": currentURL == null || currentURL === "",
            }
          )}
        >
          <div className="left">
            <Button
              onClick={() => {
                const audio =
                  audioRef.current || document.getElementById("player");
                if (!audio) return;
                if (audio.paused) {
                  audio.play();
                } else {
                  audio.pause();
                }
              }}
              aria-label="Play/Pause"
              variant="ghost"
              className="px-2"
            >
              {audioPlaying ? (
                <Pause fill="currentColor" />
              ) : (
                <Play fill="currentColor" />
              )}
            </Button>
          </div>
          <div className="center">
            <p className="text-lg font-medium select-none">{audioTitle}</p>
          </div>
          <div className="right flex justify-center items-center">
            <Button
              onClick={() => {
                // Check if we're in a playlist first
                if (!playPreviousPlaylistItem()) {
                  // If not in a playlist or playlist navigation failed, use default behavior
                  const audio =
                    audioRef.current || document.getElementById("player");
                  if (!audio) return;
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
                }
              }}
              aria-label="Previous track"
              variant="ghost"
              className="px-2"
            >
              <Rewind fill="currentColor" />
            </Button>
            <Button
              onClick={() => {
                // Check if we're in a playlist first
                if (!playNextPlaylistItem()) {
                  // If not in a playlist or playlist navigation failed, use default behavior
                  const audio =
                    audioRef.current || document.getElementById("player");
                  if (!audio) return;
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
                }
              }}
              aria-label="Next track"
              variant="ghost"
              className="px-2"
            >
              <FastForward fill="currentColor" />
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
