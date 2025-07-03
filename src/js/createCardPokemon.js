// Función para obtener favoritos del localStorage
function getFavorites() {
  const favs = localStorage.getItem("favorites");
  return favs ? JSON.parse(favs) : [];
}

// Función para guardar favoritos en localStorage
function setFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
}

// Función para saber si un Pokémon es favorito
function isFavorite(pokemon) {
  return getFavorites().some((fav) => fav.id === pokemon.id);
}

// Función para mostrar un mensaje flotante
function showFavoriteMessage(msg) {
  let alert = document.createElement('div');
  alert.textContent = msg;
  alert.style.position = 'fixed';
  alert.style.bottom = '30px';
  alert.style.left = '50%';
  alert.style.transform = 'translateX(-50%)';
  alert.style.background = '#333';
  alert.style.color = '#fff';
  alert.style.padding = '10px 20px';
  alert.style.borderRadius = '8px';
  alert.style.zIndex = '9999';
  alert.style.fontSize = '1rem';
  alert.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  document.body.appendChild(alert);
  setTimeout(() => {
    alert.remove();
  }, 1500);
}

// Función para alternar favorito
function toggleFavorite(pokemon) {
  let favs = getFavorites();
  if (isFavorite(pokemon)) {
    favs = favs.filter((fav) => fav.id !== pokemon.id);
    showFavoriteMessage(`Eliminado de favoritos: ${pokemon.name}`);
  } else {
    favs.push(pokemon);
    showFavoriteMessage(`¡${pokemon.name} agregado a favoritos!`);
  }
  setFavorites(favs);
}

// Función para crear y mostrar las tarjetas de Pokémon en el contenedor principal
export function createCardPokemon(pokemonArray) {
  const container = document.getElementById("pokemonList");
  container.innerHTML = "";
  pokemonArray.forEach((pokemon) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h4>#${pokemon.id}</h4>
        <h2>${pokemon.name}</h2>
        <button class="btnFavorites">${
          isFavorite(pokemon) ? "💖" : "❤️"
        }</button>
        <button class="btnDetails">Ver detalles</button>
      `;
    // Evento para el botón de favoritos
    card.querySelector(".btnFavorites").addEventListener("click", () => {
      toggleFavorite(pokemon);
      // Cambia el icono según el estado
      card.querySelector(".btnFavorites").textContent = isFavorite(pokemon)
        ? "💖"
        : "❤️";
      // Si estás en favorites.html, elimina la card si se quita de favoritos
      if (
        window.location.pathname.includes("favorites.html") &&
        !isFavorite(pokemon)
      ) {
        card.remove();
        // Si no quedan favoritos, muestra el mensaje
        if (container.children.length === 0) {
          const noFavMsg = document.getElementById("noFavoritesMsg");
          if (noFavMsg) noFavMsg.style.display = "block";
        }
      }
    });
    container.appendChild(card);
  });
}
