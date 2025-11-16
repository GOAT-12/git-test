// goat.js
// Ajoute des interactions en utilisant uniquement les éléments/classes déjà présents dans le HTML

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const STORAGE_SUBS = 'gt_subscribers';
  const STORAGE_THEME = 'gt_theme';
  const STORAGE_RESV = 'gt_reservations';
  // Modifiez ce lien pour votre vidéo YouTube
  const YT_URL = 'https://www.youtube.com/results?search_query=travel+story+inspiration';

  const smoothScrollTo = (target) => {
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 10;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const validateEmail = (email) => {
    // Regex simple et tolérante
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  };

  const setTheme = (mode) => {
    const body = document.body;
    if (mode === 'dark') body.classList.add('dark');
    else body.classList.remove('dark');
    localStorage.setItem(STORAGE_THEME, mode);
  };

  document.addEventListener('DOMContentLoaded', () => {
    // 0) Appliquer le thème sauvegardé et toggle via le logo
    const savedTheme = localStorage.getItem(STORAGE_THEME) || 'light';
    setTheme(savedTheme);
    const logo = $("header .logo");
    logo && logo.addEventListener('click', () => {
      const next = document.body.classList.contains('dark') ? 'light' : 'dark';
      setTheme(next);
    });

    // 1) Navigation: liens de header -> scroll vers sections existantes
    const navLinks = $$("header ul li a");
    const sections = [
      document.body,
      $(".destinations"),
      $(".best-trip"),
      $(".email-tipt"),
    ];
    navLinks.forEach((a, i) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollTo(sections[i] || document.body);
      });
    });

    // 2) Le bouton du header est désormais géré par auth.js (connexion/déconnexion)

    // 3) Bouton "Book now" de la hero -> scroll vers les meilleures destinations
    const heroBookBtn = $(".home-section .buttons .btn");
    heroBookBtn && heroBookBtn.addEventListener('click', () => {
      if (window.Auth && typeof window.Auth.ensureAuthForAction === 'function') {
        return window.Auth.ensureAuthForAction(() => smoothScrollTo($(".best-trip")));
      }
      smoothScrollTo($(".best-trip"));
    });

    // 4) Bouton "Watch our story" -> simple feedback (sans créer de modal)
    const seeVideoBtn = $(".see-video");
    seeVideoBtn && seeVideoBtn.addEventListener('click', () => {
      window.open(YT_URL, '_blank', 'noopener');
    });

    // 5) Carrousel des destinations (flèches gauche/droite)
    const gallery = $(".destinations .gallerie");
    const leftBtn = $(".destinations .desc-button .buttons button:not(.second)");
    const rightBtn = $(".destinations .desc-button .buttons .second");
    if (gallery && leftBtn && rightBtn) {
      const scrollAmount = () => Math.max(200, Math.floor(gallery.clientWidth * 0.9));
      leftBtn.addEventListener('click', () => {
        gallery.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
      });
      rightBtn.addEventListener('click', () => {
        gallery.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
      });

      // Autoplay défilement et pause au survol
      let autoTimer = setInterval(() => {
        gallery.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
      }, 3500);
      const pause = () => { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } };
      const resume = () => { if (!autoTimer) { autoTimer = setInterval(() => { gallery.scrollBy({ left: scrollAmount(), behavior: 'smooth' }); }, 3500); } };
      gallery.addEventListener('mouseenter', pause);
      gallery.addEventListener('mouseleave', resume);

      // Flèches clavier
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') gallery.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
        if (e.key === 'ArrowRight') gallery.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
      });
    }

    // 6) Boutons "Book Now" des cartes -> feedback + protection auth
    $$(".best-trip .box").forEach((box) => {
      const bookBtn = $(".button-description button", box);
      const title = $("h2", box)?.textContent?.trim() || 'Destination';
      const priceText = $(".button-description strong", box)?.textContent?.trim() || '';
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
      if (bookBtn) {
        bookBtn.addEventListener('click', () => {
          const action = () => {
            addReservation({ title, price });
            alert(`Réservation: ${title}. Nous vous recontactons par email.`);
            smoothScrollTo($(".email-tipt"));
            renderReservations();
          };
          if (window.Auth && typeof window.Auth.ensureAuthForAction === 'function') {
            return window.Auth.ensureAuthForAction(action);
          }
          action();
        });
      }
    });

    // 7) Envoi email: validation simple
    const emailInput = $(".email-tipt .input input");
    const emailBtn = $(".email-tipt .input .btn");
    // Pré-remplir avec l'email du user connecté si dispo
    try {
      const u = JSON.parse(localStorage.getItem('gt_user') || 'null');
      if (u && u.email && emailInput) emailInput.value = u.email;
    } catch {}
    const handleSend = () => {
      const value = emailInput?.value?.trim() || '';
      if (!validateEmail(value)) {
        alert('Veuillez entrer un email valide.');
        emailInput && emailInput.focus();
        return;
      }
      alert(`Merci ! Nous vous écrirons à: ${value}`);
      // Sauvegarder l'abonné
      try {
        const list = JSON.parse(localStorage.getItem(STORAGE_SUBS) || '[]');
        if (!list.includes(value)) {
          list.push(value);
          localStorage.setItem(STORAGE_SUBS, JSON.stringify(list));
        }
      } catch {}
      if (emailInput) emailInput.value = '';
    };

    emailBtn && emailBtn.addEventListener('click', handleSend);
    emailInput && emailInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });

    // 8) Support du hash pour naviguer directement aux sections
    const hash = (location.hash || '').toLowerCase();
    if (hash.includes('destination')) smoothScrollTo($(".destinations"));
    else if (hash.includes('pricing')) smoothScrollTo($(".best-trip"));
    else if (hash.includes('review')) smoothScrollTo($(".email-tipt"));

    // 9) Recherche & Réservations
    const resultsWrap = document.getElementById('search-results');
    const countryInput = document.getElementById('search-country');
    const priceInput = document.getElementById('search-price');
    const searchBtn = document.getElementById('search-btn');

    const getUser = () => {
      try { return JSON.parse(localStorage.getItem('gt_user') || 'null'); } catch { return null; }
    };
    const getUserEmail = () => getUser()?.email || null;
    const readReservations = () => {
      try { return JSON.parse(localStorage.getItem(STORAGE_RESV) || '[]'); } catch { return []; }
    };
    const writeReservations = (list) => localStorage.setItem(STORAGE_RESV, JSON.stringify(list));
    const addReservation = ({ title, price }) => {
      const email = getUserEmail();
      if (!email) return;
      const list = readReservations();
      list.push({ id: Date.now(), email, title, price, when: new Date().toISOString() });
      writeReservations(list);
    };
    const removeReservation = (id) => {
      const list = readReservations().filter(r => r.id !== id);
      writeReservations(list);
    };

    const tripsFromDom = () => {
      return $$(".best-trip .box").map((box) => {
        const t = $("h2", box)?.textContent?.trim() || '';
        const priceText2 = $(".button-description strong", box)?.textContent?.trim() || '';
        const p = parseFloat(priceText2.replace(/[^0-9.]/g, '')) || 0;
        const img = $("img", box)?.getAttribute('src') || '';
        return { title: t, price: p, img };
      });
    };

    const renderResults = (items) => {
      if (!resultsWrap) return;
      resultsWrap.innerHTML = '';
      items.forEach((it) => {
        const el = document.createElement('div');
        el.className = 'box';
        el.innerHTML = `
          <img src="${it.img}" alt="">
          <div class="description">
            <h2>${it.title}</h2>
            <p class="rating"><i class="fa-solid fa-star"></i> 4.7</p>
            <div class="button-description">
              <span>from <strong>$${it.price}</strong></span>
              <button>Book Now</button>
            </div>
          </div>
        `;
        const btn = $("button", el);
        btn.addEventListener('click', () => {
          const action = () => {
            addReservation({ title: it.title, price: it.price });
            alert(`Réservation: ${it.title}.`);
            renderReservations();
          };
          if (window.Auth && typeof window.Auth.ensureAuthForAction === 'function') {
            return window.Auth.ensureAuthForAction(action);
          }
          action();
        });
        resultsWrap.appendChild(el);
      });
    };

    const doSearch = () => {
      const q = (countryInput?.value || '').toLowerCase();
      const maxPrice = parseFloat(priceInput?.value || '');
      const list = tripsFromDom().filter((t) => {
        const okText = !q || t.title.toLowerCase().includes(q);
        const okPrice = isNaN(maxPrice) ? true : t.price <= maxPrice;
        return okText && okPrice;
      });
      renderResults(list);
    };
    searchBtn && searchBtn.addEventListener('click', doSearch);
    countryInput && countryInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } });
    priceInput && priceInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } });

    const reservationsWrap = document.getElementById('reservations-list');
    const renderReservations = () => {
      if (!reservationsWrap) return;
      const email = getUserEmail();
      const all = readReservations();
      const mine = email ? all.filter(r => r.email === email) : [];
      reservationsWrap.innerHTML = '';
      if (mine.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'small-desc';
        empty.textContent = email ? "Aucune réservation pour l'instant." : 'Connectez-vous pour voir vos réservations.';
        reservationsWrap.appendChild(empty);
        return;
      }
      mine.sort((a,b) => b.id - a.id).forEach((r) => {
        const row = document.createElement('div');
        row.className = 'reservation-item';
        row.innerHTML = `
          <div class="reservation-info">
            <strong>${r.title}</strong>
            <span>$${r.price}</span>
            <small>${new Date(r.when).toLocaleString()}</small>
          </div>
          <button class="btn btn-cancel">Annuler</button>
        `;
        $(".btn-cancel", row).addEventListener('click', () => {
          removeReservation(r.id);
          renderReservations();
        });
        reservationsWrap.appendChild(row);
      });
    };

    // Rendre la liste au chargement et quand l'utilisateur se connecte/déconnecte (timer simple)
    renderReservations();
    setInterval(renderReservations, 3000);
  });
})();
