import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { User, Camera, Wallet, Mail, Globe, Save } from "lucide-react";
import { toast } from "sonner";

interface ProfilePageProps {
  role: "dev" | "streamer" | "viewer";
}

export default function ProfilePage({ role }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: "User123",
    email: "user@example.com",
    bio: "Passionné de blockchain et de gaming",
    website: "https://mywebsite.com",
    walletAddress: "0x7a8f...9b3c",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user123",
  });

  // Remplir automatiquement l'adresse du wallet depuis le contexte utilisateur (Slush ou autre)
  const { suiAddress } = useUser();

  useEffect(() => {
    if (suiAddress) {
      setProfile((p) => ({ ...p, walletAddress: suiAddress }));
    }
  }, [suiAddress]);

  const handleSave = () => {
    toast.success("Profil mis à jour avec succès!");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader role={role} />
      
      <main className="max-w-4xl mx-auto p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
              <p className="text-slate-400">Gérez vos informations personnelles</p>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Modifier le profil
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="border-slate-700 text-slate-300"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-800">
              <div className="relative group">
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full border-4 border-slate-700"
                />
                {isEditing && (
                  <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </button>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white mt-4">{profile.username}</h2>
              <div className="flex items-center gap-2 mt-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                <Wallet className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">{profile.walletAddress}</span>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Username */}
                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nom d'utilisateur
                  </Label>
                  <Input
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    disabled={!isEditing}
                    className="bg-slate-800/50 border-slate-700 text-white disabled:opacity-70"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="bg-slate-800/50 border-slate-700 text-white disabled:opacity-70"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label className="text-slate-300 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Site web
                </Label>
                <Input
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  disabled={!isEditing}
                  className="bg-slate-800/50 border-slate-700 text-white disabled:opacity-70"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label className="text-slate-300">Bio</Label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  className="bg-slate-800/50 border-slate-700 text-white disabled:opacity-70 resize-none"
                  placeholder="Parlez-nous de vous..."
                />
              </div>

              {/* Wallet Address (Read-only) */}
              <div className="space-y-2">
                <Label className="text-slate-300 flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Adresse du wallet
                </Label>
                <Input
                  value={profile.walletAddress}
                  disabled
                  className="bg-slate-800/30 border-slate-700 text-slate-400 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500">L'adresse du wallet ne peut pas être modifiée</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">12</div>
              <div className="text-slate-400 text-sm">Bounties complétés</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">5</div>
              <div className="text-slate-400 text-sm">NFT Rewards</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">2.5k SUI</div>
              <div className="text-slate-400 text-sm">Gains totaux</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
