// Función para obtener la lista de Pokémon desde la API
export async function getPokemonList(offset = 0, limit = 100000) {
  // Realiza una petición a la API para obtener una lista de Pokémon con paginación
  const url = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );
  if (!url.ok) throw new Error("No se pudo obtener la lista de Pokémon");
  return url.json();
}

// Función para obtener los detalles de un Pokémon específico por nombre
export async function getPokemonDetails(name) {
  // Realiza una petición a la API para obtener los detalles de un Pokémon
  const url = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!url.ok) throw new Error("No se pudo obtener los detalles del Pokémon");
  return url.json();
}

// Función para obtener todos los tipos de Pokémon disponibles en la API
export async function getPokemonTypes() {
  // Realiza una petición a la API para obtener los tipos de Pokémon
  const url = await fetch(`https://pokeapi.co/api/v2/type`);
  if (!url.ok) throw new Error("No se pudo obtener los tipos de Pokémon");
  return url.json();
}
