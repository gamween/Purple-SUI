import "@mysten/dapp-kit/dist/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { Providers } from "./lib/providers";

// Pages
import LandingPage from "./pages/LandingPage";
import AuthLogin from "./pages/auth/login";
import AuthCallback from "./pages/auth/callback";
import TwitchCallback from "./pages/auth/TwitchCallback";
import RoleSelection from "./pages/RoleSelection";
import DevDashboard from "./pages/dev/dashboard";
import DevBounties from "./pages/dev/bounties";
import DevStats from "./pages/dev/stats";
import DevChat from "./pages/dev/chat";
import BountyDetail from "./pages/dev/bounty-detail";
import DevStreamers from "./pages/dev/streamers";
import StreamerDashboard from "./pages/streamer/dashboard";
import ViewerBrowse from "./pages/viewer/browse";

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<AuthLogin />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/twitch/callback" element={<TwitchCallback />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/dev/dashboard" element={<DevDashboard />} />
          <Route path="/dev/bounties" element={<DevBounties />} />
          <Route path="/dev/stats" element={<DevStats />} />
          <Route path="/dev/chat" element={<DevChat />} />
          <Route path="/dev/bounty/:id" element={<BountyDetail />} />
          <Route path="/dev/streamers" element={<DevStreamers />} />
          <Route path="/streamer/dashboard" element={<StreamerDashboard />} />
          <Route path="/viewer/browse" element={<ViewerBrowse />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}