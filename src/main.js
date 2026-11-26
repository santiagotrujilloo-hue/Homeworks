import './styles/main.scss';
import { Trie, normalizar } from './structures/trie.js';
import { MaxHeap } from './structures/maxHeap.js';
import { Grafo } from './structures/graph.js';
import { CANCIONES, RELACIONES } from './data/songs.js';
import { similares, generoLocal, DESCONOCIDO } from './recommender.js';
import { reproducir, reproducirUrl, detener, desbloquear } from './audio.js';
import { buscarPreview, esperarPreview, enCache, valorCache, huboFalloDeRed } from './preview.js';

// ---- Estado y estructuras ----
const trie = new Trie();
const grafo = new Grafo();
const catalogo = new Map();
CANCIONES.forEach((c) => { trie.insertar(c.titulo); grafo.agregarCancion(c.titulo); catalogo.set(c.titulo, { ...c }); });
RELACIONES.forEach(([a, b]) => grafo.conectar(a, b));
let actual = null;
let topN = 5;
let sonando = false;
let cargando = false; // buscando el fragmento en iTunes
let token = 0;        // invalida reproducciones pendientes si el usuario cancela o cambia
let fuente = '';

// ---- Utilidades ----
const $ = (s) => document.querySelector(s);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const hue = (t) => [...t].reduce((a, c) => a + c.charCodeAt(0) * 7, 0) % 360;
const fmt = (n) => n.toLocaleString('es-CO');
const portadaStyle = (c) => c.portada ? esc(`background-image:url('${c.portada}');background-size:cover;background-position:center`) : '';
const avisar = (sel, txt, ok) => { $(sel).textContent = txt; $(sel).className = `estado ${ok ? 'ok' : 'error'}`; };
const corto = (t) => (t.length > 15 ? t.slice(0, 14) + '…' : t);

// ---- Renders ----
function renderStats() {
  $('#stat-canciones').textContent = trie.tamano;
  $('#stat-plays').textContent = fmt([...catalogo.values()].reduce((s, c) => s + c.reproducciones, 0));
  $('#stat-aristas').textContent = grafo.totalAristas();
}

function renderRanking() {
  const heap = new MaxHeap(); // se arma con las reproducciones actuales
  catalogo.forEach((c) => heap.insertar(c));
  const top = heap.top(topN);
  const max = top[0].reproducciones;
  $('#ranking').innerHTML = top.map((c, i) => `
    <li class="ranking__item ranking__item--${i + 1} ${c.titulo === actual ? 'es-actual' : ''}" data-t="${esc(c.titulo)}" style="--h:${hue(c.titulo)}">
      <span class="ranking__pos">${i + 1}</span>
      <span class="cover cover--sm" style="${portadaStyle(c)}"></span>
      <div class="ranking__info">
        <strong>${esc(c.titulo)}</strong><small>${esc(c.artista)}</small>
        <div class="ranking__barra"><span style="width:${(c.reproducciones / max) * 100}%"></span></div>
      </div>
      <span class="ranking__plays">${fmt(c.reproducciones)}</span>
    </li>`).join('');
}

function renderSugerencias(q) {
  const lista = trie.sugerir(q, 6);
  const n = q.trim().length;
  $('#sugerencias').innerHTML = lista.length
    ? lista.map((t) => `<li><button class="sugerencia" data-t="${esc(t)}"><b>${esc(t.slice(0, n))}</b>${esc(t.slice(n))}</button></li>`).join('')
    : q.trim() ? '<li class="vacio">Sin coincidencias 🎧</li>' : '';
}

function renderPlayer() {
  const c = catalogo.get(actual);
  $('#player').innerHTML = c ? `
    <div class="player" style="--h:${hue(c.titulo)}">
      <div class="cover cover--lg ${sonando ? 'cover--sonando' : ''}" style="${portadaStyle(c)}"></div>
      <div class="player__info">
        <small>Ahora seleccionada</small>
        ${sonando ? '<span class="eq"><span></span><span></span><span></span><span></span></span>' : ''}
        <h2>${esc(c.titulo)}</h2>
        <p>${esc(c.artista)}${c.genero ? ` · <span class="etiqueta">${esc(c.genero)}</span>` : ''}</p>
        <p class="player__plays">${fmt(c.reproducciones)} reproducciones</p>
        ${fuente ? `<p class="fuente">${fuente}</p>` : ''}
        <button id="btn-play" class="boton">${cargando ? '⏳ Buscando…' : sonando ? '⏸ Detener' : '▶ Escuchar'}</button>
      </div>
    </div>` : '<div class="player player--vacio"><span>🎵</span><p>Busca o elige una canción para empezar</p></div>';
}

