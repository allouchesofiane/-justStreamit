document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.voir-plus').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target'); // ex: "top-rated"
      const grid = document.getElementById(targetId);

      // 1) Ajoute/retire la classe .show-all sur la grille
      grid.classList.toggle('show-all');

      // 2) Met à jour le libellé du bouton
      button.textContent = grid.classList.contains('show-all')
        ? 'Voir moins'
        : 'Voir plus';
    });
  });
});