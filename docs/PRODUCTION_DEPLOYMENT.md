# BagVoyage — Guide de Déploiement en Production

> **Version**: 1.0.0 Production-Ready  
> **Architecture**: PWA Offline-First (React 18 + Vite + IndexedDB v2 + Nginx 1.27 Alpine)  
> **Délai d'exécution**: Déploiement opérationnel en moins de 15 minutes.

---

## 1. Vue d'Ensemble de l'Architecture

BagVoyage est conçu selon une architecture **Offline-First Zero-Data-Loss** inspirée des standards Apple HIG et Linear.app :

1. **Client & Cache Local** :
   - Stockage local persistant dans **IndexedDB v2** (`BagVoyageDB_v2`) avec 9 magasins (`users`, `profiles`, `listings`, `bookings`, `messages`, `kycDocuments`, `arbitrageOpportunities`, `handoverProofs`, `auditLogs`).
   - File d'attente asynchrone des mutations sortantes (`outboxQueue.ts`) qui enregistre les actions hors-ligne (en vol ou zone blanche) et les rejoue lors de la reconnexion réseau.
   - **Service Worker PWA** (`public/sw.js`) assurant la mise en cache agressive des ressources immuables (`/assets/`) et la continuité de navigation hors-ligne.
   - **Error Boundary React** (`src/components/common/ErrorBoundary.tsx`) protégeant contre tout écran blanc inattendu en production.

2. **Mode Hybride Déconnecté / Cloud** :
   - Fonctionne à 100% en mode autonome local sans dépendance externe bloquante.
   - Dès que la variable `VITE_API_URL` est renseignée, le moteur `apiSync.ts` synchronise automatiquement les mutations locales avec le backend distant.

---

## 2. Déploiement avec Docker (Recommandé)

### 2.1 Construction de l'Image Multi-Stage

Le fichier `Dockerfile` utilise un build multi-stage :
- **Étape 1 (builder)** : `node:22-alpine` compile le code TypeScript et génère les routes statiques SSG.
- **Étape 2 (runner)** : `nginx:1.27-alpine` sert les bundles optimisés avec compression Gzip, en-têtes de sécurité et fallback SPA.

```bash
# 1. Cloner le dépôt
git clone https://github.com/pithop/Co-colisage.git
cd Co-colisage

# 2. Construire l'image Docker
docker build -t bagvoyage:latest .

# 3. Lancer le conteneur sur le port 80 (ou mapper sur le port de votre choix)
docker run -d \
  --name bagvoyage-app \
  -p 80:80 \
  --restart unless-stopped \
  bagvoyage:latest
```

### 2.2 Déploiement avec Docker Compose

Créez un fichier `docker-compose.yml` :

```yaml
version: '3.8'

services:
  bagvoyage:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: bagvoyage_web
    restart: unless-stopped
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

Lancement en arrière-plan :
```bash
docker compose up -d --build
```

---

## 3. Déploiement sur PaaS (Vercel & Netlify)

### 3.1 Déploiement sur Vercel

1. Importez le dépôt GitHub `pithop/Co-colisage` sur le tableau de bord Vercel.
2. Vercel détecte automatiquement la configuration grâce à `vercel.json` :
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
3. Renseignez les variables d'environnement dans **Settings > Environment Variables** :
   - `VITE_APP_URL` : `https://votredomaine.com`
   - `VITE_GOOGLE_CLIENT_ID` : `votre-client-id.apps.googleusercontent.com`
   - `VITE_STRIPE_PUBLISHABLE_KEY` : `pk_live_...`
4. Cliquez sur **Deploy**.

### 3.2 Déploiement sur Netlify

1. Liez votre dépôt GitHub à Netlify.
2. Le fichier `netlify.toml` configure nativement la compilation et les règles de réécriture SPA (`/* -> /index.html 200`).
3. Ajoutez vos variables d'environnement dans **Site settings > Environment variables**.
4. Déployez.

---

## 4. Déploiement sur Serveur Dédié / VPS (Ubuntu + Nginx + SSL)

### 4.1 Prérequis Système
- Serveur Ubuntu 22.04 LTS ou 24.04 LTS
- Node.js >= 20.x et npm
- Nginx & Certbot (Let's Encrypt)

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx certbot python3-certbot-nginx git curl

# Installation de Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

### 4.2 Compilation du Projet

```bash
cd /var/www
sudo git clone https://github.com/pithop/Co-colisage.git bagvoyage
cd bagvoyage
sudo npm install
sudo npm run build
```

### 4.3 Configuration Nginx & SSL

Créez `/etc/nginx/sites-available/bagvoyage` :

```nginx
server {
    server_name bagvoyage.com www.bagvoyage.com;

    root /var/www/bagvoyage/dist;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/javascript application/javascript application/json image/svg+xml font/woff2;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(self), geolocation=(self), microphone=()" always;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
    }

    location ~* ^/(index\.html|sw\.js|manifest\.webmanifest)$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate" always;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Activez le site et générez le certificat SSL :

```bash
sudo ln -s /etc/nginx/sites-available/bagvoyage /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Génération SSL Certbot HTTPS automatique
sudo certbot --nginx -d bagvoyage.com -d www.bagvoyage.com
```

---

## 5. Configuration des Tiers (Google OAuth & Stripe)

### 5.1 Google Sign-In (OAuth 2.0)
1. Rendez-vous sur la [Console Google Cloud](https://console.cloud.google.com/).
2. Créez un projet ou sélectionnez le projet BagVoyage existant.
3. Allez dans **API et services > Identifiants**.
4. Créez des identifiants **ID client OAuth 2.0** de type *Application Web*.
5. Ajoutez votre domaine dans **Origines JavaScript autorisées** :
   - `https://bagvoyage.com`
   - `https://www.bagvoyage.com`
6. Copiez le Client ID dans votre variable d'environnement `VITE_GOOGLE_CLIENT_ID`.

### 5.2 Stripe Connect (Séquestre FinTech & Rémunérations)
1. Connectez-vous au [Dashboard Stripe](https://dashboard.stripe.com/).
2. Activez **Stripe Connect** en mode Standard ou Express pour les paiements de marketplace.
3. Copiez la clé publique `pk_live_...` dans `VITE_STRIPE_PUBLISHABLE_KEY`.
4. Configurez l'URL des Webhooks pointant vers votre service de validation d'escrow pour les événements `payment_intent.succeeded` et `account.updated`.

---

## 6. Checklist de Validation Pré-Production (Pre-Flight)

Avant d'ouvrir le trafic aux utilisateurs finaux :

- [x] **Intégrité TypeScript** : `npx tsc --noEmit` exécuté avec 0 erreur.
- [x] **Tests E2E Automatisés** : `npx playwright test` (20/20 tests passants).
- [x] **Compilation SSG & Bundles** : `npm run build` exécuté avec succès (10 routes pré-rendues).
- [x] **Service Worker PWA** : `public/sw.js` actif et vérifié en mode hors-ligne.
- [x] **Manifeste PWA** : `public/manifest.webmanifest` avec `start_url: "/"` et icônes valides.
- [x] **Error Boundary** : Protection active contre les plantages de composants d'interface.
- [x] **Studio Base de Données** : Accessible dans le Dashboard Admin (`#admin`), export SQL et JSON validés.
- [x] **Sécurité HTTP** : En-têtes `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` activés.
- [x] **Règles de Design** : Zéro emoji Unicode (100% icônes SVG Lucide), zéro balise `<select>` brute, design responsive Apple HIG.
