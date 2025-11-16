# Documentation API - GOAT Travel

## Authentification (auth.js)

### Fonctions disponibles

#### `login(email, password)`
- **Description**: Connecte un utilisateur existant
- **Retour**: `true` si succès
- **Erreur**: Exception avec message descriptif

#### `signup(name, email, password, avatarDataUrl, extra)`
- **Description**: Crée un nouveau compte utilisateur
- **Paramètres**:
  - `name`: Nom (min 2 caractères)
  - `email`: Email valide requis
  - `password`: Min 6 caractères
  - `avatarDataUrl`: Optionnel (base64)
  - `extra`: Objet avec surname, birthdate, location, gallery
- **Retour**: `true` si succès

#### `logout()`
- **Description**: Déconnecte l'utilisateur courant

#### `isLoggedIn()`
- **Description**: Vérifie si un utilisateur est connecté
- **Retour**: `boolean`

## Stockage local

### Clés utilisées
- `gt_user`: Données utilisateur (JSON)
- `gt_theme`: Thème ('light'/'dark')
- `gt_subscribers`: Liste emails newsletter
- `gt_reservations`: Réservations utilisateur

### Structure utilisateur
```javascript
{
  name: "Jean Dupont",
  email: "jean@example.com", 
  password: "motdepasse",
  avatar: "data:image/jpeg;base64,...",
  surname: "Dupont",
  age: 25,
  birthdate: "1999-01-01",
  location: "Paris, France",
  gallery: [],
  lastLoginAt: 1640995200000
}
```

## Interactions principales (goat.js)

### Navigation
- Scroll smooth vers sections
- Gestion hash URL
- Navigation clavier (flèches)

### Carrousel destinations
- Auto-scroll toutes les 3.5s
- Pause au survol
- Navigation manuelle

### Réservations
- Ajout/suppression
- Filtrage par utilisateur
- Recherche par pays/prix

### Thème
- Toggle via logo
- Persistance localStorage
- Support complet mode sombre
