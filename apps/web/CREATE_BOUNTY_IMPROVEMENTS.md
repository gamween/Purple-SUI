# Amélioration du formulaire de création de Bounty (Dev)

## Vue d'ensemble

Le formulaire de création de bounty pour les développeurs a été enrichi pour correspondre exactement aux informations affichées dans la page de détails vue par les streamers. Cela garantit que tous les champs nécessaires sont remplis dès la création.

## Changements apportés

### Nouveaux champs ajoutés

#### 1. **Description courte vs Description détaillée**
- **Description courte** (`description`): 1-2 phrases pour les cartes de bounty
- **Description détaillée** (`longDescription`): Texte complet visible sur la page de détails

#### 2. **Catégorie** (`category`)
Options disponibles:
- Gaming
- NFT
- DeFi
- Social
- Education
- Other

#### 3. **Public cible** (`targetAudience`)
Description du type d'audience à atteindre
Exemple: "Joueurs casual et semi-hardcore intéressés par les jeux puzzle et le Web3"

#### 4. **Viewers estimés** (`estimatedViewers`)
Range attendue de viewers
Exemple: "500-2000", "1000-3000"

#### 5. **Date limite** (`deadline`)
Date limite pour compléter la bounty (sélecteur de date)

#### 6. **Livrables attendus** (`deliverables[]`)
Liste dynamique des livrables que le streamer doit fournir
- Ajout/suppression d'items
- Icône CheckCircle2 pour chaque item
- Exemples: "Lien du stream (live + VOD)", "Screenshots des posts", "Statistiques du stream"

#### 7. **Prérequis techniques** (`technicalRequirements[]`) - OPTIONNEL
Liste dynamique des prérequis matériels/logiciels
- Ajout/suppression d'items
- Icône Wrench et bullet points
- Exemples: "Connexion stable 1080p minimum", "Wallet Sui configuré", "16GB RAM minimum"

### Champs existants conservés

- ✅ Titre de la bounty
- ✅ Montant total (SUI)
- ✅ Split streamer (%)
- ✅ Durée de la bounty (jours)
- ✅ Exigences du contrat (requirements[])

## Structure du formulaire

```typescript
interface BountyFormData {
  // Informations de base
  title: string;                    // *Obligatoire
  description: string;              // *Obligatoire - Court
  longDescription: string;          // *Obligatoire - Détaillé
  category: string;                 // *Obligatoire - Gaming, NFT, DeFi, etc.
  
  // Public et portée
  targetAudience: string;           // *Obligatoire
  estimatedViewers: string;         // *Obligatoire - Range (ex: "500-2000")
  
  // Timeline
  duration: string;                 // *Obligatoire - Nombre de jours
  deadline: string;                 // *Obligatoire - Date ISO
  
  // Financier
  amount: string;                   // *Obligatoire - En SUI
  split: string;                    // Défaut: "70"
  
  // Détails d'exécution
  requirements: string[];           // *Obligatoire - Min 1 item
  deliverables: string[];           // *Obligatoire - Min 1 item
  technicalRequirements?: string[]; // Optionnel
}
```

## Validation

### Champs obligatoires
- ❗ Titre
- ❗ Description courte
- ❗ Description détaillée
- ❗ Catégorie
- ❗ Public cible
- ❗ Viewers estimés
- ❗ Date limite
- ❗ Montant
- ❗ Durée
- ❗ Au moins 1 exigence (requirement)
- ❗ Au moins 1 livrable (deliverable)

### Champs optionnels
- Prérequis techniques (peuvent être vides)

### Messages d'erreur
```typescript
// Champs manquants
"Veuillez remplir tous les champs obligatoires"

// Pas d'exigence
"Ajoutez au moins une exigence"

// Pas de livrable
"Ajoutez au moins un livrable"

// Succès
"Bounty créée avec succès !"
```

## Interface utilisateur

