StreamSUI - NFT Rewards Platform for SUI Ecosystem
📖 Overview
StreamSUI est une plateforme de streaming décentralisée construite sur la blockchain SUI qui connecte les développeurs de projets SUI (GameFi, dApps) avec des streamers et leurs audiences. Elle automatise la distribution de NFTs aux viewers les plus engagés pour créer un canal marketing authentique et gamifié autour de l'écosystème SUI.

🎯 Mission
L'objectif est de transformer le streaming en un outil de croissance pour l'écosystème SUI en permettant aux projets de sponsoriser des streams et de récompenser l'engagement réel des viewers avec des NFTs vérifiables. La plateforme sert aussi de rampe d'onboarding pour de nouveaux utilisateurs SUI de manière organique et engageante.

🏗️ Rôles Principaux
1. Viewer
Connexion via Slush Wallet avec authentification sociale (zkLogin : Google/Facebook)

Consultation de sa collection de NFTs gagnés via la plateforme

Accès à un classement temps réel des streams sponsorisés les plus populaires

Réception automatique de NFTs basés sur son engagement (temps de visionnage, commentaires, dons)

2. Dev (Project Owner)
Accès à un feed marketplace pour publier des offres de sponsoring de streams

Paramétrage des offres :

Nombre de NFTs à distribuer (ex: 100 NFTs/heure aux top viewers)

Pourcentage de dons reversé (ex: 30% pour le dev, 70% pour le streamer)

Design personnalisé du NFT

Upload du design du NFT qui sera minté pour les viewers éligibles

Utilisation de StreamSUI comme canal d'acquisition utilisateur à faible coût

3. Streamer
Navigation dans le feed d'offres de sponsoring disponibles

Acceptation directe d'une offre ou négociation via un chat intégré

Publication de son stream sur StreamSUI une fois l'accord conclu

Réception automatique de sa part des dons via smart contract

⚙️ Fonctionnement Technique
Smart Contracts SUI (Move)
Marketplace Contract : gestion des offres, accords dev–streamer et splits de revenus

NFT Minting Contract : mint de NFTs avec métadonnées dynamiques basées sur le score des viewers

Donation Split Contract : distribution automatique des dons selon les termes de l'accord

Agent IA + Nautilus
Monitoring en temps réel du stream (potentiellement via extension Twitch)

Collecte des données d'engagement : watchtime, commentaires, likes, dons

Calcul off-chain vérifiable des scores via Nautilus (Trusted Execution Environment)

Attestation cryptographique soumise on-chain pour validation

Minting automatique en fin de stream et distribution aux wallets éligibles

Système de Donations
Extension de paiement inspirée de WaveTip, adaptée à SUI

