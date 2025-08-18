document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.voir-plus').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const grid = document.getElementById(targetId);

      // 1) Ajoute/retire la classe .show-all sur la grille
      grid.classList.toggle('show-all');

      // 2) Met à jour du bouton
      button.textContent = grid.classList.contains('show-all')
        ? 'Voir moins'
        : 'Voir plus';
    });
  });
});

async function chargerMeilleurFilm() {
  // Meilleur film 
  const res = await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1");
  const data = await res.json();
  const meilleurFilm = data.results[0];

  // Détails du film 
  const response = await fetch(`http://localhost:8000/api/v1/titles/1508669`).then(r => r.json());

  const card = document.getElementById("meilleurFilm");
  const img = card.querySelector("img.titreFilm");
  img.src = meilleurFilm.image_url;
  img.alt = `Affiche : ${meilleurFilm.title}`;
  card.querySelector(".card-title").textContent = meilleurFilm.title;
  card.querySelector(".card-text").textContent = response.description;
  const btn = card.querySelector("button.btn");
    if (btn) {
      btn.classList.add("btn-details", "btn-sm");   
      btn.setAttribute("data-film-id", meilleurFilm.id);
    }
}
document.addEventListener("DOMContentLoaded", chargerMeilleurFilm);

async function chargerFilmsMieuxNotes() {
  const res = await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=6");
  const data = await res.json();

  const grid = document.getElementById("mieux-notes");
  const cards = grid.querySelectorAll(".card");

  data.results.forEach((film, index) => {
    if (!cards[index]) return;

    const card = cards[index];

    const img = card.querySelector("img");
  if (img) {
    img.onerror = () => { img.src = "./images/image-indisponible.png"; };
    img.src = film.image_url || "./images/image-indisponible.png";
    img.alt = `Affiche : ${film.title}`;
  }
    const h3 = card.querySelector("h3");
    if (h3) h3.textContent = film.title;

    // pour la modale
    const btn = card.querySelector("button.btn");
    if (btn) {
      btn.classList.add("btn-details");
      // pour ouvrirModal(filmId)
      btn.setAttribute("data-film-id", film.id); 
    }
  });
}
document.addEventListener("DOMContentLoaded", chargerFilmsMieuxNotes);

async function chargerFilmsMystery() {
  const res = await fetch("http://localhost:8000/api/v1/titles/?genre=Mystery&sort_by=-imdb_score&page_size=6");
  const data = await res.json();

  const grid = document.getElementById("mystery");
  const cards = grid.querySelectorAll(".card");

  data.results.forEach((film, index) => {
    if (!cards[index]) return;

    const card = cards[index];

    const img = card.querySelector("img");
    if (img) {
      img.onerror = () => { img.src = "./images/image-indisponible.png"; };
      img.src = film.image_url || "./images/image-indisponible.png";
      img.alt = `Affiche : ${film.title}`;
    }
    const h3 = card.querySelector("h3");
    if (h3) h3.textContent = film.title;

    //pour la modale
    const btn = card.querySelector("button.btn");
    if (btn) {
      btn.classList.add("btn-details");
      btn.setAttribute("data-film-id", film.id);
    }
  });
}

document.addEventListener("DOMContentLoaded", chargerFilmsMystery);

async function chargerFilmsAction() {
  const res = await fetch("http://localhost:8000/api/v1/titles/?genre=Action&sort_by=-imdb_score&page_size=6");
  const data = await res.json();

  const grid = document.getElementById("categories");
  const cards = grid.querySelectorAll(".card");

  data.results.forEach((film, index) => {
    if (!cards[index]) return;

    const card = cards[index];

    const img = card.querySelector("img");
    if (img) {
      img.onerror = () => { img.src = "./images/image-indisponible.png"; };
      img.src = film.image_url || "./images/image-indisponible.png";
      img.alt = `Affiche : ${film.title}`;
    }
    const h3 = card.querySelector("h3");
    if (h3) h3.textContent = film.title;

    // pour la modale
    const btn = card.querySelector("button.btn");
    if (btn) {
      btn.classList.add("btn-details");
      btn.setAttribute("data-film-id", film.id);
    }
  });
}

document.addEventListener("DOMContentLoaded", chargerFilmsAction);

