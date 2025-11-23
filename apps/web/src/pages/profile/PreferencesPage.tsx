import { useState } from "react";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Settings, Bell, Globe, Moon, Sun, Palette, Volume2, Save } from "lucide-react";
import { toast } from "sonner";

interface PreferencesPageProps {
  role: "dev" | "streamer" | "viewer";
}

export default function PreferencesPage({ role }: PreferencesPageProps) {
  const [settings, setSettings] = useState({
    language: "fr",
    theme: "dark",
    notifications: {
      bountyUpdates: true,
      donations: true,
      messages: true,
      weeklyDigest: false,
    },
    display: {
      compactMode: false,
      showAvatars: true,
      animationsEnabled: true,
    },
    sounds: {
      notificationSound: true,
      soundVolume: 70,
    },
  });

  const handleSave = () => {
    toast.success("Préférences sauvegardées avec succès!");
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
                <Settings className="w-8 h-8 text-purple-400" />
                Préférences
              </h1>
              <p className="text-slate-400">Personnalisez votre expérience Purple SUI</p>
            </div>
            <Button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>

          {/* Appearance Section */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Apparence</h2>
                <p className="text-slate-400 text-sm">Thème et affichage</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Theme */}
              <div>
                <Label className="text-slate-300 mb-3 block">Thème</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setSettings({ ...settings, theme: "dark" })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      settings.theme === "dark"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <Moon className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                    <div className="text-slate-300 text-sm">Sombre</div>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, theme: "light" })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      settings.theme === "light"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <Sun className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                    <div className="text-slate-300 text-sm">Clair</div>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, theme: "auto" })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      settings.theme === "auto"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <Settings className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                    <div className="text-slate-300 text-sm">Auto</div>
                  </button>
                </div>
              </div>

              {/* Display Options */}
              <div className="space-y-3">
                <Label className="text-slate-300">Options d'affichage</Label>
                {[
                  { key: "compactMode", label: "Mode compact", desc: "Interface plus dense" },
                  { key: "showAvatars", label: "Afficher les avatars", desc: "Montrer les photos de profil" },
                  { key: "animationsEnabled", label: "Animations", desc: "Activer les transitions animées" },
                ].map((option) => (
                  <div
                    key={option.key}
                    className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg"
                  >
                    <div>
                      <div className="text-white font-medium">{option.label}</div>
                      <div className="text-slate-400 text-sm">{option.desc}</div>
                    </div>
                    <button
                      onClick={() =>
                        setSettings({
                          ...settings,
                          display: {
                            ...settings.display,
                            [option.key]: !settings.display[option.key as keyof typeof settings.display],
                          },
                        })
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.display[option.key as keyof typeof settings.display]
                          ? "bg-purple-600"
                          : "bg-slate-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.display[option.key as keyof typeof settings.display]
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Notifications</h2>
                <p className="text-slate-400 text-sm">Gérer les alertes</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: "bountyUpdates", label: "Mises à jour de bounties", desc: "Nouvelles offres et acceptations" },
                { key: "donations", label: "Donations", desc: "Notifications de donations reçues" },
                { key: "messages", label: "Messages", desc: "Nouveaux messages et réponses" },
                { key: "weeklyDigest", label: "Résumé hebdomadaire", desc: "Rapport d'activité par email" },
              ].map((option) => (
                <div
                  key={option.key}
                  className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg"
                >
                  <div>
                    <div className="text-white font-medium">{option.label}</div>
                    <div className="text-slate-400 text-sm">{option.desc}</div>
                  </div>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          [option.key]: !settings.notifications[option.key as keyof typeof settings.notifications],
                        },
                      })
                    }
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.notifications[option.key as keyof typeof settings.notifications]
                        ? "bg-purple-600"
                        : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.notifications[option.key as keyof typeof settings.notifications]
                          ? "translate-x-6"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sound Settings */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Sons</h2>
                <p className="text-slate-400 text-sm">Paramètres audio</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div>
                  <div className="text-white font-medium">Sons de notification</div>
                  <div className="text-slate-400 text-sm">Jouer un son lors des notifications</div>
                </div>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      sounds: { ...settings.sounds, notificationSound: !settings.sounds.notificationSound },
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.sounds.notificationSound ? "bg-purple-600" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.sounds.notificationSound ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white font-medium">Volume</Label>
                  <span className="text-purple-400 font-semibold">{settings.sounds.soundVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sounds.soundVolume}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sounds: { ...settings.sounds, soundVolume: parseInt(e.target.value) },
                    })
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Langue</h2>
                <p className="text-slate-400 text-sm">Langue de l'interface</p>
              </div>
            </div>

            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        </div>
      </main>
    </div>
  );
}
