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

  // Détails du film (contient description)
  const response = await fetch(`http://localhost:8000/api/v1/titles/${meilleurFilm.id}`).then(r => r.json());

  const card = document.getElementById("meilleurFilm");
  const img = card.querySelector("img.titreFilm");

  img.src = meilleurFilm.image_url;
  img.alt = `Affiche : ${meilleurFilm.title}`;
  card.querySelector(".card-title").textContent = meilleurFilm.title;
  card.querySelector(".card-text").textContent = response.description;
}
document.addEventListener("DOMContentLoaded", chargerMeilleurFilm);

async function chargerFilmsMieuxNotes() {
  // Récupère les 6 meilleurs films
  const res = await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=6");
  const data = await res.json();

  // Sélection de l'element
  const grid = document.getElementById("mieux-notes");

  const cards = grid.querySelectorAll(".card");
  data.results.forEach((film, index) => {
    if (cards[index]) {
      const img = cards[index].querySelector("img");
      img.src = film.image_url;
      img.alt = `Affiche : ${film.title}`;
      cards[index].querySelector("h3").textContent = film.title;
    }
  });
}
document.addEventListener("DOMContentLoaded", chargerFilmsMieuxNotes);



async function chargerFilmsMystery() {
  // Récupère les 6 meilleurs films du genre Mystery
  const res = await fetch("http://localhost:8000/api/v1/titles/?genre=Mystery&sort_by=-imdb_score&page_size=6");
  const data = await res.json();

  //  Sélection de l'element
  const grid = document.getElementById("mystery");

  
  const cards = grid.querySelectorAll(".card");
  data.results.forEach((film, index) => {
    if (cards[index]) {
      const img = cards[index].querySelector("img");
      img.src = film.image_url;
      img.alt = `Affiche : ${film.title}`;
      cards[index].querySelector("h3").textContent = film.title;
    }
  });
}
document.addEventListener("DOMContentLoaded", chargerFilmsMystery);

async function chargerFilmsAction() {
  // Récupérer les 6 meilleurs films Action
  const res = await fetch("http://localhost:8000/api/v1/titles/?genre=Action&sort_by=-imdb_score&page_size=6");
  const data = await res.json();
  
  //  Sélectionner le conteneur de la section Action
  const section = document.getElementById("categories");
  section.innerHTML = ""; 

  data.results.forEach(film => {
    const col = document.createElement("div");
    col.className = "col col-12 col-sm-6 col-md-4";
    
    col.innerHTML = `
      <article class="card h-100 d-flex flex-column">
        <img src="${film.image_url}" alt="Affiche du film ${film.title}">
        <div class="card-body">
          <h3>${film.title}</h3>
          <button class="btn btn-danger btn-sm">Détails</button>
        </div>
      </article>
    `;
    section.appendChild(col);
  });
}

document.addEventListener("DOMContentLoaded", chargerFilmsAction);

async function chargerAutresFilms(genre) {
  if (!genre) return; // Si rien de sélectionné, on ne fait rien

  // Récupérer les 6 films de la catégorie choisie
  const res = await fetch(`http://localhost:8000/api/v1/titles/?genre=${genre}&sort_by=-imdb_score&page_size=6`);
  const data = await res.json();

  // Sélectionner la section "autres"
  const section = document.getElementById("autres");
  section.innerHTML = ""; // On vide avant de remplir

  // Afficher chaque film
  data.results.forEach(film => {
    const col = document.createElement("div");
    col.className = "col col-12 col-sm-6 col-md-4";
    col.innerHTML = `
      <article class="card h-100 d-flex flex-column">
        <img src="${film.image_url}" alt="Affiche du film ${film.title}">
        <div class="card-body">
          <h3>${film.title}</h3>
          <button class="btn btn-danger btn-sm">Détails</button>
        </div>
      </article>
    `;
    section.appendChild(col);
  });
}

// Écouteur sur le menu déroulant
document.querySelector('select[name="autres"]').addEventListener("change", (e) => {
  chargerAutresFilms(e.target.value);
});


// Modal
const API_URL = "http://localhost:8000/api/v1/titles/";
let filmModal;

document.addEventListener("DOMContentLoaded", () => {
  filmModal = new bootstrap.Modal(document.getElementById("filmModal"));

  // Meilleur film 
  chargerMeilleurFilm();

  // Sections
  remplirSection("mieux-notes",  `${API_URL}?sort_by=-imdb_score&page_size=6`);
  remplirSection("mystery",      `${API_URL}?genre=Mystery&sort_by=-imdb_score&page_size=6`);
  remplirSection("categories",   `${API_URL}?genre=Action&sort_by=-imdb_score&page_size=6`);

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

// Meilleur film
function chargerMeilleurFilm() {
  fetch(`${API_URL}?sort_by=-imdb_score&page_size=1`)
    .then((r) => r.json())
    .then((data) => {
      const best = (data.results || [])[0];
      if (!best) return;

      const card = document.getElementById("meilleurFilm");
      if (!card) return;

      const img = card.querySelector("img.titreFilm");
      if (img) {
        img.src = best.image_url || "";
        img.alt = `Affiche : ${best.title || ""}`;
      }
      const title = card.querySelector(".card-title");
      if (title) title.textContent = best.title || "—";

      // texte court si dispo (pas la longue ici)
      const p = card.querySelector(".card-text");
      if (p) p.textContent = best.description || "—";

      // bouton détails -> on met l'id pour la modale
      const btn = card.querySelector(".btn.btn-danger");
      if (btn) {
        btn.classList.add("btn-details");
        btn.setAttribute("data-film-id", best.id);
      }
    });
}

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

        // bouton détails -> on lui met l'id pour la modale
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
    .then((r) => r.json())
    .then((film) => {
      // Titre
      document.getElementById("filmModalTitle").textContent = film.title || "—";

      // Image
      const img = document.getElementById("filmModalImg");
      img.src = film.image_url || "";
      img.alt = `Affiche : ${film.title || ""}`;

      // Note / Durée / Réalisateurs
      document.getElementById("filmModalRating").textContent = film.imdb_score ?? "—";
      document.getElementById("filmModalDuration").textContent = film.duration ?? "—";
      document.getElementById("filmModalDirector").textContent =
        (film.directors && film.directors.length ? film.directors.join(", ") : "Non spécifié");

      // Description (longue en priorité)
      document.getElementById("filmModalDesc").textContent =
        film.long_description || film.description || "Description indisponible.";

      filmModal.show();
    });
}

