import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WhiteNoise from "./pages/WhiteNoise";
import NotFound from "./pages/NotFound";
import PinkNoise from "./pages/PinkNoise";
import Settings from "./pages/Settings";
import BrownNoise from "./pages/BrownNoise";
import Privacy from "./pages/Privacy";
import Support from "./pages/Support";
import PodcastsView from "./pages/PodcastsView";
import Podcasts from "./pages/Podcasts";
import Embed from "./pages/Embed";
import Credits from "./pages/Credits";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
} from "./components/ui/sidebar";
import { LucideHome } from "lucide-react";
import { PodcastIcon } from "lucide-react";
import { Square } from "lucide-react";
import { useIsMobile } from "./components/hooks/use-mobile";

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
  return (
    <SidebarProvider>
      <div className="md:grid md:grid-cols-[auto_minmax(0,1fr)] min-h-screen w-full">
        <Sidebar variant="collapsible">
          <SidebarHeader>
            <a href="/" className="flex items-center gap-2 p-2">
              Noisefill
            </a>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Pages</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem key={"home"}>
                    <SidebarMenuButton
                      asChild
                      isActive={window.location.pathname == "/"}
                    >
                      <a href="/">
                        <LucideHome />
                        <span>Home</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem key={"podcasts"}>
                    <SidebarMenuButton
                      asChild
                      isActive={window.location.pathname == "/podcasts"}
                    >
                      <a href="/podcasts">
                        <PodcastIcon />
                        <span>Podcasts</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Noises</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem key={"white-noise"}>
                    <SidebarMenuButton
                      asChild
                      isActive={window.location.pathname == "/white-noise"}
                    >
                      <a href="/white-noise">
                        <Square fill="white" />
                        <span>White Noise</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem key={"pink-noise"}>
                    <SidebarMenuButton
                      asChild
                      isActive={window.location.pathname == "/pink-noise"}
                    >
                      <a href="/pink-noise">
                        <Square fill="pink" />
                        <span>Pink Noise</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem key={"brown-noise"}>
                    <SidebarMenuButton
                      asChild
                      isActive={window.location.pathname == "/brown-noise"}
                    >
                      <a href="/brown-noise">
                        <Square fill="brown" />
                        <span>Brown Noise</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <main className="p-4 pt-2 relative w-full h-full">
          <header className="flex justify-start gap-4 items-center">
            <SidebarTrigger variant="outline" />
            <p className="text-md">{pathmap[window.location.pathname]}</p>
          </header>
          <div className="mt-3">
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
              <Route path="/podcasts/view" element={<PodcastsView />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <footer className="flex justify-start items-center p-5 pl-0 gap-2">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 George Stone
            </p>
            <p className="text-center text-sm text-muted-foreground">•</p>
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
        </main>
      </div>
    </SidebarProvider>
  );
}

export default App;
