import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../components/auth/LoadingSpinner";
import { Twitch } from "lucide-react";

export default function AuthLogin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") || "viewer";

  useEffect(() => {
    // Simulate OAuth redirect
    // In production, this would redirect to Twitch OAuth:
    // https://id.twitch.tv/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_CALLBACK&response_type=code&scope=user:read:email
    
    setTimeout(() => {
      // Simulate successful OAuth with mock code
      const mockCode = "mock_oauth_code_" + Math.random().toString(36).substring(7);
      const state = Math.random().toString(36).substring(7);
      
      navigate(`/auth/callback?code=${mockCode}&state=${state}&role=${role}`);
    }, 1500);
  }, [role, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-500/20 rounded-full mb-6 animate-pulse">
          <Twitch className="w-10 h-10 text-purple-400" />
        </div>
        
        <h1 className="text-white mb-2">Connexion à Twitch</h1>
        <p className="text-slate-400 mb-8">Redirection vers Twitch pour l'authentification...</p>
        
        <LoadingSpinner size="lg" />
        
        <p className="text-sm text-slate-500 mt-8">
          Vous allez être redirigé vers Twitch pour autoriser l'application
        </p>
      </div>
    </div>
  );
}