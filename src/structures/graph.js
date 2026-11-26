// Grafo no dirigido con lista de adyacencia: canciones relacionadas
export class Grafo {
  constructor() { this.ady = new Map(); } // titulo -> Set(titulos)

  agregarCancion(t) { if (!this.ady.has(t)) this.ady.set(t, new Set()); }

  // No dirigido: la arista se guarda en ambos sentidos
  conectar(a, b) {
    if (a === b) return;
    this.agregarCancion(a); this.agregarCancion(b);
    this.ady.get(a).add(b);
    this.ady.get(b).add(a);
  }

  sonVecinas(a, b) { return this.ady.get(a)?.has(b) ?? false; }
  relacionadas(t) { return [...(this.ady.get(t) ?? [])]; }

  totalAristas() {
    let suma = 0;
    for (const v of this.ady.values()) suma += v.size;
    return suma / 2; // cada arista se cuenta dos veces
  }

  // Recomendaciones por BFS hasta "profundidad" saltos, sin incluir la canción base
  recomendar(t, profundidad = 2) {
    if (!this.ady.has(t)) return [];
    const visitado = new Set([t]);
    let cola = [t];
    const res = [];
    for (let nivel = 0; nivel < profundidad; nivel++) {
      const siguiente = [];
      for (const actual of cola)
        for (const v of this.ady.get(actual))
          if (!visitado.has(v)) { visitado.add(v); res.push(v); siguiente.push(v); }
      cola = siguiente;
    }
    return res;
  }
}
