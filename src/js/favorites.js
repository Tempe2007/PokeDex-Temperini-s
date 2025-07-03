import { createCardPokemon } from "./createCardPokemon.js";

// Obtiene los favoritos del localStorage
function getFavorites() {
  const favs = localStorage.getItem("favorites");
  return favs ? JSON.parse(favs) : [];
}

// Renderiza los favoritos en la página
function renderFavorites() {
  const favoritesList = document.getElementById("pokemonList");
  const noFavoritesMsg = document.getElementById("noFavoritesMsg");
  const favorites = getFavorites();

  if (favorites.length === 0) {
    favoritesList.innerHTML = "";
    noFavoritesMsg.style.display = "block";
    return;
  }

  noFavoritesMsg.style.display = "none";
  createCardPokemon(favorites);
}

// Inicializa la página de favoritos
renderFavorites();
