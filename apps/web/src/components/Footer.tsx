export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Purple SUI Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-white font-semibold">Purple SUI</span>
            </div>
            <p className="text-sm text-slate-400">
              La première marketplace de bounties streamers sur la blockchain Sui
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white mb-4">Plateforme</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Pour les Développeurs
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Pour les Streamers
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Pour les Viewers
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Statistiques
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800">
          <p className="text-sm text-slate-400 text-center">
            © 2025 Purple SUI. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}