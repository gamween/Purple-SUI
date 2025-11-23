Purple SUI - NFT Rewards Platform for SUI Ecosystem

📖 Overview
Purple SUI est une plateforme de streaming décentralisée construite sur la blockchain SUI qui connecte les développeurs de projets SUI (GameFi, dApps) avec des streamers et leurs audiences.​
Elle automatise la distribution de NFTs aux viewers les plus engagés pour créer un canal marketing authentique et gamifié autour de l’écosystème SUI.​

🎯 Mission
L’objectif est de transformer le streaming en un outil de croissance pour l’écosystème SUI en permettant aux projets de sponsoriser des streams et de récompenser l’engagement réel des viewers avec des NFTs vérifiables.​
La plateforme sert aussi de rampe d’onboarding pour de nouveaux utilisateurs SUI de manière organique et engageante.​

🏗️ Rôles principaux
1. Viewer
  Connexion via Slush Wallet avec authentification sociale (zkLogin : Google / Facebook)
  Consultation de sa collection de NFTs gagnés via la plateforme.
  Accès à un classement temps réel des streams sponsorisés les plus populaires.
  Réception automatique de NFTs basés sur son engagement (temps de visionnage, commentaires, dons).

2. Dev (Project Owner)
  Accès à un feed marketplace pour publier des offres de sponsoring de streams.
  Paramétrage des offres :
    Nombre de NFTs à distribuer (ex. 100 NFTs / heure aux top viewers).
    Pourcentage de dons reversé (ex. 30% pour le dev, 70% pour le streamer).
    Design personnalisé du NFT.
  Upload du design du NFT qui sera minté pour les viewers éligibles.
  Utilisation de Purple SUI comme canal d’acquisition utilisateur à faible coût.

3. Streamer
  Navigation dans le feed d’offres de sponsoring disponibles.
  Acceptation directe d’une offre ou négociation via un chat intégré.
  Publication de son stream sur Purple SUI une fois l’accord conclu.
  Réception automatique de sa part des dons via smart contract.

⚙️ Fonctionnement technique
  Smart Contracts SUI (Move)
  Marketplace Contract : gestion des offres, accords dev–streamer et splits de revenus.​
  NFT Minting Contract : mint de NFTs avec métadonnées dynamiques basées sur le score des viewers.​
  Donation Split Contract : distribution automatique des dons selon les termes de l’accord.​

Agent IA + Nautilus
  Monitoring en temps réel du stream (potentiellement via extension Twitch).
  Collecte des données d’engagement : watchtime, commentaires, likes, dons.
  Calcul off-chain vérifiable des scores via Nautilus (Trusted Execution Environment) et génération d’une attestation cryptographique.
  Attestation soumise on-chain pour validation, puis minting automatique en fin de stream et distribution aux wallets éligibles.​
  
Système de donations
  Extension de paiement inspirée de WaveTip, adaptée à SUI.
  Microtransactions en temps réel avec frais très bas et haute scalabilité (TPS élevés grâce à l’exécution parallèle de SUI).​
  Split automatique des donations via smart contract selon l’accord dev–streamer.

Event system
  Webhooks SUI natifs pour synchroniser blockchain et streaming en temps réel.​
  Notifications automatiques aux viewers lors de la réception de NFTs.
  Mise à jour dynamique des classements de streams.

🛠️ Stack technique
  Blockchain : SUI (Move language).
  Off-chain Compute : Nautilus (Verifiable TEE).
  Wallet : Slush avec zkLogin (Google / Facebook / Twitch).
  Smart Contracts : Move pour NFTs, marketplace, payment splits.
  Event Listeners : Webhooks SUI natifs.
  AI Agent : Monitoring et scoring en temps réel.

💡 Cas d’usage
Promotion GameFi
Un projet GameFi SUI qui prépare son lancement sponsorise plusieurs streamers pour X streams / semaine pendant 1 mois.
Les viewers engagés reçoivent des NFTs qui débloquent early access, items in‑game ou whitelist pour un airdrop.

