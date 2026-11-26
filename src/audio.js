// Sonido: fragmento real (HTMLAudio) o melodía generada con Web Audio (sin archivos)
let ctx = null, master = null, timer = null, pista = null;
const ESCALA = [0, 2, 4, 7, 9]; // pentatónica mayor: suena bien con cualquier orden

const semilla = (t) => { let h = 2166136261; for (const c of t) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const aleatorio = (s) => () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 2 ** 32; // misma canción -> misma melodía

// Debe llamarse DENTRO del clic: los navegadores solo dejan sonar si el usuario interactuó
export function desbloquear() {
  try {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume?.();
    try { // truco para iOS/Safari: reproducir 1 muestra en silencio
      const s = ctx.createBufferSource();
      s.buffer = ctx.createBuffer(1, 1, 22050);
      s.connect(ctx.destination); s.start(0);
    } catch { /* no pasa nada */ }
    return true;
  } catch { return false; } // este navegador no permite audio
}

function nota(freq, t, dur, tipo, vol) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = tipo; o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(master);
  o.start(t); o.stop(t + dur + 0.05);
}

export function detener() {
  clearTimeout(timer);
  if (pista) { pista.onended = null; pista.pause(); pista = null; }
  if (master) { master.disconnect(); master = null; }
}

// Devuelve true si pudo arrancar la melodía
export function reproducir(titulo, alTerminar) {
  try {
    detener();
    if (!desbloquear()) return false;
    master = ctx.createGain(); master.gain.value = 0.2; master.connect(ctx.destination);
    const r = aleatorio(semilla(titulo));
    const base = 196 * 2 ** (Math.floor(r() * 12) / 12);
    const paso = 0.2 + r() * 0.15; // segundos por nota
    const total = 24;
    const t0 = ctx.currentTime + 0.05;
    for (let i = 0; i < total; i++) {
      const grado = ESCALA[Math.floor(r() * 5)] + 12 * Math.floor(r() * 2);
      nota(base * 2 ** (grado / 12), t0 + i * paso, paso * 0.95, 'triangle', 0.8);
      if (i % 4 === 0) nota(base / 2, t0 + i * paso, paso * 3.5, 'sine', 0.7); // bajo
    }
    timer = setTimeout(() => alTerminar?.(), total * paso * 1000);
    return true;
  } catch { return false; }
}

// Fragmento real (URL de iTunes). La promesa se rechaza si el navegador no puede reproducirlo.
export function reproducirUrl(url, alTerminar) {
  detener();
  pista = new Audio(url);
  pista.onended = () => alTerminar?.();
  return pista.play();
}
