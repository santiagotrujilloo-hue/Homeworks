const API_URL = "https://api.giphy.com/v1/gifs/search";
const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
export async function buscarGifs(busqueda, { limite = 20, offset = 0, signal } = {}) {
  const termino = String(busqueda ?? "").trim();
  if (!termino) {
    return { gifs: [], total: 0 };
  }
  if (!API_KEY) {
    throw new Error("No se encontró la API Key de GIPHY. Revisa el archivo .env.local.");
  }
  if (termino.length > 50) {
    throw new Error("La búsqueda no puede superar los 50 caracteres.");
  }
  const parametros = new URLSearchParams({
    api_key: API_KEY,
    q: termino,
    limit: String(limite),
    offset: String(offset),
    rating: "g",
    lang: "es",
  });
  try {
    const respuesta = await fetch(`${API_URL}?${parametros.toString()}`, { signal });
    if (!respuesta.ok) {
      if (respuesta.status === 401 || respuesta.status === 403) {
        throw new Error("La API Key de GIPHY no es válida o no tiene permisos.");
      }
      if (respuesta.status === 429) {
        throw new Error("Se alcanzó el límite de solicitudes. Intenta nuevamente más tarde.");
      }
      throw new Error(`No se pudieron obtener los GIFs. Error ${respuesta.status}.`);
    }
    const datos = await respuesta.json();
    if (datos.meta?.status >= 400) {
      throw new Error(datos.meta.msg || "GIPHY devolvió un error.");
    }
    return {
      gifs: Array.isArray(datos.data) ? datos.data : [],
      total: Number(datos.pagination?.total_count ?? 0),
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }
    if (error instanceof TypeError) {
      throw new Error("No se pudo conectar con GIPHY. Revisa tu conexión a internet.");
    }
    throw error;
  }
}