Éducation SUI
La Sui Foundation sponsorise des streams éducatifs sur les nouveautés de l’écosystème.
Les viewers assidus reçoivent des NFTs de certification prouvant leur participation et compréhension.

Lancement de dApp
Une dApp DeFi sur SUI sponsorise des streams de démonstration live.
Les NFTs distribués offrent des bonus de staking ou des frais réduits aux early adopters.

🚀 Avantages compétitifs
  Zéro barrière d’entrée pour les viewers : Slush zkLogin permet de créer un wallet SUI en quelques secondes avec un simple compte Google.
  Coût d’acquisition ultra‑bas : les devs ne paient que le minting (quelques centimes par NFT sur SUI), bien moins cher que la publicité traditionnelle.​
  Pas de frais minimum : aucun budget minimum requis, contrairement aux plateformes traditionnelles.
  Engagement authentique : les NFTs récompensent l’engagement réel (watchtime, participation), pas juste l’achat.
  Transparence totale : smart contracts garantissant la distribution équitable des dons et des NFTs, sans commissions cachées.​
  Scalabilité SUI : architecture parallèle et frais bas permettent de distribuer des milliers de NFTs par stream sans congestion.​
  Écosystème intégré : synergie avec l’écosystème GameFi et DeFi de SUI en pleine expansion.​

🎯 Opportunités de partenariat
  Sui Foundation : canal de distribution officiel pour initiatives éducatives et marketing.
  Sui Gaming Summit 2025 : présence à l’événement pour capter les projets GameFi.
  Projets GameFi : XOCIETY, Aftermath et de nombreux jeux en développement à la recherche de canaux d’acquisition.
  DeFi Protocols : intégration avec l’écosystème DeFi de SUI pour des offres croisées.

📊 Modèle économique
  Viewer : gratuit, reçoit des NFTs en récompense.
  Streamer : pourcentage des dons (70–90% selon accord avec le dev).
  Dev : acquisition d’utilisateurs qualifiés pour son projet.
  Plateforme : frais optionnels (2–5%) sur les transactions ou modèle freemium avec fonctionnalités premium.

🔐 Sécurité & anti‑fraude
  Attestations Nautilus garantissant l’authenticité des calculs de score.​
  Détection de bots via analyse comportementale dans l’agent IA.
  Smart contracts audités pour sécuriser les donations.
  NFTs soulbound optionnels pour éviter le farming abusif.

🧪 Mint & affichage des NFTs
Mint du n‑ième NFT de test
Exemple d’appel HTTP pour minter un NFT de test via l’API backend :

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
  imageName : nom de l’image dans le storage (ou bucket).
  recipientAddress : adresse SUI du wallet destinataire.
  name / description : métadonnées associées au NFT.
  Récupérer les NFTs du wallet connecté dans le front
  
Principe général :
  Le frontend envoie une requête POST ou GET à ton backend (par ex. /api/nft/by-wallet) avec l’adresse du wallet connecté.
  Le backend interroge SUI (ou ton indexeur interne) pour récupérer la liste des NFTs associés à cette adresse, puis renvoie les métadonnées utiles (image, name, description, tokenId, etc.).​
  Côté front, un hook React consomme cet endpoint et expose les données au composant.

Exemple de hook React :

ts
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
      .get("/api/nft/by-wallet", { params: { address: walletAddress } })
      .then((res) => setNfts(res.data))
      .finally(() => setLoading(false));
  }, [walletAddress]);

  return { nfts, loading };
}

Utilisation dans un composant :

tsx
const { nfts, loading } = useWalletNfts(connectedWalletAddress);

return (
  <div>
    {loading ? <p>Loading NFTs...</p> : (
      nfts.map((nft) => (
        <NFTCard key={nft.id} {...nft} />
      ))
    )}
  </div>
);
          
Purple SUI transforme le streaming en un moteur de croissance décentralisé pour l’écosystème SUI, où chaque participant (dev, streamer, viewer) est directement récompensé pour sa contribution authentique.​