### Layout
- **Largeur**: max-w-3xl (augmentée de 2xl pour plus d'espace)
- **Hauteur**: max-h-[95vh] (augmentée de 90vh)
- **Scroll**: Overflow-y-auto pour les longs formulaires

### Sections visuelles

#### 1. Informations de base
```
📝 Titre
📄 Description courte
📖 Description détaillée
```

#### 2. Catégorisation et audience
```
🏷️ Catégorie | 👥 Viewers estimés
🎯 Public cible
📅 Date limite
```

#### 3. Exigences (Requirements)
```
Liste numérotée dynamique
[1.] [Input field] [X]
Bouton: "+ Ajouter une exigence"
Couleur: Purple
```

#### 4. Livrables (Deliverables)
```
Liste avec checkboxes dynamique
[✓] [Input field] [X]
Bouton: "+ Ajouter un livrable"
Couleur: Cyan
```

#### 5. Prérequis techniques (Optional)
```
Liste avec bullets dynamique
[•] [Input field] [X]
Bouton: "+ Ajouter un prérequis"
Couleur: Yellow
```

#### 6. Paramètres financiers et durée
```
💰 Montant total | 📊 Split streamer
⏱️ Durée de la bounty
```

### Codes couleur par section
- **Requirements**: Purple (`border-purple-500/50`, `text-purple-400`)
- **Deliverables**: Cyan (`border-cyan-500/50`, `text-cyan-400`)
- **Technical**: Yellow (`border-yellow-500/50`, `text-yellow-400`)

## Fonctionnalités dynamiques

### Ajout d'items
```typescript
// Pour chaque type de liste
handleAdd[Type]() {
  set[Type]s([...[type]s, ""]);
}
```

### Suppression d'items
```typescript
// Garde toujours au moins 1 item
handleRemove[Type](index) {
  if ([type]s.length > 1) {
    set[Type]s([type]s.filter((_, i) => i !== index));
  }
}
```

### Modification d'items
```typescript
handleChange[Type](index, value) {
  const new[Type]s = [...[type]s];
  new[Type]s[index] = value;
  set[Type]s(new[Type]s);
}
```

## Correspondance avec la page de détails Streamer

| Champ formulaire Dev | Affichage Streamer | Section |
|---------------------|-------------------|---------|
| `title` | Titre principal | Header Card |
| `description` | Aperçu dans les cartes | BountyCard |
| `longDescription` | Description complète | Description Card |
| `category` | Badge catégorie | Header Card |
| `amount` | Montant total KPI | Header Card |
| `split` | Votre part KPI | Header Card |
| `estimatedViewers` | Viewers estimés KPI | Header Card |
| `targetAudience` | Public cible | Description Card |
| `requirements[]` | Liste numérotée | Requirements Card |
| `deliverables[]` | Liste checkboxes | Deliverables Card |
| `technicalRequirements[]` | Liste bullets | Technical Card |
| `deadline` | Date limite | Timeline Card |
| `duration` | Temps restant (calculé) | Timeline Card |

## Exemple de bounty complète

```json
{
  "title": "Promotion Sui 8192 - Jeu puzzle blockchain",
  "description": "Stream de 3 heures minimum de Sui 8192, le jeu de puzzle viral sur Sui.",
  "longDescription": "Sui 8192 est un jeu de puzzle innovant construit sur la blockchain Sui. Nous recherchons des streamers passionnés pour présenter notre jeu à leur communauté...",
  "category": "Gaming",
  "targetAudience": "Joueurs casual et semi-hardcore intéressés par les jeux puzzle et le Web3",
  "estimatedViewers": "500-2000",
  "deadline": "2025-12-06",
  "amount": "50",
  "split": "70",
  "duration": "14",
  "requirements": [
    "Stream de minimum 3 heures en une seule session",
    "Mention du jeu dans le titre du stream et la description",
    "Explication détaillée des mécaniques blockchain du jeu",
    "Au moins 2 posts sur les réseaux sociaux (Twitter/X, Discord)",
    "Répondre aux questions des viewers sur le jeu",
    "Enregistrement du VOD disponible pendant 7 jours minimum"
  ],
  "deliverables": [
    "Lien du stream (live + VOD)",
    "Screenshots des posts sur réseaux sociaux",
    "Statistiques du stream (viewers moyens, peak viewers, chat activity)"
  ],
  "technicalRequirements": [
    "Connexion stable pour streamer en 1080p minimum",
    "Wallet Sui configuré pour démonstration",
    "Compte de test fourni avec des tokens"
  ]
}
```

## Améliorations UX

### Guidage utilisateur
- ✅ Placeholders détaillés sur chaque champ
- ✅ Textes d'aide sous les champs importants
- ✅ Différenciation visuelle entre description courte et longue
- ✅ Couleurs distinctes par section (purple/cyan/yellow)

### Feedback visuel
- ✅ Boutons colorés selon leur fonction
- ✅ Icônes expressives (CheckCircle2, Wrench, Plus, X)
- ✅ Toast de succès après création
- ✅ Messages d'erreur explicites

### Ergonomie
- ✅ Minimum 1 item par liste (pas de suppression du dernier)
- ✅ Scroll automatique pour longs formulaires
- ✅ Modal plus large (3xl) et plus haute (95vh)
- ✅ Sections regroupées logiquement

## Points d'attention pour les développeurs

### 1. Remplir tous les champs obligatoires
Sans ces informations, les streamers ne pourront pas évaluer correctement la bounty.

### 2. Être spécifique dans les exigences
- ❌ "Stream du jeu"
- ✅ "Stream de 3 heures minimum avec démonstration des mécaniques principales"

### 3. Définir des livrables mesurables
- ❌ "Bonne promotion"
- ✅ "Lien du VOD + screenshots des posts + stats de viewers"

### 4. Prérequis techniques réalistes
Ne demandez pas de matériel que les streamers n'ont probablement pas.

### 5. Public cible précis
Aide le streamer à savoir si sa communauté correspond.

## Tests suggérés

- [ ] Création d'une bounty avec tous les champs remplis
- [ ] Validation des champs obligatoires
- [ ] Ajout/suppression de requirements
- [ ] Ajout/suppression de deliverables
- [ ] Ajout/suppression de technical requirements
- [ ] Sélection de différentes catégories
- [ ] Sélection d'une date limite
- [ ] Soumission du formulaire
- [ ] Vérification que la bounty apparaît dans le marketplace streamer
- [ ] Vérification que tous les champs sont visibles dans la page de détails

## Migration des bounties existantes

Les bounties créées avec l'ancien formulaire devront être migrées avec des valeurs par défaut:
- `longDescription`: Copie de `description`
- `category`: "Other"
- `targetAudience`: "Audience générale"
- `estimatedViewers`: "500-1000"
- `deadline`: `duration` days from now
- `deliverables`: ["Lien du stream", "Statistiques"]
- `technicalRequirements`: undefined (optionnel)
