import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useZkLogin } from "../../hooks/useZkLogin";

/**
 * Simplified OAuth callback: do background processing but do not show the multi-step loader.
 * Display a minimal card with a Continue button so the user can proceed immediately.
 */
export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const zkLogin = useZkLogin();

  const code = searchParams.get("code");
  const role = searchParams.get("role") || "viewer";
  const isZkLoginCallback = typeof window !== "undefined" && (window.location.hash.includes("id_token") || window.location.hash.includes("access_token"));

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const redirectToDashboard = () => {
    const roleRoutes: Record<string, string> = {
      dev: "/dev/dashboard",
      streamer: "/streamer/dashboard",
      viewer: "/viewer/browse",
    };
    navigate(roleRoutes[role] || "/");
  };

  useEffect(() => {
    const process = async () => {
      try {
        if (isZkLoginCallback) {
          // zkLogin: let the hook handle the callback (generates wallet address)
          await zkLogin.handleCallback();
        } else if (code) {
          // OAuth Twitch classic: we could exchange code server-side; skip heavy UI here
          // Optionally call backend to finalize mapping (omitted)
        } else {
          // nothing to do
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erreur authentification";
        console.error("[Callback] Erreur traitement:", err);
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    process();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">SB</span>
          </div>
          <h1 className="text-white mb-2">Connexion</h1>
          <p className="text-slate-400">Vous pouvez continuer vers votre dashboard — le traitement se fait en arrière-plan.</p>
        </div>

        {error ? (
          <div className="mb-4 text-red-400">{error}</div>
        ) : null}

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-300 mb-4">{loading ? "Finalisation..." : "Prêt"}</p>
          <Button onClick={redirectToDashboard} className="w-full">
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
}