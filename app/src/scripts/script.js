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
  // 1) Meilleur film 
  const res = await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1");
  const data = await res.json();
  const meilleurFilm = data.results[0];

  // 2) Détails du film (contient description)
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
  // 1) Récupère les 6 meilleurs films
  const res = await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=6");
  const data = await res.json();

  // 2) Sélection de l'element
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
  //  Récupère les 6 meilleurs films du genre Mystery
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
  //  Récupérer les 6 meilleurs films Action
  const res = await fetch("http://localhost:8000/api/v1/titles/?genre=Action&sort_by=-imdb_score&page_size=6");
  const data = await res.json();
  
  //  Sélectionner le conteneur de la section Action
  const section = document.getElementById("categories");
  section.innerHTML = ""; // On vide avant d’ajouter

  data.results.forEach(film => {
    const col = document.createElement("div");
    col.className = "col col-12 col-sm-6 col-md-4";
    
    col.innerHTML = `
      <article class="card h-100">
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
      <article class="card h-100">
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
