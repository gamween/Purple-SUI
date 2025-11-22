# Système de détails de Bounty pour Streamers

## Vue d'ensemble

Cette fonctionnalité force les streamers à lire les détails complets d'une bounty avant de pouvoir montrer leur intérêt. Cela améliore la qualité des candidatures et réduit les malentendus.

## Flux utilisateur

### 1. Découverte (Dashboard)
- **Page**: `/streamer/dashboard`
- **Action**: Les bounties en vedette affichent un bouton "Voir les détails"
- **Comportement**: Cliquer navigue vers `/streamer/bounty/:id`

### 2. Découverte (Marketplace)
- **Page**: `/streamer/bounties` (onglet Marketplace)
- **Action**: Les cartes de bounty dans le marketplace affichent "Voir les détails" au lieu de "Montrer mon intérêt"
- **Comportement**: Cliquer navigue vers `/streamer/bounty/:id`

### 3. Page de détails
- **Route**: `/streamer/bounty/:id`
- **Composant**: `StreamerBountyDetail`
- **Contenu affiché**:
  - ✅ Description longue et détaillée
  - ✅ Liste complète des exigences (requirements)
  - ✅ Livrables attendus (deliverables)
  - ✅ Prérequis techniques
  - ✅ Public cible
  - ✅ Timeline et deadline
  - ✅ Statistiques (montant, split, viewers estimés)
  - ✅ Informations sur le développeur

### 4. Expression d'intérêt
- **Position**: Bouton en bas de la page de détails
- **Texte**: "Montrer mon intérêt"
- **Comportement**: 
  - Navigation vers `/streamer/messages?bountyId=X&dev=Y`
  - Ajout d'une notification
  - Toast de confirmation

## Architecture technique

### Fichiers modifiés

#### 1. `/pages/streamer/bounty-detail.tsx` (NOUVEAU)
```typescript
// Affiche tous les détails d'une bounty
// - Utilise useParams pour récupérer l'ID
// - Mock data avec structure complète
// - Sections: Header, Description, Requirements, Deliverables, Technical, Timeline
// - Action button conditionnel selon le statut
```

**Sections principales**:
- **Header Card**: Badge status, titre, dev info, KPIs (montant, split, viewers)
- **Description Card**: Texte long + public cible
- **Requirements Card**: Liste numérotée avec icônes
- **Deliverables Card**: Liste avec checkboxes
- **Technical Requirements Card**: Prérequis matériel/software
- **Timeline Card**: Date limite et temps restant
- **Action Card**: Bouton CTA avec gradient

#### 2. `/pages/streamer/dashboard.tsx`
**Modification**: Ajout du hook `useNavigate` et onClick sur le bouton "Voir les détails"
```typescript
<Button onClick={() => navigate(`/streamer/bounty/${bounty.id}`)}>
  Voir les détails
</Button>
```

#### 3. `/components/bounties/BountyCard.tsx`
**Modification**: Ajout du prop `context` pour adapter le comportement

```typescript
interface BountyCardProps {
  context?: "marketplace" | "active" | "completed" | "default";
}

// Dans le render:
onClick={context === "marketplace" 
  ? () => navigate(`/streamer/bounty/${bounty.id}`) 
  : handleShowInterest
}
{context === "marketplace" ? "Voir les détails" : "Montrer mon intérêt"}
```

#### 4. `/pages/streamer/bounties.tsx`
**Modification**: Passage du context aux BountyCards
```typescript
<BountyCard 
  bounty={bounty} 
  userRole="streamer"
  context={activeTab} // "marketplace", "active", ou "completed"
/>
```

#### 5. `/App.tsx`
**Ajout**: Route pour la page de détails
```typescript
import StreamerBountyDetail from "./pages/streamer/bounty-detail";
<Route path="/streamer/bounty/:id" element={<StreamerBountyDetail />} />
```

## Structure de données

### Bounty avec détails complets

```typescript
{
  id: string;
  title: string;
  description: string;  // Court (pour les cards)
  longDescription: string;  // Détaillé (pour la page)
  amount: number;
  split: number;
  duration: string;
  status: "available" | "active" | "completed";
  dev: string;
  devAvatar: string;
  category: string;
  
  // Nouveaux champs pour les détails
  requirements: string[];  // Liste d'exigences détaillées
  deliverables: string[];  // Livrables attendus
  targetAudience: string;  // Description du public cible
  estimatedViewers: string;  // Range attendue
  deadline: string;  // Date ISO
  technicalRequirements?: string[];  // Prérequis techniques
  
  // Pour les bounties actives
  donations?: number;
  myShare?: number;
}
```

## Bénéfices UX

1. **Transparence**: Les streamers voient TOUTES les informations avant de s'engager
2. **Qualité**: Réduit les candidatures inappropriées ou mal informées
3. **Professionnalisme**: Démontre le sérieux du projet
4. **Réduction des conflits**: Moins de malentendus sur les attentes
5. **Meilleure préparation**: Les streamers peuvent évaluer s'ils ont le matériel/compétences nécessaires

## Comportement par contexte

| Contexte | Bounty Status | Bouton affiché | Action |
|----------|---------------|----------------|--------|
| Dashboard featured | available | "Voir les détails" | → `/streamer/bounty/:id` |
| Marketplace | available | "Voir les détails" | → `/streamer/bounty/:id` |
| Active bounties | active | "Voir stats" | → `/streamer/stats?bountyId=X` |
| Completed | completed | Aucun | - |
| Detail page | available | "Montrer mon intérêt" | → `/streamer/messages` + notif |
| Detail page | active | "Voir les stats" | → `/streamer/stats` |

## Points d'attention

### Cohérence des données
- Les IDs dans `bounty-detail.tsx` doivent correspondre aux IDs des bounties dans `bounties.tsx` et `dashboard.tsx`
- Actuellement: m1, m2, m3 (marketplace), a1 (active)

### Gestion du 404
- Si l'ID n'existe pas, affiche un message d'erreur avec lien de retour
- Icône AlertCircle + message explicite

### État accepté
- Variable `accepted` pour éviter double-clic
- Disparition du bouton après clic (remplacé par navigation)

## Améliorations futures

1. **API Integration**: Remplacer les mock data par de vraies requêtes API
2. **Chargement**: Ajouter un skeleton loader pendant le fetch
3. **Cache**: Implémenter React Query pour le cache et l'optimistic UI
4. **Images**: Ajouter des screenshots/vidéos du projet
5. **Commentaires**: Permettre aux streamers de poser des questions sur la page de détails
6. **Favoris**: Bouton pour sauvegarder une bounty pour plus tard
7. **Partage**: Bouton pour partager la bounty avec d'autres streamers
8. **Historique**: Tracking des bounties consultées

## Testing

### Scénarios de test
- [ ] Navigation depuis dashboard → detail page
- [ ] Navigation depuis marketplace → detail page
- [ ] Affichage correct de toutes les sections
- [ ] Bouton "Montrer mon intérêt" fonctionne
- [ ] Notification créée correctement
- [ ] Navigation vers messages après clic
- [ ] Gestion du 404 pour ID invalide
- [ ] Bouton "Voir stats" pour bounties actives
- [ ] Responsive sur mobile/tablet

## Métriques suggérées

Pour mesurer l'efficacité de cette feature:
- Taux de conversion (vues détails → intérêt exprimé)
- Temps moyen passé sur la page de détails
- Taux d'abandon (retour sans exprimer d'intérêt)
- Taux de completion des bounties acceptées (amélioration attendue)
- Nombre de questions/clarifications demandées (réduction attendue)
