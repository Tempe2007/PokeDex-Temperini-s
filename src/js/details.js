// Crea el modal si no existe en el DOM
function ensureModalExists() {
  if (!document.getElementById("pokemonModal")) {
    const modalHTML = `
      <div id="pokemonModal" class="modal" style="display:none;">
        <div class="modal-content" id="modalContent">
          <span class="close" id="closeModal">&times;</span>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }
}

// Función para mostrar el modal con los detalles del Pokémon
export function showPokemonDetails(pokemon) {
  ensureModalExists();
  const modal = document.getElementById("pokemonModal");
  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = `
    <span class="close" id="closeModal">&times;</span>
    <img src="${pokemon.sprites.front_default}" alt="${
    pokemon.name
  }" style="width:100px; margin-bottom:1rem;">
    <h2 style="color:#e3350d;">${pokemon.name}</h2>
    <h4>#${pokemon.id}</h4>
    <p><strong>Tipo:</strong> ${pokemon.types
      .map((t) => t.type.name)
      .join(", ")}</p>
    <p><strong>Habilidades:</strong> ${pokemon.abilities
      .map((a) => a.ability.name)
      .join(", ")}</p>
    <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
    <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
  `;
  modal.style.display = "flex";

  // Cerrar modal al hacer clic en la X
  document.getElementById("closeModal").onclick = () => {
    modal.style.display = "none";
  };
}

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", function (event) {
  const modal = document.getElementById("pokemonModal");
  if (modal && event.target === modal) {
    modal.style.display = "none";
  }
});
