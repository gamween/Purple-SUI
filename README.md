# CreatorSeal – Fan Engagement Hub on Sui

CreatorSeal est une dApp Sui qui permet à des créateurs de contenu de proposer des contenus et récompenses exclusives à leur communauté, sans intermédiaire, avec des règles d’accès on-chain, du contenu chiffré (Seal) et un score d’engagement calculé off-chain de manière vérifiable (Nautilus).

## Vision

- Donner aux créateurs un moyen simple de monétiser/valoriser leur communauté sans plateforme centralisée.  
- Offrir aux fans de vrais “fan passes” et badges qu’ils possèdent réellement, qui évoluent selon leur engagement.  
- Gérer l’accès à du contenu privé via du chiffrement et de la vérification off-chain, sans backend propriétaire.

***

## Fonctionnalités principales

### Côté créateur

- Création d’un profil créateur on-chain (`CreatorProfile`).  
- Mint de “Fan Pass” pour sa communauté (ou mint par les fans eux‑mêmes).  
- Création de “drops” de contenu exclusif (`ExclusiveDrop`) dont les données sont chiffrées avec Seal.  
- Airdrop de badges on-chain à des groupes de fans.  
- Mise à jour du niveau / XP des FanPass à partir de scores calculés dans un TEE Nautilus.

### Côté fan

- Mint de son FanPass pour un créateur donné.  
- Accès à des contenus exclusifs si les conditions d’accès sont remplies (niveau, badges…).  
- Réception de badges d’achievement non transférables (ou partiellement transférables).  
- Progression d’un niveau de fan débutant à super fan grâce à des actions vérifiées off-chain.

***

## Architecture fonctionnelle

### Objets on-chain (Move)

1. `CreatorProfile`  
   - Identifie un créateur (adresse, nom, liens, image).  
   - Sert de racine pour tous ses FanPass, badges et drops.

2. `CreatorCapability`  
   - Objet de capability détenu par le créateur.  
   - Donne les droits d’admin : créer des drops, airdrop des badges, upgrader les FanPass.  
   - Empêche qu’un autre compte gère le profil.

3. `FanPass`  
   - NFT lié à un `CreatorProfile`.  
   - Champs typiques : `creator_id`, `owner`, `level`, `xp`, `metadata_uri`.  
   - Peut être soulbound (non transférable) ou transférable selon le design.  
   - Sert de ticket d’accès aux `ExclusiveDrop` et aux badges.

4. (Optionnel) `FanStats`  
   - Objet séparé qui contient les données très évolutives (xp, score détaillé, historique résumé).  
   - Relié au `FanPass` par un identifiant, pour garder le NFT plus simple.

5. `Badge`  
   - NFT représentant un achievement (ex. “Early supporter”, “Top donator”, “Live viewer”).  
   - Certains badges peuvent être soulbound (preuve d’engagement), d’autres échangeables.

6. `ExclusiveDrop`  
   - Objet qui représente un contenu exclusif pour les fans : titre, type, timestamp.  
   - Contient un identifiant de contenu chiffré Seal (ex. `seal_content_id`) et des paramètres de politique d’accès (niveau minimum, badges requis).

***

## Flux principaux

### 1. Onboarding créateur

1. Le créateur connecte son wallet et appelle `create_creator_profile()`.  
2. L’app crée un `CreatorProfile` + `CreatorCapability` pour cette adresse.  
3. Le front affiche une page d’admin où le créateur peut :  
   - Configurer son identité (nom, description, liens).  
   - Configurer les règles par défaut de son FanPass (prix éventuel, transferrable/soulbound…).

### 2. Mint du FanPass par un fan

1. Un fan choisit un créateur et appelle `mint_fan_pass_self(creator_id)`.  
2. Un nouvel objet `FanPass` est créé et associé :  
   - Au `CreatorProfile`.  
   - À l’adresse du fan comme owner.  
3. Le front affiche le FanPass avec niveau 1, XP 0 et liste des badges (vide au début).

### 3. Création d’un drop chiffré avec Seal

1. Le créateur téléverse une ressource (vidéo, audio, PDF…) via le front.  
2. Le front chiffre cette ressource avec le SDK Seal et obtient un identifiant de contenu chiffré (`seal_content_id`).  
3. Le créateur appelle `create_encrypted_drop(creator_cap, metadata, seal_content_id, policy_params)`.  
4. On crée un objet `ExclusiveDrop` avec :  
   - Le lien vers le contenu chiffré (ID Seal).  
   - Les conditions d’accès : niveau min, badges requis, dates, etc.

### 4. Accès au contenu fan via Seal

1. Un fan qui possède un `FanPass` clique sur un drop exclusif.  
2. Le front appelle `request_decrypt_token(fan_pass, drop_id)`.  
3. Le contrat Move :  
   - Vérifie que le `FanPass` appartient bien à l’utilisateur.  
   - Vérifie les règles d’accès stockées dans `ExclusiveDrop` (niveau, badges…).  
   - Émet un signal / token d’autorisation qu’utilise le SDK Seal pour délivrer la clé de déchiffrement au fan.  
