"use client";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Loader2 } from "lucide-react";

/**
 * Twitch callback trimmed down: no multi-step UI.
 * We process the token in background (or simulate in dev) and navigate immediately.
 */
export default function TwitchCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { connectTwitch, userRole, suiAddress } = useUser();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const error = searchParams.get("error") || params.get("error");
    const errorDescription = searchParams.get("error_description") || params.get("error_description");
    const isDev = import.meta.env.DEV;

    if (error) {
      console.error("[TwitchCallback] Erreur OAuth:", error, errorDescription);
      setStatus("error");
      setErrorMessage(errorDescription || error || "Erreur OAuth");
      return;
    }

    const navigateToReturn = () => {
      // Récupérer l'URL de retour sauvegardée
      const returnUrl = sessionStorage.getItem('twitch_return_url');
      sessionStorage.removeItem('twitch_return_url');
      
      if (returnUrl && returnUrl !== '/auth/twitch/callback') {
        console.log('[TwitchCallback] Retour à l\'URL d\'origine:', returnUrl);
        navigate(returnUrl, { replace: true });
      } else {
        // Par défaut, aller à la landing page
        console.log('[TwitchCallback] Aucune URL de retour, redirection vers la page d\'accueil');
        navigate('/', { replace: true });
      }
    };

    const fetchUserInfo = async (token: string) => {
      try {
        const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
        if (!clientId) throw new Error("VITE_TWITCH_CLIENT_ID non configuré");

        const response = await fetch("https://api.twitch.tv/helix/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Client-Id": clientId,
          },
        });
        if (!response.ok) throw new Error(`Erreur API Twitch: ${response.status}`);
        const data = await response.json();
        const user = data.data?.[0];
        if (!user) throw new Error("Aucune donnée utilisateur reçue");

        const twitchData = {
          username: user.login,
          userId: user.id,
          avatarUrl: user.profile_image_url,
          email: user.email,
        };
        connectTwitch(twitchData);
        setStatus("success");
      } catch (err) {
        console.error("[TwitchCallback] Erreur fetchUserInfo:", err);
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Erreur Twitch");
      } finally {
        navigateToReturn();
      }
    };

    // If there's a token, fetch user info, otherwise navigate
    if (accessToken) {
      console.log('[TwitchCallback] Token reçu, récupération des infos utilisateur...');
      fetchUserInfo(accessToken);
    } else {
      console.warn('[TwitchCallback] Aucun access_token trouvé dans le hash. Hash:', hash);
      // No token: navigate without blocking the user
      navigateToReturn();
    }
  }, [searchParams, connectTwitch, userRole, navigate]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="text-center space-y-6 p-8 bg-red-500/5 border border-red-500/20 rounded-2xl backdrop-blur max-w-md">
          <h2 className="text-2xl font-bold text-white">Erreur de connexion Twitch</h2>
          <p className="text-red-300">{errorMessage}</p>
        </div>
      </div>
    );
  }

  // Minimal UI while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="text-center space-y-4 p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur max-w-sm w-full">
        <Loader2 className="w-8 h-8 mx-auto text-white animate-spin" />
        <p className="text-slate-400">Redirection en cours...</p>
      </div>
    </div>
  );
}
