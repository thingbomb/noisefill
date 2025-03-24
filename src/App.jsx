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
  const pathname = location.pathname;

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <a
            href="/"
            className="flex items-center gap-1.5 p-2 text-gray-200 hover:text-white transition-colors tracking-[-0.1px] font-medium text-sm"
          >
            {/*prettier-ignore*/}
            <NoisefillSvg />
            Noisefill
          </a>
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
                      <Square fill="white" />
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
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-[#101012] !border max-h-[calc(100vh-16px)]">
        <SiteHeader />
        <div className="overflow-y-auto">
          <div className="relative z-10 overflow-y-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
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
            <footer className="flex justify-start items-center p-5 pl-0 gap-2 relative z-10">
              <p className="text-center text-sm text-muted-foreground">
                Soundscapes from{" "}
                <a href="/credits" className="hover:underline">
                  various creators
                </a>
              </p>
              {!isMobile ? (
                <>
                  <p className="text-center text-sm text-muted-foreground">•</p>
                  <a
                    href="https://github.com/thingbomb/noisefill"
                    className="text-center text-sm text-muted-foreground hover:underline"
                  >
                    GitHub repository
                  </a>
                </>
              ) : null}
            </footer>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
