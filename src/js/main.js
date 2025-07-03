// Importa las funciones necesarias de los otros módulos
import { getPokemonList, getPokemonDetails, getPokemonTypes } from "./api.js";
import { createCardPokemon } from "./createCardPokemon.js";
import { showPokemonDetails } from "./details.js";

// Elementos del DOM
const searchInput = document.getElementById("search");
const typeFilter = document.getElementById("typeFilter");
const orderBy = document.getElementById("orderBy");
const clearFiltersBtn = document.getElementById("clearFilters");
const errorMsg = document.getElementById("errorMsg");
const loadingMsg = document.getElementById("loadingMsg");
const paginationDiv = document.getElementById("pagination");
const pokemonList = document.getElementById("pokemonList");

// Estado global de la app
let allPokemon = [];
let filteredPokemon = [];
let currentPage = 1;
const pageSize = 20;
let totalPages = 1;
let totalCount = 0;
let allPokemonNames = [];

// Función para mostrar mensaje de carga
function showLoading(msg = "Cargando...") {
  loadingMsg.style.display = "block";
  loadingMsg.textContent = msg;
}

// Función para ocultar mensaje de carga
function hideLoading() {
  loadingMsg.style.display = "none";
}

// Función para mostrar mensaje de error
function showError(msg) {
  errorMsg.style.display = "block";
  errorMsg.textContent = msg;
}

// Función para ocultar mensaje de error
function hideError() {
  errorMsg.style.display = "none";
}

// Carga y muestra los Pokémon de la página actual
async function loadPokemon(page = 1) {
  showLoading();
  hideError();
  try {
    const offset = (page - 1) * pageSize;
    const data = await getPokemonList(offset, pageSize);
    totalCount = data.count;
    totalPages = Math.ceil(totalCount / pageSize);
    const promises = data.results.map((poke) => getPokemonDetails(poke.name));
    allPokemon = await Promise.all(promises);
    
    // Mostrar Pokémon sin ordenamiento especial (orden por defecto)
    filteredPokemon = [...allPokemon];
    
    renderPokemonList(filteredPokemon);
    renderPagination(page, totalPages);
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoading();
  }
}

// Función para renderizar la lista de Pokémon
function renderPokemonList(pokemonArray) {
  createCardPokemon(pokemonArray);
}

// Función para cargar los tipos de Pokémon en el filtro
async function loadTypes() {
  try {
    const data = await getPokemonTypes();
    data.results.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.name;
      option.textContent =
        type.name.charAt(0).toUpperCase() + type.name.slice(1);
      typeFilter.appendChild(option);
    });
  } catch (error) {
    // Si falla, no mostramos tipos
  }
}

// Función para filtrar por tipo
function filterByType(type, array) {
  if (!type) return array;
  return array.filter((pokemon) =>
    pokemon.types.some((t) => t.type.name === type)
  );
}

// Función para buscar por nombre
function searchByName(name, array) {
  if (!name) return array;
  return array.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(name.toLowerCase())
  );
}

// Función para ordenar
function sortPokemon(array, order) {
  if (order === "name") {
    return [...array].sort((a, b) => a.name.localeCompare(b.name));
  } else if (order === "id") {
    return [...array].sort((a, b) => a.id - b.id);
  }
  return array;
}

// Función para limpiar filtros
function clearFilters() {
  searchInput.value = "";
  typeFilter.value = "";
  orderBy.value = "name";
  currentPage = 1;
  // Recargar la página actual sin filtros ni ordenamiento global
  loadPokemon(currentPage);
}

// Hacer la función clearFilters disponible globalmente
window.clearFilters = clearFilters;

