// Busca en la API pública de iTunes el fragmento real de 30 s y la portada de una canción
import { normalizar } from './structures/trie.js';
import { DESCONOCIDO } from './recommender.js';

const cache = new Map();      // titulo -> datos | null  (solo respuestas exitosas de iTunes)
const pendientes = new Map(); // titulo -> consulta en curso (evita buscar dos veces lo mismo)
const fallos = new Set();     // títulos cuya última consulta falló por la red

// Elige el mejor resultado: título exacto (+4) o que empiece igual (+2), y artista coincidente (+3).
export function elegir(resultados = [], cancion) {
  const titulo = normalizar(cancion.titulo);
  const artista = cancion.artista && cancion.artista !== DESCONOCIDO ? normalizar(cancion.artista) : '';
  let mejor = null, mejorPuntos = 0;
  for (const r of resultados) {
    if (!r.previewUrl || !r.trackName) continue;
    const nombre = normalizar(r.trackName);
    const puntosTitulo = nombre === titulo ? 4 : nombre.startsWith(titulo) ? 2 : 0;
    if (!puntosTitulo) continue; // evita devolver otra canción distinta
    const puntos = puntosTitulo + (artista && normalizar(r.artistName ?? '').includes(artista) ? 3 : 0);
    if (puntos > mejorPuntos) { mejor = r; mejorPuntos = puntos; }
  }
  return mejor && {
    previewUrl: mejor.previewUrl,
    portada: mejor.artworkUrl100?.replace('100x100', '300x300') ?? null,
    artista: mejor.artistName ?? null,
    genero: mejor.primaryGenreName ?? null,
  };
}

// Plan B si el navegador bloquea fetch (CORS): iTunes soporta el parámetro "callback" (JSONP)
function jsonp(url, ms = 3000) {
  return new Promise((ok, fallo) => {
    const cb = `itunes_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const s = document.createElement('script');
    const fin = () => { delete window[cb]; s.remove(); clearTimeout(t); };
    const t = setTimeout(() => { fin(); fallo(new Error('timeout')); }, ms);
    window[cb] = (datos) => { fin(); ok(datos); };
    s.onerror = () => { fin(); fallo(new Error('jsonp')); };
    s.src = `${url}&callback=${cb}`;
    document.head.append(s);
  });
}

async function consultar(url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 4000);
  try {
    const r = await fetch(url, { signal: ctl.signal });
    if (!r.ok) throw new Error('http ' + r.status);
    return await r.json();
  } catch {
    return jsonp(url);
  } finally { clearTimeout(t); }
}

export const enCache = (c) => cache.has(c.titulo);
export const valorCache = (c) => cache.get(c.titulo);
export const huboFalloDeRed = (c) => fallos.has(c.titulo);

// Devuelve { previewUrl, portada, artista, genero } o null (no encontrada / sin conexión). Nunca lanza error.
export function buscarPreview(cancion) {
  const id = cancion.titulo;
  if (cache.has(id)) return Promise.resolve(cache.get(id));
  if (pendientes.has(id)) return pendientes.get(id);
  const termino = [id, cancion.artista !== DESCONOCIDO ? cancion.artista : ''].join(' ').trim();
  const consulta = (async () => {
    try {
      const datos = await consultar(`https://itunes.apple.com/search?term=${encodeURIComponent(termino)}&media=music&entity=song&limit=15`);
      const resultado = elegir(datos.results, cancion);
      cache.set(id, resultado); // se guarda incluso "no encontrada" para no insistir
      fallos.delete(id);
      return resultado;
    } catch {
      fallos.add(id);           // fallo de red: NO se guarda en caché, se reintenta después
      return null;
    } finally { pendientes.delete(id); }
  })();
  pendientes.set(id, consulta);
  return consulta;
}

// Espera como máximo "ms"; si iTunes no alcanza a responder devuelve undefined (y la consulta sigue en segundo plano)
export function esperarPreview(cancion, ms = 1500) {
  return Promise.race([buscarPreview(cancion), new Promise((r) => setTimeout(() => r(undefined), ms))]);
}
