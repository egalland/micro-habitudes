# Micro · Habitudes

Application réalisée pour Inktober 2026, jour 3 : **Miniature**.

Un journal de petites actions, avec une grille annuelle par habitude.

## Fonctionnalités

- Création et personnalisation des habitudes : nom, date de début, icône ou émoji, couleur.
- Saisie quotidienne d’un nombre d’actions et d’une note.
- Grilles annuelles avec intensité des couleurs selon l’activité.
- Séries actuelles et records de jours consécutifs.
- Export des cartes annuelles en image.
- Sauvegarde et restauration JSON.
- Sauvegarde privée en ligne, associée à la connexion ChatGPT sur Sites.

## Version d’origine

https://micro-habitudes.emmanuel-galland117.chatgpt.site

Ce dépôt conserve les sources de la version 1 publiée le 3 octobre 2026. Il ne contient ni données personnelles du journal ni secrets.

## Architecture

React et TypeScript, Vinext/Vite, Tailwind CSS et Cloudflare D1.

- `app/tracker.tsx` : interface et suivi des habitudes.
- `lib/habits.ts` : validation, calendrier et calcul des statistiques.
- `lib/export.ts` : exports visuels.
- `app/api/journal/route.ts` : lecture et sauvegarde du journal.
- `drizzle/` : migrations de la base de données.

## Installation

Node.js 22.13 ou plus récent et pnpm (version indiquée dans `package.json`).

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Pour compiler :

```sh
pnpm build
```

## Hébergement et sauvegarde

L’application actuelle utilise un serveur et Cloudflare D1. La connexion ChatGPT et les en-têtes d’identité sont fournis par Sites. Ces mécanismes ne fonctionnent pas seuls sur un serveur tiers.

**Les sources actuelles ne peuvent pas être publiées telles quelles sur GitHub Pages.** Une adaptation de la sauvegarde et de l’authentification est nécessaire pour une version statique, ou un hébergement serveur doit être configuré.

L’identifiant présent dans `.openai/hosting.json` désigne le Site existant ; ce fichier n’est pas un secret. Le copier dans un nouveau projet ne crée pas une nouvelle base et ne transfère pas les données du journal.

L’export/import JSON permet de sauvegarder manuellement les habitudes depuis l’application actuelle.
