import { useState } from "react";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Shield, Lock, Eye, EyeOff, AlertTriangle, Check, Key, Smartphone, Save } from "lucide-react";
import { toast } from "sonner";

interface PrivacyPageProps {
  role: "dev" | "streamer" | "viewer";
}

export default function PrivacyPage({ role }: PrivacyPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showActivity: true,
    showNFTCollection: true,
    allowMessages: "everyone",
  });

  const handleSave = () => {
    toast.success("Paramètres de confidentialité sauvegardés!");
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(twoFactorEnabled ? "2FA désactivée" : "2FA activée avec succès!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader role={role} />
      
      <main className="max-w-4xl mx-auto p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-400" />
                Confidentialité & Sécurité
              </h1>
              <p className="text-slate-400">Protégez votre compte et vos données</p>
            </div>
            <Button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>

          {/* Security Status */}
          <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Votre compte est sécurisé</h3>
                <p className="text-slate-300 text-sm">
                  Wallet connecté et vérifié. 2FA {twoFactorEnabled ? "activée" : "désactivée"}.
                </p>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Mot de passe</h2>
                <p className="text-slate-400 text-sm">Modifier votre mot de passe</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-slate-800/50 border-slate-700 text-white pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Nouveau mot de passe</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Confirmer le nouveau mot de passe</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Key className="w-4 h-4 mr-2" />
                Changer le mot de passe
              </Button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">Authentification à deux facteurs (2FA)</h2>
                <p className="text-slate-400 text-sm">Sécurité supplémentaire pour votre compte</p>
              </div>
              <button
                onClick={handleEnable2FA}
                className={`w-12 h-6 rounded-full transition-colors ${
                  twoFactorEnabled ? "bg-purple-600" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    twoFactorEnabled ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {twoFactorEnabled && (
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-cyan-300 font-medium mb-1">2FA activée</p>
                    <p className="text-slate-400 text-sm">
                      Votre compte est protégé par une authentification à deux facteurs.
                      Scannez le QR code avec votre application d'authentification.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Privacy Settings */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Confidentialité du profil</h2>
                <p className="text-slate-400 text-sm">Contrôlez qui peut voir vos informations</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Profile Visibility */}
              <div>
                <Label className="text-slate-300 mb-3 block">Visibilité du profil</Label>
                <select
                  value={privacy.profileVisibility}
                  onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white"
                >
                  <option value="public">Public - Visible par tous</option>
                  <option value="friends">Amis uniquement</option>
                  <option value="private">Privé - Masqué</option>
                </select>
              </div>

              {/* Activity Visibility */}
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div>
                  <div className="text-white font-medium">Afficher mon activité</div>
                  <div className="text-slate-400 text-sm">Bounties complétés et transactions</div>
                </div>
                <button
                  onClick={() => setPrivacy({ ...privacy, showActivity: !privacy.showActivity })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    privacy.showActivity ? "bg-purple-600" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      privacy.showActivity ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* NFT Collection Visibility */}
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div>
                  <div className="text-white font-medium">Afficher ma collection NFT</div>
                  <div className="text-slate-400 text-sm">Rendre visible mes NFT rewards</div>
                </div>
                <button
                  onClick={() => setPrivacy({ ...privacy, showNFTCollection: !privacy.showNFTCollection })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    privacy.showNFTCollection ? "bg-purple-600" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      privacy.showNFTCollection ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Messages */}
              <div>
                <Label className="text-slate-300 mb-3 block">Qui peut m'envoyer des messages</Label>
                <select
                  value={privacy.allowMessages}
                  onChange={(e) => setPrivacy({ ...privacy, allowMessages: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white"
                >
                  <option value="everyone">Tout le monde</option>
                  <option value="friends">Amis uniquement</option>
                  <option value="nobody">Personne</option>
                </select>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Zone dangereuse</h2>
                <p className="text-slate-400 text-sm">Actions irréversibles</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Effacer tout l'historique
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Déconnecter le wallet
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-500 text-red-400 hover:bg-red-500/10"
              >
                Supprimer le compte définitivement
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
