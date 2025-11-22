'use client';

import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Code, Tv, Eye } from 'lucide-react';

type UserRole = 'dev' | 'streamer' | 'viewer';

/**
 * Page de sélection de rôle utilisateur
 * Permet de choisir entre Développeur, Streamer ou Viewer
 */
export default function RoleSelectionPage() {
  const { setRole, isConnected } = useUser();
  const navigate = useNavigate();

  // Rediriger vers la homepage si pas connecté
  if (!isConnected) {
    navigate('/');
    return null;
  }

  const handleRoleSelect = (role: UserRole) => {
    setRole(role);
    
    // Rediriger vers le dashboard approprié
    if (role === 'dev') {
      navigate('/dev/dashboard');
    } else if (role === 'streamer') {
      navigate('/streamer/dashboard');
    } else if (role === 'viewer') {
      navigate('/viewer/browse');
    }
  };

  const roles = [
    {
      id: 'dev' as UserRole,
      icon: Code,
      title: 'Développeur',
      description: 'Postez des bounties et sponsorisez des streams pour promouvoir vos projets GameFi.',
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500/50',
      hoverColor: 'hover:border-blue-400',
      features: [
        '✓ Poster des bounties',
        '✓ Sponsoriser des streams',
        '✓ Analytics détaillées',
        '✓ Connexion Twitch optionnelle'
      ]
    },
    {
      id: 'streamer' as UserRole,
      icon: Tv,
      title: 'Streamer',
      description: 'Acceptez des bounties, streamez et récompensez automatiquement vos viewers avec des NFTs.',
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500/50',
      hoverColor: 'hover:border-purple-400',
      features: [
        '✓ Accepter des bounties',
        '✓ Distribuer des NFTs',
        '✓ Dashboard de streams',
        '⚠️ Connexion Twitch obligatoire'
      ]
    },
    {
      id: 'viewer' as UserRole,
      icon: Eye,
      title: 'Viewer',
      description: 'Regardez des streams, engagez-vous et recevez des NFTs en récompense de votre participation.',
      color: 'from-green-500 to-emerald-500',
      borderColor: 'border-green-500/50',
      hoverColor: 'hover:border-green-400',
      features: [
        '✓ Regarder des streams',
        '✓ Recevoir des NFTs',
        '✓ Collection de rewards',
        '⚠️ Connexion Twitch obligatoire'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-6xl w-full py-12">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Choisissez votre rôle
          </h1>
          <p className="text-xl text-slate-400">
            Sélectionnez comment vous souhaitez utiliser StreamSUI
          </p>
        </div>
        
        {/* Role Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`group relative p-8 bg-white/5 hover:bg-white/10 rounded-2xl border ${role.borderColor} ${role.hoverColor} transition-all duration-300 hover:scale-105 hover:shadow-2xl text-left`}
              >
                {/* Gradient Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10 space-y-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Title */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {role.title}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                  
                  {/* Features List */}
                  <ul className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <li 
                        key={idx}
                        className={`text-xs ${feature.startsWith('⚠️') ? 'text-amber-400' : 'text-slate-300'}`}
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Arrow indicator */}
                  <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pt-4">
                    <div className="px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium">
                      Sélectionner →
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-500">
            Vous pourrez changer de rôle à tout moment depuis les paramètres
          </p>
        </div>
      </div>
    </div>
  );
}
