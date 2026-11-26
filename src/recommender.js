// Auto-relación: puntúa qué tan parecida es una canción nueva a las del catálogo
import { normalizar } from './structures/trie.js';

export const DESCONOCIDO = 'Artista desconocido';

// Traduce el género que devuelve iTunes ("Latin Urban", "Música urbana"…) a los del catálogo
export function generoLocal(g = '') {
  const x = normalizar(g);
  if (/latin|urban|reggaeton|salsa|tropical/.test(x)) return 'Latino';
  if (/rock|metal|punk/.test(x)) return 'Rock';
  if (/indie|alternativ/.test(x)) return 'Indie';
  if (/pop|dance|electr/.test(x)) return 'Pop';
  return g;
}

// Mismo artista (también "Bad Bunny & Jhay Cortez" ~ "Bad Bunny")
function mismoArtista(a, b) {
  if (!a || !b || a === DESCONOCIDO || b === DESCONOCIDO) return false;
  const x = normalizar(a), y = normalizar(b);
  return x === y || (Math.min(x.length, y.length) >= 3 && (x.includes(y) || y.includes(x)));
}

// Mismo artista = 3 puntos, mismo género = 1 punto. Devuelve los títulos más parecidos.
export function similares(nueva, canciones, max = 3) {
  return canciones
    .filter((c) => c.titulo !== nueva.titulo)
    .map((c) => ({
      c,
      puntos: (mismoArtista(nueva.artista, c.artista) ? 3 : 0)
            + (nueva.genero && c.genero === nueva.genero ? 1 : 0),
    }))
    .filter((x) => x.puntos > 0)
    .sort((a, b) => b.puntos - a.puntos || b.c.reproducciones - a.c.reproducciones)
    .map((x) => x.c.titulo)
    .slice(0, max);
}
