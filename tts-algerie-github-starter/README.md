# Voix DZ, prototype GitHub

Prototype de la plateforme TTS algérienne décrit dans les documents de référence du 23 octobre 2026.

## État réel

- Interface responsive arabe (par défaut) et française : implémentée.
- Zone de texte, compteur, sélecteurs visuels : implémentés.
- API `/api/health` : implémentée.
- Schéma SQL initial avec RLS de lecture propriétaire : fourni, non appliqué ni testé sur Supabase.
- Auth, Gemini TTS, audio MP3, historique effectif, essai, crédits, paiement, administration : **non implémentés**.
- Le bouton de génération indique explicitement que le moteur n'est pas connecté. Aucune dépense API.

## Lancer en local

Installer Node.js 20 ou 22, puis :

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000.

## Publier sur GitHub

Créer un dépôt GitHub vide, puis depuis ce dossier :

```bash
git init
git add .
git commit -m "Initial TTS UI prototype"
git branch -M main
git remote add origin https://github.com/VOTRE_COMPTE/VOTRE_DEPOT.git
git push -u origin main
```

Importer ensuite le dépôt dans Vercel. Framework : Next.js. Ne pas renseigner de secrets dans le dépôt.

## Supabase

La migration SQL `supabase/migrations/0001_initial.sql` est un point de départ. Faire une revue et tester RLS avec utilisateurs A/B et admin avant toute mise en production. Les politiques de création/modification sont volontairement absentes.

## Décisions en attente

- Essai : 2 générations après email confirmé, ou essai invité avant inscription ?
- Modèle Gemini TTS exact, coût, qualité darija, limites.
- Règles de crédits, tarifs et expiration.
- Conservation, suppression, paiement manuel, rôles admin.

Ne pas activer une API payante avant d'avoir défini quotas serveur, idempotence, plafonds de dépense et contrôle d'accès.