function renderGrafo() {
  if (!actual) { $('#grafo').innerHTML = '<p class="vacio">Selecciona una canción para ver su red.</p>'; $('#recomendadas').innerHTML = ''; return; }
  const vecinos = grafo.relacionadas(actual);
  const cx = 200, cy = 150, r = 105;
  const pos = new Map([[actual, { x: cx, y: cy }]]);
  vecinos.forEach((v, i) => {
    const a = (2 * Math.PI * i) / vecinos.length - Math.PI / 2;
    pos.set(v, { x: cx + r * Math.cos(a), y: cy + r * 0.85 * Math.sin(a) });
  });
  const aristas = [];
  vecinos.forEach((v) => aristas.push([actual, v]));
  vecinos.forEach((a, i) => vecinos.slice(i + 1).forEach((b) => grafo.sonVecinas(a, b) && aristas.push([a, b, true])));
  const lineas = aristas.map(([a, b, suave]) =>
    `<line class="g-edge ${suave ? 'g-edge--suave' : ''}" x1="${pos.get(a).x}" y1="${pos.get(a).y}" x2="${pos.get(b).x}" y2="${pos.get(b).y}"/>`).join('');
  const nodos = [...pos].map(([t, p]) => `
    <g class="g-node ${t === actual ? 'g-node--centro' : ''}" data-t="${esc(t)}" style="--h:${hue(t)}">
      <circle cx="${p.x}" cy="${p.y}" r="${t === actual ? 30 : 22}"/>
      <text x="${p.x}" y="${p.y + (t === actual ? 48 : 38)}">${esc(corto(t))}</text>
    </g>`).join('');
  $('#grafo').innerHTML = `<svg viewBox="0 0 400 300" role="img" aria-label="Grafo de canciones relacionadas">${lineas}${nodos}</svg>`;
  const rec = grafo.recomendar(actual, 2);
  $('#recomendadas').innerHTML = rec.length
    ? rec.map((t) => `<li><button class="chip" data-t="${esc(t)}">${esc(t)}</button></li>`).join('')
    : '<li class="vacio">Sin recomendaciones</li>';
}

function seleccionar(titulo) {
  detener(); sonando = false; cargando = false; token++; fuente = '';
  actual = titulo;
  buscarPreview(catalogo.get(titulo)); // se precarga en segundo plano para que el clic suene al instante
  renderPlayer(); renderGrafo(); renderRanking();
}

// Completa artista/género desde iTunes y relaciona la canción con las parecidas
async function enriquecer(titulo) {
  const c = catalogo.get(titulo);
  const info = await buscarPreview(c);
  if (!info) return avisar('#estado-agregar', `No pude completar los datos de "${titulo}" (sin conexión o no está en iTunes). Usa "Conectar" en el grafo para relacionarla a mano.`, false);
  if (c.artista === DESCONOCIDO && info.artista) c.artista = info.artista;
  if (!c.genero && info.genero) c.genero = generoLocal(info.genero);
  c.portada ??= info.portada;
  const nuevas = similares(c, [...catalogo.values()]).filter((v) => !grafo.sonVecinas(titulo, v));
  nuevas.forEach((v) => grafo.conectar(titulo, v));
  renderStats(); renderRanking();
  if (actual === titulo) { renderPlayer(); renderGrafo(); }
  avisar('#estado-agregar', `✔ "${titulo}" es de ${c.artista}` + (nuevas.length
    ? ` y ahora está conectada con: ${nuevas.join(', ')}`
    : '. No hay canciones parecidas en el catálogo; usa "Conectar" en el grafo.'), nuevas.length > 0);
}

// Conexión manual entre la canción seleccionada y otra del catálogo
$('#form-conectar').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = new FormData(e.target).get('otra').trim();
  const msg = (t, ok) => avisar('#estado-conectar', t, ok);
  if (!actual) return msg('Primero selecciona una canción', false);
  const otra = [...catalogo.keys()].find((k) => normalizar(k) === normalizar(q));
  if (!otra) return msg(`"${q}" no existe en el catálogo`, false);
  if (otra === actual) return msg('Elige una canción distinta', false);
  if (grafo.sonVecinas(actual, otra)) return msg('Ya están conectadas', false);
  grafo.conectar(actual, otra);
  e.target.reset(); renderStats(); renderGrafo();
  msg(`✔ "${actual}" ↔ "${otra}" conectadas`, true);
});

function renderDatalist() {
  $('#lista-titulos').innerHTML = [...catalogo.keys()].map((t) => `<option value="${esc(t)}">`).join('');
  const generos = new Set([...catalogo.values()].map((c) => c.genero).filter(Boolean));
  $('#lista-generos').innerHTML = [...generos].map((g) => `<option value="${esc(g)}">`).join('');
}

