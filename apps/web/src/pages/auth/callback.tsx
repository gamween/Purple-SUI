import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "../../components/auth/LoadingSpinner";
import { ProgressStepper } from "../../components/auth/ProgressStepper";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useZkLogin } from "../../hooks/useZkLogin";

type AuthStep = "authenticating" | "wallet" | "mapping" | "success" | "error";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<AuthStep>("authenticating");
  const [error, setError] = useState<string | null>(null);
  const zkLogin = useZkLogin();

  const code = searchParams.get("code");
  const role = searchParams.get("role") || "viewer";

  // Détecter si c'est un callback zkLogin
  const isZkLoginCallback = typeof window !== 'undefined' && 
    (window.location.hash.includes('id_token') || window.location.hash.includes('access_token'));

  /**
   * Callback zkLogin - Génère l'adresse Sui depuis le JWT social
   */
  const handleZkLoginCallback = async () => {
    try {
      setCurrentStep("wallet");
      console.log('[Callback] Traitement zkLogin...');
      
      // Le hook zkLogin traite le JWT et génère l'adresse Sui
      const address = await zkLogin.handleCallback();
      
      console.log('[Callback] Adresse Sui générée:', address);
      
      // Passer au mapping
      setCurrentStep("mapping");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setCurrentStep("success");
      
      // Auto-redirect après 2 secondes
      setTimeout(() => {
        redirectToDashboard();
      }, 2000);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur zkLogin';
      setError(`Échec de la connexion zkLogin: ${message}`);
      setCurrentStep("error");
      console.error('[Callback] Erreur zkLogin:', err);
    }
  };

  /**
   * Flow OAuth Twitch classique (sans zkLogin)
   */
  const authenticateWithTwitch = async () => {
    try {
      console.log('[Callback] Authentification Twitch classique...');
      
      // Simulate OAuth authentication
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setCurrentStep("wallet");
      
      // Pour Twitch classique, on demande la connexion wallet séparée
      // (pas de zkLogin, donc besoin d'un wallet externe)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setCurrentStep("mapping");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setCurrentStep("success");
      
      setTimeout(() => {
        redirectToDashboard();
      }, 2000);
      
    } catch (err) {
      setError("Échec de l'authentification Twitch. Veuillez réessayer.");
      setCurrentStep("error");
    }
  };

  const proceedToMapping = async () => {
    try {
      setCurrentStep("mapping");
      
      // Simulate account mapping
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setCurrentStep("success");
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        redirectToDashboard();
      }, 3000);
    } catch (err) {
      setError("Échec du mapping du compte");
      setCurrentStep("error");
    }
  };

  const redirectToDashboard = () => {
    const roleRoutes: Record<string, string> = {
      dev: "/dev/dashboard",
      streamer: "/streamer/dashboard",
      viewer: "/viewer/browse",
    };

    navigate(roleRoutes[role] || "/");
  };

  // Effect pour gérer l'authentification au chargement
  useEffect(() => {
    if (isZkLoginCallback) {
      // Flow zkLogin (Google/Facebook/Twitch social login)
      handleZkLoginCallback();
    } else if (code) {
      // Flow OAuth Twitch classique
      authenticateWithTwitch();
    } else {
      setError("Code d'authentification manquant");
      setCurrentStep("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    setError(null);
    setCurrentStep("authenticating");
    authenticateWithTwitch();
  };

  const steps = [
    {
      label: "Authentification Twitch",
      completed: ["wallet", "mapping", "success", "error"].includes(currentStep),
      active: currentStep === "authenticating",
    },
    {
      label: "Connexion Wallet",
      completed: ["mapping", "success"].includes(currentStep),
      active: currentStep === "wallet",
    },
    {
      label: "Mapping du compte",
      completed: currentStep === "success",
      active: currentStep === "mapping",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SB</span>
            </div>
          </div>
          <h1 className="text-white mb-2">Connexion en cours</h1>
          <p className="text-slate-400">Veuillez patienter pendant que nous configurons votre compte</p>
        </div>

        {/* Progress Stepper */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-6">
          <ProgressStepper steps={steps} />

          {/* Loading State */}
          {(currentStep === "authenticating" || currentStep === "mapping") && (
            <div className="mt-8 text-center">
              <LoadingSpinner size="lg" />
              <p className="text-slate-300 mt-4">
                {currentStep === "authenticating" && "Vérification des credentials..."}
                {currentStep === "mapping" && "Enregistrement de votre profil..."}
              </p>
            </div>
          )}

          {/* Wallet Connection / Generation */}
          {currentStep === "wallet" && (
            <div className="mt-8 text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <LoadingSpinner size="md" />
              <p className="text-slate-300 mb-4 mt-4">
                {isZkLoginCallback 
                  ? 'Génération de votre wallet Sui...' 
                  : 'Connexion de votre wallet Sui...'}
              </p>
            </div>
          )}

          {/* Success State */}
          {currentStep === "success" && (
            <div className="mt-8 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white mb-2">Connexion réussie !</h3>
              <p className="text-slate-400 text-sm">Redirection vers votre dashboard...</p>
            </div>
          )}

          {/* Error State */}
          {currentStep === "error" && error && (
            <div className="mt-8">
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleRetry}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Réessayer
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="flex-1 border-slate-700 hover:border-slate-600"
                >
                  Retour à l'accueil
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Partner Logos */}
        <div className="flex items-center justify-center gap-6 opacity-60">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.571 4.714h1.715v5.143H11.57zm0 6.857h1.715V20H11.57z" />
            </svg>
            <span className="text-slate-400 text-sm">Twitch</span>
          </div>
          <div className="w-1 h-1 bg-slate-600 rounded-full" />
          <div className="text-slate-400 text-sm">Sui Wallet</div>
        </div>
      </div>

    </div>
  );
}