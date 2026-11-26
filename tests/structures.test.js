import test from 'node:test';
import assert from 'node:assert/strict';
import { Trie } from '../src/structures/trie.js';
import { MaxHeap } from '../src/structures/maxHeap.js';
import { Grafo } from '../src/structures/graph.js';
import { similares, generoLocal } from '../src/recommender.js';
import { elegir, buscarPreview } from '../src/preview.js';

test('Trie: inserta, busca y sugiere por prefijo', () => {
  const t = new Trie();
  ['Despacito', 'Despiértame', 'Dákiti', 'Imagine'].forEach((x) => t.insertar(x));
  assert.equal(t.buscar('Despacito'), true);
  assert.equal(t.buscar('Despa'), false);        // prefijo no es canción
  assert.equal(t.buscar('dakiti'), true);        // ignora tildes y mayúsculas
  assert.deepEqual(t.sugerir('desp'), ['Despacito', 'Despiértame']);
  assert.deepEqual(t.sugerir('zzz'), []);
  assert.deepEqual(t.sugerir(''), []);
  assert.equal(t.sugerir('d', 1).length, 1);     // respeta el límite
  assert.equal(t.tamano, 4);
});

test('MaxHeap: extrae en orden descendente', () => {
  const h = new MaxHeap();
  [5, 1, 9, 3, 7].forEach((n) => h.insertar({ titulo: 'c' + n, reproducciones: n }));
  assert.equal(h.verMax().reproducciones, 9);
  const orden = [];
  while (h.tamano) orden.push(h.extraerMax().reproducciones);
  assert.deepEqual(orden, [9, 7, 5, 3, 1]);
  assert.equal(h.extraerMax(), null);
});

test('MaxHeap: top(n) no destruye el heap', () => {
  const h = new MaxHeap();
  [4, 8, 2].forEach((n) => h.insertar({ titulo: 'c' + n, reproducciones: n }));
  assert.deepEqual(h.top(2).map((c) => c.reproducciones), [8, 4]);
  assert.equal(h.tamano, 3);
});

test('Grafo: es no dirigido y recomienda por BFS', () => {
  const g = new Grafo();
  g.conectar('A', 'B'); g.conectar('B', 'C'); g.conectar('C', 'D');
  assert.equal(g.sonVecinas('B', 'A'), true);    // ida y vuelta
  assert.deepEqual(g.relacionadas('B').sort(), ['A', 'C']);
  assert.deepEqual(g.recomendar('A', 1), ['B']);
  assert.deepEqual(g.recomendar('A', 2), ['B', 'C']);
  assert.equal(g.totalAristas(), 3);
  g.conectar('A', 'B');                          // duplicada: no cambia nada
  assert.equal(g.totalAristas(), 3);
  assert.deepEqual(g.recomendar('Z'), []);
});

test('Auto-relación: prioriza mismo artista y luego mismo género', () => {
  const cat = [
    { titulo: 'A', artista: 'X', genero: 'Rock', reproducciones: 5 },
    { titulo: 'B', artista: 'Y', genero: 'Rock', reproducciones: 9 },
    { titulo: 'C', artista: 'Z', genero: 'Pop', reproducciones: 1 },
  ];
  assert.deepEqual(similares({ titulo: 'N', artista: 'X', genero: 'Rock' }, cat), ['A', 'B']);
  assert.deepEqual(similares({ titulo: 'N', artista: 'X', genero: 'Rock' }, cat, 1), ['A']);
  assert.deepEqual(similares({ titulo: 'N', artista: 'Q', genero: '' }, cat), []);
});

const RESULTADOS = [
  { trackName: 'Despacito - Remix', artistName: 'Luis Fonsi', previewUrl: 'u1', artworkUrl100: 'x/100x100bb.jpg' },
  { trackName: 'Despacito', artistName: 'Luis Fonsi & Daddy Yankee', previewUrl: 'u2', artworkUrl100: 'x/100x100bb.jpg' },
  { trackName: 'Otra canción', artistName: 'Alguien', previewUrl: 'u3' },
];

test('iTunes: elige la versión correcta y descarta canciones distintas', () => {
  const r = elegir(RESULTADOS, { titulo: 'Despacito', artista: 'Luis Fonsi' });
  assert.equal(r.previewUrl, 'u2');
  assert.equal(r.portada, 'x/300x300bb.jpg');
  assert.equal(elegir(RESULTADOS, { titulo: 'Nada parecido', artista: 'Z' }), null);
  assert.equal(elegir([{ trackName: 'Despacito', artistName: 'Z' }], { titulo: 'Despacito', artista: 'Z' }), null); // sin previewUrl
});

test('iTunes: usa caché y no guarda los fallos de red', async () => {
  let llamadas = 0, falla = true;
  globalThis.fetch = async () => { llamadas++; if (falla) throw new Error('sin red'); return { ok: true, json: async () => ({ results: RESULTADOS }) }; };
  const c = { titulo: 'Despacito', artista: 'Luis Fonsi' };
  assert.equal(await buscarPreview(c), null);          // sin red -> null
  falla = false;
  assert.equal((await buscarPreview(c)).previewUrl, 'u2'); // se reintenta
  await buscarPreview(c);
  assert.equal(llamadas, 2);                           // la tercera sale de la caché
});

test('"Otra noche en Miami": el Trie la encuentra por título completo y por prefijo', () => {
  const tr = new Trie();
  ['Dákiti', 'Otra noche en Miami'].forEach((x) => tr.insertar(x));
  assert.equal(tr.buscar('otra noche en miami'), true);
  assert.deepEqual(tr.sugerir('otra n'), ['Otra noche en Miami']);
});

test('Completar desde iTunes: artista y género permiten relacionarla', () => {
  const r = elegir([{ trackName: 'Otra Noche en Miami', artistName: 'Bad Bunny', primaryGenreName: 'Latin Urban', previewUrl: 'u' }],
    { titulo: 'Otra noche en Miami', artista: 'Artista desconocido' });
  assert.equal(r.artista, 'Bad Bunny');
  assert.equal(generoLocal(r.genero), 'Latino');
  const catalogo = [{ titulo: 'Dákiti', artista: 'Bad Bunny', genero: 'Latino', reproducciones: 5 },
                    { titulo: 'Imagine', artista: 'John Lennon', genero: 'Rock', reproducciones: 9 }];
  assert.deepEqual(similares({ titulo: 'Otra noche en Miami', artista: 'Bad Bunny & Jhay Cortez', genero: 'Latino' }, catalogo), ['Dákiti']);
});

test('iTunes: dos búsquedas simultáneas comparten una sola consulta', async () => {
  let n = 0;
  globalThis.fetch = async () => { n++; await new Promise((r) => setTimeout(r, 20)); return { ok: true, json: async () => ({ results: RESULTADOS }) }; };
  const c = { titulo: 'Otra', artista: 'Alguien' };
  const [a, b] = await Promise.all([buscarPreview(c), buscarPreview(c)]);
  assert.equal(n, 1);
  assert.equal(a.previewUrl, 'u3');
  assert.deepEqual(a, b);
});
