// auth.js
// Authentification côté client (localStorage). Réutilise le design existant.
(function () {
  const STORAGE_KEY = 'gt_user';

  const readUser = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
  };
  const writeUser = (user) => localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  const clearUser = () => localStorage.removeItem(STORAGE_KEY);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  const isLoggedIn = () => !!readUser();

  const login = (email, password) => {
    const user = readUser();
    if (!user) throw new Error('Aucun compte trouvé. Veuillez vous inscrire.');
    if (user.email !== email) throw new Error('Email non reconnu.');
    if (user.password !== password) throw new Error('Mot de passe incorrect.');
    // déjà stocké; on peut y ajouter un timestamp
    writeUser({ ...user, lastLoginAt: Date.now() });
    return true;
  };

  const calcAge = (birthdateStr) => {
    if (!birthdateStr) return null;
    const d = new Date(birthdateStr);
    if (isNaN(d)) return null;
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age >= 0 && age <= 120 ? age : null;
  };

  const signup = (name, email, password, avatarDataUrl, extra = {}) => {
    if (!name || name.trim().length < 2) throw new Error('Nom invalide.');
    if (!isValidEmail(email)) throw new Error('Email invalide.');
    if (!password || password.length < 6) throw new Error('Mot de passe trop court (min 6).');
    const user = {
      name: name.trim(),
      email: email.trim(),
      password,
      avatar: avatarDataUrl || null,
      surname: (extra.surname || '').toString().trim() || null,
      age: extra.birthdate ? calcAge(extra.birthdate) : (extra.age ? Number(extra.age) : null),
      birthdate: extra.birthdate || null,
      location: (extra.location || '').toString().trim() || null,
      gallery: Array.isArray(extra.gallery) ? extra.gallery : [],
    };
    writeUser(user);
    return true;
  };

  const logout = () => { clearUser(); };

  const applyHeaderBehavior = () => {
    const btn = document.querySelector('header .btn-header .btn');
    const btnWrap = document.querySelector('header .btn-header');
    if (!btn) return;
    const span = btn.querySelector('span');
    const user = readUser();
    // Gérer avatar
    let avatarEl = document.getElementById('auth-avatar');
    if (!avatarEl && btnWrap) {
      avatarEl = document.createElement('img');
      avatarEl.id = 'auth-avatar';
      avatarEl.alt = 'avatar';
      avatarEl.className = 'avatar';
      btnWrap.insertBefore(avatarEl, btnWrap.firstChild);
    }
    // Lien Profil
    let profileLink = document.getElementById('profile-link');
    if (!profileLink && btnWrap) {
      profileLink = document.createElement('a');
      profileLink.id = 'profile-link';
      profileLink.href = 'profile.html';
      profileLink.className = 'btn';
      profileLink.style.textDecoration = 'none';
      profileLink.textContent = 'Profil';
      btnWrap.insertBefore(profileLink, btn); // avant le bouton de connexion
    }

    // Lien Settings
    let settingsLink = document.getElementById('settings-link');
    if (!settingsLink && btnWrap) {
      settingsLink = document.createElement('a');
      settingsLink.id = 'settings-link';
      settingsLink.href = 'settings.html';
      settingsLink.className = 'btn';
      settingsLink.style.textDecoration = 'none';
      settingsLink.textContent = 'Settings';
      btnWrap.insertBefore(settingsLink, profileLink || btn);
    }

    if (user) {
      span && (span.textContent = 'Se déconnecter');
      if (avatarEl) {
        if (user.avatar) { avatarEl.src = user.avatar; avatarEl.style.display = 'inline-block'; }
        else { avatarEl.style.display = 'none'; }
      }
      if (profileLink) profileLink.style.display = 'inline-flex';
      if (settingsLink) settingsLink.style.display = 'inline-flex';
      btn.onclick = (e) => {
        e.preventDefault();
        logout();
        span.textContent = 'Se connecter';
        if (avatarEl) avatarEl.style.display = 'none';
        if (profileLink) profileLink.style.display = 'none';
        if (settingsLink) settingsLink.style.display = 'none';
        // Optionnel: rediriger vers l’accueil
        if (location.pathname.endsWith('login.html') || location.pathname.endsWith('signup.html')) {
          location.href = 'goat.html';
        }
      };
    } else {
      span && (span.textContent = 'Se connecter');
      if (avatarEl) avatarEl.style.display = 'none';
      if (profileLink) profileLink.style.display = 'none';
      if (settingsLink) settingsLink.style.display = 'none';
      btn.onclick = (e) => {
        e.preventDefault();
        const redirectTo = encodeURIComponent(location.pathname.split('/').pop() || 'goat.html');
        location.href = `login.html?redirect=${redirectTo}`;
      };
    }
  };

  const ensureAuthForAction = (onAuthOk) => {
    if (isLoggedIn()) return onAuthOk();
    const current = encodeURIComponent(location.pathname.split('/').pop() || 'goat.html');
    location.href = `login.html?redirect=${current}`;
  };

  const getQuery = () => new URLSearchParams(location.search);

  // Gestion des formulaires de login/signup si présents
  document.addEventListener('DOMContentLoaded', () => {
    // Gate: si on est sur la page principale et non connecté, rediriger vers login
    const page = (location.pathname.split('/').pop() || '').toLowerCase();
    if ((page === '' || page === 'goat.html') && !isLoggedIn()) {
      const redirectTo = encodeURIComponent('goat.html');
      location.href = `login.html?redirect=${redirectTo}`;
      return; // éviter d'exécuter la suite
    }
    applyHeaderBehavior();

    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[name="email"]').value.trim();
        const password = loginForm.querySelector('input[name="password"]').value;
        try {
          login(email, password);
          const redirect = getQuery().get('redirect') || 'goat.html';
          location.href = redirect;
        } catch (err) {
          alert(err.message || 'Erreur de connexion');
        }
      });
    }

    const signupForm = document.querySelector('#signup-form');
    if (signupForm) {
      // Live age display from birthdate
      const ageEl = document.getElementById('signup-age');
      const birthInput = signupForm.querySelector('input[name="birthdate"]');
      const updateAge = () => { if (!ageEl) return; const a = calcAge(birthInput.value); ageEl.textContent = `Âge: ${a ?? '—'}`; };
      birthInput.addEventListener('input', updateAge);
      birthInput.addEventListener('change', updateAge);
      updateAge();

      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = signupForm.querySelector('input[name="name"]').value.trim();
        const surname = signupForm.querySelector('input[name="surname"]').value.trim();
        const birthdate = signupForm.querySelector('input[name="birthdate"]').value;
        const locationStr = signupForm.querySelector('input[name="location"]').value.trim();
        const email = signupForm.querySelector('input[name="email"]').value.trim();
        const password = signupForm.querySelector('input[name="password"]').value;
        try {
          // pas d'avatar/galerie à l'inscription; age calculé depuis birthdate
          signup(name, email, password, null, { surname, birthdate, location: locationStr });
          alert('Compte créé ! Vous pouvez vous connecter.');
          location.href = 'login.html';
        } catch (err) {
          alert(err.message || "Erreur d'inscription");
        }
      });
    }
  });

  // Expose une API minimale
  window.Auth = { isLoggedIn, ensureAuthForAction };
})();
