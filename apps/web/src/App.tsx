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
import StreamerBounties from "./pages/streamer/bounties";
import StreamerMessages from "./pages/streamer/messages";
import StreamerStats from "./pages/streamer/stats";
import StreamerBountyDetail from "./pages/streamer/bounty-detail";
import ViewerBrowse from "./pages/viewer/browse";

// Profile Pages
import ProfilePage from "./pages/profile/ProfilePage";
import HistoryPage from "./pages/profile/HistoryPage";
import NFTRewardsPage from "./pages/profile/NFTRewardsPage";
import PreferencesPage from "./pages/profile/PreferencesPage";
import PrivacyPage from "./pages/profile/PrivacyPage";

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
          <Route path="/streamer/bounties" element={<StreamerBounties />} />
          <Route path="/streamer/bounty/:id" element={<StreamerBountyDetail />} />
          <Route path="/streamer/messages" element={<StreamerMessages />} />
          <Route path="/streamer/stats" element={<StreamerStats />} />
          <Route path="/viewer/browse" element={<ViewerBrowse />} />
          
          {/* Profile Routes - Dev */}
          <Route path="/dev/profile" element={<ProfilePage role="dev" />} />
          <Route path="/dev/history" element={<HistoryPage role="dev" />} />
          <Route path="/dev/nft-rewards" element={<NFTRewardsPage role="dev" />} />
          <Route path="/dev/preferences" element={<PreferencesPage role="dev" />} />
          <Route path="/dev/privacy" element={<PrivacyPage role="dev" />} />
          
          {/* Profile Routes - Streamer */}
          <Route path="/streamer/profile" element={<ProfilePage role="streamer" />} />
          <Route path="/streamer/history" element={<HistoryPage role="streamer" />} />
          <Route path="/streamer/nft-rewards" element={<NFTRewardsPage role="streamer" />} />
          <Route path="/streamer/preferences" element={<PreferencesPage role="streamer" />} />
          <Route path="/streamer/privacy" element={<PrivacyPage role="streamer" />} />
          
          {/* Profile Routes - Viewer */}
          <Route path="/viewer/profile" element={<ProfilePage role="viewer" />} />
          <Route path="/viewer/history" element={<HistoryPage role="viewer" />} />
          <Route path="/viewer/nft-rewards" element={<NFTRewardsPage role="viewer" />} />
          <Route path="/viewer/preferences" element={<PreferencesPage role="viewer" />} />
          <Route path="/viewer/privacy" element={<PrivacyPage role="viewer" />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}