// Renderiza la paginación
function renderPagination(current, total) {
  // Oculta la paginación si hay búsqueda activa
  if (searchInput.value) {
    paginationDiv.style.display = "none";
    return;
  }
  
  // Si hay filtro de tipo activo, no mostrar paginación
  if (typeFilter.value) {
    paginationDiv.style.display = "none";
    return;
  }
  
  paginationDiv.style.display = "flex";
  paginationDiv.innerHTML = `
    <button id="prevPage" ${current === 1 ? "disabled" : ""}>Anterior</button>
    <span>Página ${current} de ${total}</span>
    <button id="nextPage" ${
      current === total ? "disabled" : ""
    }>Siguiente</button>
  `;
  document.getElementById("prevPage").onclick = () => {
    if (current > 1) {
      currentPage--;
      loadPokemon(currentPage);
    }
  };
  document.getElementById("nextPage").onclick = () => {
    if (current < total) {
      currentPage++;
      loadPokemon(currentPage);
    }
  };
}

// Cargar todos los nombres de Pokémon al inicio
async function loadAllPokemonNames() {
  try {
    const data = await getPokemonList(0, 100000); // Trae todos los nombres
    allPokemonNames = data.results; // [{name, url}]
  } catch (error) {
    // Si falla, no hay búsqueda global
    allPokemonNames = [];
  }
}

// Modificar applyFilters para búsqueda global
async function applyFilters() {
  let result = [];
  const searchValue = searchInput.value.trim().toLowerCase();
  
  if (searchValue) {
    // Búsqueda global
    // Filtra los nombres
    const filteredNames = allPokemonNames.filter(poke => poke.name.includes(searchValue));
    // Carga detalles solo de los resultados encontrados
    showLoading('Buscando...');
    try {
      const promises = filteredNames.map(poke => getPokemonDetails(poke.name));
      result = await Promise.all(promises);
      result = filterByType(typeFilter.value, result);
      result = sortPokemon(result, orderBy.value);
      filteredPokemon = result;
      renderPokemonList(filteredPokemon);
    } catch (error) {
      showError('Error al buscar Pokémon');
    } finally {
      hideLoading();
    }
    paginationDiv.style.display = "none";
    return;
  }
  
  // Si hay filtro de tipo O cambio de ordenamiento, hacer búsqueda global
  if (typeFilter.value || orderBy.value !== "name") {
    showLoading('Cargando todos los Pokémon...');
    try {
      // Cargar todos los Pokémon para filtrar y ordenar globalmente
      const allPokemonData = await getPokemonList(0, 100000);
      const promises = allPokemonData.results.map(poke => getPokemonDetails(poke.name));
      const allPokemonGlobal = await Promise.all(promises);
      
      // Aplicar filtro de tipo a todos los Pokémon (si hay filtro)
      result = filterByType(typeFilter.value, allPokemonGlobal);
      // Aplicar ordenamiento a todos los Pokémon
      result = sortPokemon(result, orderBy.value);
      filteredPokemon = result;
      renderPokemonList(filteredPokemon);
      paginationDiv.style.display = "none";
    } catch (error) {
      showError('Error al procesar Pokémon');
    } finally {
      hideLoading();
    }
    return;
  }
  
  // Si no hay filtros ni ordenamiento especial, cargar página normal
  loadPokemon(currentPage);
}

// Eventos
if (searchInput && typeFilter && orderBy) {
  searchInput.addEventListener("input", applyFilters);
  typeFilter.addEventListener("change", applyFilters);
  orderBy.addEventListener("change", applyFilters);
}

// Evento para limpiar filtros
if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", clearFilters);
}

// Evento para mostrar detalles al hacer clic en el botón correspondiente
if (pokemonList) {
  pokemonList.addEventListener("click", function (e) {
    if (e.target.classList.contains("btnDetails")) {
      const card = e.target.closest(".card");
      const name = card.querySelector("h2").textContent;
      const pokemon = allPokemon.find((p) => p.name === name);
      if (pokemon) showPokemonDetails(pokemon);
    }
  });
}

// Inicialización
loadAllPokemonNames();
loadPokemon(currentPage);
loadTypes();
