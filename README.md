# Aris Travel - Plateforme de Réservation de Voyages

## 📝 Description

Plateforme complète de réservation de voyages avec recherche par destination et prix, gestion des réservations et newsletter.

## 🎯 Fonctionnalités

- 🌍 Exploration de destinations
- 🔍 Recherche avancée (pays, ville, prix)
- 📅 Gestion des réservations
- 📧 Newsletter
- ⭐ Évaluations des destinations

## 📁 Structure du projet

```
.
├── goat.html           # Page principale
├── goat.css            # Styles
├── goat.js             # Scripts principaux
├── auth.js             # Authentification
├── netlify.toml        # Configuration Netlify
├── package.json        # Dépendances
├── README.md           # Ce fichier
├── .gitignore          # Fichiers à ignorer
└── images/             # Dossier images (optionnel)
    ├── arc-de-triomphe-5432392_1280.jpg
    ├── pyramids-2159286_1280.jpg
    ├── nyc-5276112_1280.jpg
    └── ... (toutes les autres images)
```

## ✅ Checklist avant déploiement

- [x] HTML valide et optimisé
- [x] CSS compilé et minifié
- [x] JavaScript fonctionnel
- [x] Fichier netlify.toml configuré
- [x] Package.json présent
- [ ] **Vérifier que tous les fichiers image sont présents**
- [ ] Tester localement (ouvrir goat.html dans le navigateur)
- [ ] Pas de lien rompu
- [ ] Connexion HTTPS vérifiée après déploiement

## 🚀 Guide de déploiement

### Option 1 : Via GitHub (Recommandé)

1. **Initialisez Git**

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Aris Travel"
   ```

2. **Créez un repository sur GitHub**

   - Allez sur [github.com](https://github.com)
   - Créez un nouveau repository

3. **Poussez votre code**

   ```bash
   git remote add origin https://github.com/yourusername/aris-travel.git
   git branch -M main
   git push -u origin main
   ```

4. **Déployez sur Netlify**
   - Allez sur [app.netlify.com](https://app.netlify.com)
   - Connectez GitHub
   - Sélectionnez votre repository
   - Netlify détectera automatiquement la configuration
   - Cliquez sur "Deploy site"

### Option 2 : Drag & Drop

1. Compressez votre dossier (ZIP)
2. Allez sur [app.netlify.com](https://app.netlify.com)
3. Déposez votre fichier ZIP
4. Votre site est en ligne ! 🎉

## 📋 Fichiers requis

**Assurez-vous que tous ces fichiers sont présents :**

### HTML & CSS

- ✅ `goat.html`
- [ ] `goat.css`

### JavaScript

- [ ] `goat.js`
- [ ] `auth.js`

### Images

- [ ] `tavern-7411977_1280.jpg`
- [ ] `arches-national-park-1846759_1280.jpg`
- [ ] `arc-de-triomphe-5432392_1280.jpg`
- [ ] `pyramids-2159286_1280.jpg`
- [ ] `nyc-5276112_1280.jpg`
- [ ] `giraffes-8047856_1280.jpg`
- [ ] `ocean-6517233_1280.jpg`
- [ ] `architecture-7139263_1280.jpg`
- [ ] `bird-242715_1280.jpg`

## 🔧 Configuration Netlify

Le fichier `netlify.toml` contient :

- Redirects automatiques
- Headers de sécurité
- Cache management
- SPA routing

## 📞 Support

Pour toute question sur le déploiement, consultez la [documentation Netlify](https://docs.netlify.com/)

---

**Prêt à déployer ? 🚀**
