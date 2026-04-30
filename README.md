# MarkFlow - Éditeur Markdown Collaboratif

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge" alt="Prisma">
  <img src="https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
</p>

MarkFlow est un éditeur Markdown moderne et collaboratif avec prévisualisation en temps réel, export multi-format, et support hors ligne.

## ✨ Fonctionnalités

- **Édition en Temps Réel** - Prévisualisation instantanée avec coloration syntaxique
- **Collaboration** - Travail d'équipe avec synchronisation en temps réel (Supabase)
- **Export Multi-Format** - PDF, HTML, DOCX, Markdown
- **Thèmes** - Mode sombre/clair avec animations fluides (Framer Motion)
- **Multilingue** - Français, Anglais, Espagnol
- **PWA & Offline** - Fonctionne hors ligne sur tous vos appareils
- **Authentification** - Système de compte utilisateur (NextAuth.js)
- **Stockage Local** - IndexedDB pour travail hors ligne + sync cloud

## 🛠️ Stack Technique

| Catégorie | Technologies |
|-----------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, NextAuth.js |
| **Base de données** | PostgreSQL, Prisma ORM |
| **UI Components** | Radix UI, shadcn/ui, Framer Motion |
| **Internationalisation** | react-i18next, next-intl |
| **Markdown** | react-markdown, remark-gfm, react-syntax-highlighter |
| **Temps réel** | Supabase Realtime |
| **Export** | jsPDF, docx, html2canvas |

## 🚀 Installation Rapide

### Prérequis

- Node.js 18+
- PostgreSQL (local ou Docker)
- npm ou yarn

### Étapes

1. **Cloner le projet**
   ```bash
   git clone <repo-url>
   cd MarkcodeEditor
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp env.example .env
   # Éditer .env avec vos valeurs
   ```

4. **Démarrer la base de données**
   ```bash
   # Option A: Docker (recommandé)
   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=markflow --name markflow-postgres postgres

   # Option B: PostgreSQL local déjà installé
   # Créer une base de données "markflow"
   ```

5. **Setup de la base de données**
   ```bash
   npm run db:setup
   # ou
   npm run db:generate
   npm run db:push
   ```

6. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

L'application sera disponible sur `http://localhost:3000`

## 📡 Scripts Disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarrage rapide du serveur de dev |
| `npm run dev:complete` | Setup complet (DB + Docker + Next.js) |
| `npm run dev:turbo` | Next.js avec Turbopack |
| `npm run build` | Construction de l'application |
| `npm run start` | Mode production |
| `npm run lint` | Vérification du code |
| `npm run typecheck` | Vérification TypeScript |
| `npm run db:setup` | Setup complet de la base de données |
| `npm run db:push` | Pousser le schéma Prisma |
| `npm run db:generate` | Générer le client Prisma |
| `npm run db:studio` | Ouvrir Prisma Studio |
| `npm run db:reset` | Réinitialiser la DB (⚠️ supprime les données) |
| `npm run test` | Lancer les tests |
| `npm run test:watch` | Tests en mode watch |
| `npm run test:coverage` | Couverture de tests |

## 🔧 Configuration

### Variables d'Environnement (.env)

```env
# Application
NEXT_PUBLIC_URL=http://localhost:3000

# Base de données PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/markflow?schema=public"

# Authentification NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-super-securise

# Supabase (optionnel - pour collaboration temps réel)
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe (optionnel - pour paiements)
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_SECRET_KEY=sk_test_...
```

## 📁 Structure du Projet

```
MarkcodeEditor/
├── prisma/
│   └── schema.prisma          # Schéma de base de données
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # Routes API
│   │   │   ├── auth/          # Authentification (NextAuth, Register)
│   │   │   ├── documents/    # CRUD Documents
│   │   │   ├── export/       # Export PDF/HTML/DOCX
│   │   │   └── share/        # Partage de documents
│   │   ├── login/             # Page de connexion
│   │   ├── register/          # Page d'inscription
│   │   ├── settings/          # Paramètres utilisateur
│   │   ├── documents/        # Liste et éditeur de documents
│   │   └── offline/          # Page hors ligne
│   ├── components/           # Composants React
│   │   ├── editor/            # Éditeur, Preview, Toolbar
│   │   ├── ui/               # Composants UI (shadcn)
│   │   ├── layout/           # Header, Footer
│   │   └── providers/        # Providers (Theme, i18n)
│   ├── lib/                  # Bibliothèques et utilitaires
│   │   ├── prisma.ts         # Client Prisma
│   │   ├── auth.ts           # Configuration NextAuth
│   │   ├── storage.ts        # Storage IndexedDB
│   │   ├── export.ts         # Fonctions d'export
│   │   └── useCollaboration.ts # Hook collaboration
│   └── types/                # Types TypeScript
├── messages/                 # Fichiers de traduction
│   ├── fr.json              # Français
│   ├── en.json              # Anglais
│   └── es.json              # Espagnol
├── scripts/                  # Scripts de setup
│   ├── start-dev.js         # Démarrage rapide
│   ├── start-dev-complete.js # Setup complet
│   └── setup-db.js          # Setup database
├── public/                   # Fichiers publics
│   ├── sw.js                # Service Worker PWA
│   └── manifest.json        # Manifest PWA
├── tests/                    # Tests
└── package.json             # Dépendances et scripts
```

## 🗄️ Schéma de Base de Données

### Modèles Prisma

- **User** - Utilisateurs (id, email, password, name, avatar)
- **Session** - Sessions authentification
- **Document** - Documents Markdown (id, title, content, isPublic, shareToken)
- **Collaborator** - Collaborateurs (role: OWNER/EDITOR/VIEWER)
- **DocumentVersion** - Historique des versions

## 🔐 Authentification

Le système utilise NextAuth.js avec:
- Provider Credentials (email/password)
- Hachage bcryptjs
- Sessions JWT
- Protecttion des routes API

## 🌐 Internationalisation

Support de 3 langues :
- 🇫🇷 Français (fr)
- 🇬🇧 Anglais (en)
- 🇪🇸 Espagnol (es)

Les traductions sont dans `messages/*.json`

## 📱 PWA

L'application fonctionne hors ligne :
- Service Worker (`public/sw.js`)
- Manifest PWA (`public/manifest.json`)
- IndexedDB pour le stockage local

## 🧪 Tests

```bash
# Lancer tous les tests
npm run test

# Tests avec coverage
npm run test:coverage

# Mode watch
npm run test:watch

# Tests unitaires uniquement
npm run test:unit
```

## 🚀 Déploiement

### Docker

```bash
# Development
docker-compose up

# Production
docker build -t markflow .
docker run -p 3000:3000 markflow
```

### Plateformes cloud

- **Vercel** (recommandé)
- **Railway**
- **Render**
- **Fly.io**

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 License

MIT License - voir le fichier LICENSE

## 🙏 Remerciements

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Radix UI](https://radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://framer.com/motion)