// ---- Eventos ----
$('#form-agregar').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const titulo = f.get('titulo').trim();
  const artista = f.get('artista').trim() || DESCONOCIDO;
  const genero = f.get('genero').trim();
  const plays = Math.max(0, parseInt(f.get('plays'), 10) || 0);
  const rel = f.get('relacionada').trim();
  const aviso = (txt, ok) => avisar('#estado-agregar', txt, ok);

  if (!titulo) return aviso('Escribe el título de la canción', false);
  if (trie.buscar(titulo)) return aviso(`"${titulo}" ya existe en el catálogo`, false);
  const vecina = rel ? [...catalogo.keys()].find((k) => normalizar(k) === normalizar(rel)) : null;
  if (rel && !vecina) return aviso(`La canción relacionada "${rel}" no existe`, false);

  const nueva = { titulo, artista, genero, reproducciones: plays };
  const conexiones = new Set(similares(nueva, [...catalogo.values()])); // auto-relación por artista/género
  if (vecina) conexiones.add(vecina);                                   // + la que elija el usuario

  trie.insertar(titulo);                 // 1) Trie
  grafo.agregarCancion(titulo);          // 2) nodo del grafo
  catalogo.set(titulo, nueva);           // 3) ranking (heap)
  conexiones.forEach((v) => grafo.conectar(titulo, v)); // aristas no dirigidas

  e.target.reset();
  renderDatalist(); renderStats(); renderSugerencias($('#buscador').value);
  seleccionar(titulo);
  const falta = artista === DESCONOCIDO || !genero;
  aviso(`✔ "${titulo}" agregada` + (conexiones.size ? ` y conectada con: ${[...conexiones].join(', ')}`
    : falta ? '. Buscando artista y género en iTunes para relacionarla…' : ' (sin canciones parecidas; usa "Conectar" en el grafo)'), true);
  if (falta) enriquecer(titulo);
});
$('#buscador').addEventListener('input', (e) => { $('#estado').textContent = ''; renderSugerencias(e.target.value); });
$('#buscador').addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const q = e.target.value.trim();
  if (!q) return;
  const existe = trie.buscar(q);
  $('#estado').textContent = existe ? `✔ "${q}" existe en el catálogo` : `✘ "${q}" no existe todavía`;
  $('#estado').className = `estado ${existe ? 'ok' : 'error'}`;
  if (existe) seleccionar(trie.sugerir(q, 1)[0]);
});
document.addEventListener('click', async (e) => {
  const cancion = e.target.closest('[data-t]');
  if (cancion) return seleccionar(cancion.dataset.t);
  const top = e.target.closest('[data-top]');
  if (top) {
    topN = Number(top.dataset.top);
    document.querySelectorAll('#segmento button').forEach((b) => b.classList.toggle('activo', b === top));
    return renderRanking();
  }
  if (e.target.closest('#btn-play')) {
    if (sonando || cargando) { detener(); token++; sonando = false; cargando = false; return renderPlayer(); }
    desbloquear();                         // dentro del clic: así el navegador permite sonar aunque luego haya esperas
    const c = catalogo.get(actual);
    const mi = ++token;
    const alTerminar = () => { if (mi === token) { sonando = false; renderPlayer(); } };
    c.reproducciones++;
    const listo = enCache(c);
    if (!listo) { cargando = true; renderPlayer(); }
    renderRanking(); renderStats();

    // 1) fragmento real de iTunes (espera máximo 1,5 s si aún no está precargado)
    const info = listo ? valorCache(c) : await esperarPreview(c, 1500);
    if (mi !== token) return;              // el usuario canceló o cambió de canción
    cargando = false;
    let real = false;
    if (info) {
      c.portada = info.portada;
      try { await reproducirUrl(info.previewUrl, alTerminar); real = true; } catch { real = false; }
      if (mi !== token) return;
    }
    if (real) {
      fuente = '🎧 Fragmento real de 30 s · iTunes';
    } else {
      // 2) respaldo inmediato: melodía generada, diciendo por qué no hubo fragmento
      const motivo = info ? 'el navegador no pudo reproducir el fragmento'
        : info === undefined ? 'iTunes tardó en responder'
        : huboFalloDeRed(c) ? 'no hay conexión con iTunes' : 'iTunes no tiene esa canción';
      if (reproducir(c.titulo, alTerminar)) fuente = `🎹 Melodía generada (${motivo})`;
      else { fuente = '🔇 El navegador bloqueó el audio. Revisa el volumen/pestaña silenciada y pulsa otra vez.'; sonando = false; return renderPlayer(); }
    }
    sonando = true;
    renderPlayer(); renderRanking();
  }
});

renderDatalist(); renderStats(); renderPlayer(); renderGrafo(); renderRanking();