async function chargerAutresFilms(genre) {
  if (!genre) return; 

  // Récupère les 6 films de la catégorie choisie
  const res = await fetch(`http://localhost:8000/api/v1/titles/?genre=${genre}&sort_by=-imdb_score&page_size=6`);
  const data = await res.json();

  // Sélection de l'élément
  const grid = document.getElementById("autres");
  const cards = grid.querySelectorAll(".card");

  data.results.forEach((film, index) => {
    if (cards[index]) {
      const img = cards[index].querySelector("img");
      if (img) {
        img.onerror = () => { img.src = "./images/image-indisponible.png"; };
        img.src = film.image_url || "./images/image-indisponible.png";
        img.alt = `Affiche : ${film.title}`;
      }

      const h3 = cards[index].querySelector("h3");
      if (h3) h3.textContent = film.title;

      // 🔹 Ajout du bouton Détails (modale)
      const btn = cards[index].querySelector("button.btn");
      if (btn) {
        btn.classList.add("btn-details");
        btn.setAttribute("data-film-id", film.id);
      }
    }
  });
}

// Écouteur sur le menu déroulant
document.querySelector('select[name="autres"]').addEventListener("change", (e) => {
  chargerAutresFilms(e.target.value);
});

// Charger par défaut la catégorie Family au démarrage
document.addEventListener("DOMContentLoaded", () => {
  chargerAutresFilms("Family");
});


// Modal
const API_URL = "http://localhost:8000/api/v1/titles/";
let filmModal;

document.addEventListener("DOMContentLoaded", () => {
  filmModal = new bootstrap.Modal(document.getElementById("filmModal"));

  // Meilleur film 
  chargerMeilleurFilm();

  // "Autres" via le select
  const selectAutres = document.querySelector('select[name="autres"]');
  if (selectAutres) {
    selectAutres.addEventListener("change", () => {
      const genre = selectAutres.value;
      if (!genre) return;
      remplirSection("autres", `${API_URL}?genre=${encodeURIComponent(genre)}&sort_by=-imdb_score&page_size=6`);
    });
  }

  // Clic sur n'importe quel bouton "Détails" déjà en place
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-details, .btn.btn-danger"); 
    if (!btn) return;

    const filmId = btn.getAttribute("data-film-id");
    if (!filmId) return;

    ouvrirModal(filmId);
  });
});

// Remplir une section existante (#containerId)
function remplirSection(containerId, endpoint) {
  fetch(endpoint)
    .then((r) => r.json())
    .then((data) => {
      const films = data.results || [];
      const cards = document.querySelectorAll(`#${containerId} .card`);

      films.forEach((film, i) => {
        const card = cards[i];
        if (!card) return;

        const img = card.querySelector("img");
        if (img) {
          img.src = film.image_url || "";
          img.alt = `Affiche : ${film.title || ""}`;
        }
        const h3 = card.querySelector("h3, .card-title, h5");
        if (h3) h3.textContent = film.title || "—";

        // bouton détails on lui met l'id pour la modale
        let btn = card.querySelector(".btn-details, .btn.btn-danger");
        if (btn) {
          btn.classList.add("btn-details");
          btn.setAttribute("data-film-id", film.id);
        }
      });
    });
}

// Ouvrir la modale et la remplir
function ouvrirModal(filmId) {
  fetch(`${API_URL}${filmId}`)
    .then(r => r.json())
    .then(film => {
      // Titre
      document.getElementById("filmModalTitle").textContent = film.title || "—";

      // Genres
      document.getElementById("filmModalGenres").textContent =
        (film.genres && film.genres.length ? film.genres.join(", ") : "—");

      // Meta (année + rated + durée + pays)
      document.getElementById("filmModalMeta").textContent =
        `${film.rated || "—"} - ${film.duration || "—"} min (${(film.countries || []).join(", ")})`;

      // Score & box-office
      document.getElementById("filmModalRating").textContent = film.imdb_score ?? "—";
      document.getElementById("filmModalBox").textContent = film.worldwide_gross_income ?? "—";

      // Réalisateur
      document.getElementById("filmModalDirector").textContent =
        (film.directors && film.directors.length ? film.directors.join(", ") : "Non spécifié");

      // Acteurs
      document.getElementById("filmModalActors").textContent =
        (film.actors && film.actors.length ? film.actors.join(", ") : "—");

      // Description
      document.getElementById("filmModalDesc").textContent =
        film.long_description || film.description || "Description indisponible.";

      // Image
      const img = document.getElementById("filmModalImg");
      img.src = film.image_url || "./images/image-indisponible.png";
      img.alt = `Affiche : ${film.title}`;
      img.onerror = () => { img.src = "./images/image-indisponible.png"; };

      // Affiche
      filmModal.show();
    });
}