Microtransactions en temps réel avec frais très bas (scalabilité jusqu'à 297,000 TPS)

Split automatique des donations via smart contract selon l'accord dev–streamer

Event System
Webhooks SUI natifs pour synchroniser blockchain et streaming en temps réel

Notifications automatiques aux viewers lors de la réception de NFTs

Mise à jour dynamique des classements de streams

🛠️ Stack Technique
Blockchain: SUI (Move language)
Off-chain Compute: Nautilus (Verifiable TEE)
Wallet: Slush avec zkLogin (Google/Facebook/Twitch)
Smart Contracts: Move pour NFTs, marketplace, payment splits
Event Listeners: SUI native webhooks
AI Agent: Monitoring et scoring en temps réel

💡 Cas d'Usage
Promotion GameFi
Un projet GameFi SUI qui prépare son lancement sponsorise 10 streamers pour 3 streams/semaine pendant 1 mois. Les viewers engagés reçoivent des NFTs qui débloquent early access, items in-game, ou whitelist pour l'airdrop.

Éducation SUI
La Sui Foundation sponsorise des streams éducatifs sur les nouveautés de l'écosystème. Les viewers assidus reçoivent des NFTs de certification prouvant leur participation et compréhension.

Lancement de dApp
Une dApp DeFi sur SUI sponsorise des streams de démonstration live. Les NFTs distribués offrent des bonus de staking ou des frais réduits aux early adopters.

🚀 Avantages Compétitifs
Zéro barrière d'entrée pour viewers : Slush zkLogin permet de créer un wallet SUI en 30 secondes avec un simple compte Google.

Coût d'acquisition ultra-bas : Les devs ne paient que le minting (quelques centimes par NFT sur SUI), bien moins cher que la publicité traditionnelle.

Pas de frais minimum : Contrairement aux plateformes traditionnelles, aucun budget minimum n'est requis.

Engagement authentique : Les NFTs récompensent l'engagement réel (watchtime, participation), pas juste l'achat.

Transparence totale : Smart contracts garantissent la distribution équitable des dons et des NFTs, éliminant les commissions cachées.

Scalabilité SUI : Architecture parallèle et frais bas permettent de distribuer des milliers de NFTs par stream sans congestion.

Écosystème intégré : Synergie avec l'écosystème GameFi et DeFi de SUI en pleine expansion (70+ jeux en développement).

🎯 Opportunités de Partenariat
Sui Foundation : Canal de distribution officiel pour initiatives éducatives et marketing
Sui Gaming Summit 2025 : Présence au sommet du 18 mars pour capter les projets GameFi
Projets GameFi : XOCIETY, Aftermath, et 70+ jeux en développement cherchent des canaux d'acquisition
DeFi Protocols : Intégration avec l'écosystème DeFi de SUI pour offres croisées

📊 Modèle Économique
Revenue Viewer : Gratuit, reçoit des NFTs en récompense

Revenue Streamer : Pourcentage des dons (70-90% selon accord avec dev)

Revenue Dev : Acquisition d'utilisateurs qualifiés pour son projet

Revenue Plateforme : Frais optionnel (2-5%) sur les transactions ou modèle freemium avec features premium

🔐 Sécurité & Anti-Fraude
Nautilus attestations garantissent l'authenticité des calculs de score

Détection de bots via analyse comportementale dans l'agent IA

Smart contracts audités pour sécuriser les donations

NFTs soulbound optionnels pour éviter le farming

🧪 Mint & Affichage des NFTs
Comment mint le n‑ième NFT de test
Exemple d'appel HTTP pour minter un NFT de test via l'API backend :

bash
curl -k -X POST https://localhost:3001/api/nft/mint \
  -H "Content-Type: application/json" \
  -d '{
    "imageName": "test.png",
    "recipientAddress": "0x00…",
    "name": "Purple SUI NFT #n",
    "description": "n-ième NFT de test pour Purple SUI"
  }'
Paramètres :

imageName : nom de l'image dans ton storage (ou bucket)

recipientAddress : adresse SUI du wallet destinataire

name / description : métadonnées qui seront associées au NFT

Comment récupérer les NFTs du wallet connecté pour les afficher dans le front
Principe général :

Le frontend envoie une requête POST ou GET à ton backend (ex: /api/nft/by-wallet) avec l'adresse du wallet connecté

Le backend interroge SUI (ou ton indexeur interne) pour récupérer la liste des NFTs associés à cette adresse

Le backend renvoie les métadonnées utiles (image, name, description, tokenId, etc.)

Côté front, un hook React consomme cet endpoint et expose les données au composant

Exemple de hook React :

typescript
// useWalletNfts.ts
import { useEffect, useState } from "react";
import axios from "axios";

export function useWalletNfts(walletAddress: string | undefined) {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;
    setLoading(true);

    axios
      .get(`/api/nft/by-wallet`, { params: { address: walletAddress } })
      .then((res) => setNfts(res.data))
      .finally(() => setLoading(false));
  }, [walletAddress]);

  return { nfts, loading };
}
Utilisation dans un composant :

tsx
const { nfts, loading } = useWalletNfts(connectedWalletAddress);

// Puis map sur nfts pour les afficher (card, grid, etc.)
return (
  <div>
    {loading ? <p>Loading NFTs...</p> : (
      nfts.map(nft => (
        <NFTCard key={nft.id} {...nft} />
      ))
    )}
  </div>
);
StreamSUI transforme le streaming en un moteur de croissance décentralisé pour l'écosystème SUI, où chaque participant (dev, streamer, viewer) est directement récompensé pour sa contribution authentique.