4. Le front déchiffre le contenu avec la clé et l’affiche localement.

### 5. Gestion de l’engagement via Nautilus

1. Une app dans Nautilus (TEE) récupère des métriques d’engagement off-chain :  
   - Statistiques de vues / likes / watch-time (via API du créateur),  
   - Ou données internes à l’app (votes, commentaires, participation aux lives).  
2. Nautilus calcule un score d’engagement et un niveau cible pour un fan donné.  
3. La TEE signe un `signed_score` (score, niveau, fan_id, créateur).  
4. Le créateur ou l’app appelle `apply_offchain_score(fan_id, signed_score)`.  
5. Le contrat Move :  
   - Vérifie la preuve / attestation Nautilus.  
   - Met à jour `FanPass.level` et/ou `FanStats`.  
   - Émet un event si un seuil est franchi (par exemple, mint automatique d’un badge).

***

## Contrat Move – Décisions de design

### Types et abilities

- Tous les objets on-chain ont `key` et `store`.  
- Les capabilities (`CreatorCapability`) n’ont pas `store` exposé publiquement pour éviter des transferts hors module.  
- Les badges soulbound sont implémentés en ne fournissant pas de fonction de transfert publique pour ces types.

### Contrôle d’accès

- Toutes les fonctions admin (création de drops, airdrops, upgrade des fans) demandent un `CreatorCapability` comme argument.  
- Ceci garantit que seul le propriétaire du `CreatorProfile` peut gérer sa communauté.

### NFTs dynamiques

- `FanPass` contient au minimum : niveau, XP.  
- Les métadonnées visuelles (image, nom) peuvent évoluer en fonction du niveau (process géré par le front ou par une logique on-chain rudimentaire).  
- Option `FanStats` pour isoler les données très mouvantes.

### Soulbound vs transférable

- FanPass :  
  - Par défaut, soulbound pour représenter un lien non spéculatif entre un fan et un créateur.  
  - Option possible : un type spécial de pass “collectible” transférable, pour l’aspect trading.  
- Badges :  
  - “Proof-of-engagement” badges : soulbound.  
  - “Collectibles” : transférables, utilisables sur des marketplaces.

***

## Intégration Seal – Décisions

- Tous les contenus exclusifs (drops) sont stockés chiffrés, jamais en clair côté backend.  
- L’ID du contenu chiffré Seal est stocké dans `ExclusiveDrop`.  
- Les règles d’accès sont déclarées on-chain (niveau, badges), puis appliquées par Seal au moment de délivrer la clé.  
- Le front est responsable d’appeler Seal avec le token/autorisation obtenu du smart contract et de déchiffrer côté client.

***

## Intégration Nautilus – Décisions

- Plutôt que de répliquer l’algorithme d’engagement on-chain (complexe, gourmand en gas, besoin de données Web2), ce calcul est fait dans une enclave sécurisée Nautilus.  
- Le smart contract ne fait que :  
  - Vérifier l’attestation Nautilus.  
  - Appliquer les mises à jour de score / niveau qui ont été signées.  
- En démo hackathon, l’implémentation peut être simplifiée :  
  - Une TEE qui renvoie des scores prédéfinis ou calculés à partir de quelques entrées de test.  
  - Le pitch explique comment brancher de vraies données Twitch/YouTube après l’événement.

***

## Stack technique

- **Smart contracts** : Move sur Sui.  
- **Backend off-chain** :  
  - App Nautilus dans TEE pour score d’engagement.  
  - Intégration Seal pour chiffrement / déchiffrement.  
- **Front-end** :  
  - Framework web (par ex. Next.js ou autre) + SDK TypeScript Sui.  
  - Connexion wallet Sui (Sui Wallet, etc.).  
  - Intégration des SDK Seal et Nautilus côté client ou via un petit service.

***

## Roadmap hackathon (26h)

### MVP strictement fonctionnel

- Création de `CreatorProfile` + `CreatorCapability`.  
- Mint de `FanPass` (par le créateur ou par les fans).  
- Création de `ExclusiveDrop` avec un champ “fake Seal ID” ou vrai ID si vous avez le SDK prêt.  
- Fonction de check d’accès (`request_decrypt_token`) qui simule la délivrance de la clé.  
- Airdrop de badges simples (sans Nautilus).  
- UI basique :  
  - Page créateur : créer profil, drop, airdrop badges.  
  - Page fan : mint pass, voir badges, débloquer drop.

### “Plus” pour le jury

- Intégration réelle de Seal pour chiffrer / déchiffrer un contenu simple (image/texte).  
- Démo d’un call Nautilus qui renvoie un score signé permettant de monter de niveau un FanPass.  
- Un ou deux niveaux de FanPass avec un visuel qui change.