// Trie: buscador predictivo de canciones
export const normalizar = (t) =>
  t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

class TrieNode {
  constructor() {
    this.hijos = new Map(); // caracter -> TrieNode
    this.titulo = null;     // título original si el nodo es fin de palabra
  }
}

export class Trie {
  constructor() { this.raiz = new TrieNode(); this.tamano = 0; }

  // Insertar canción: O(L)
  insertar(titulo) {
    let nodo = this.raiz;
    for (const c of normalizar(titulo)) {
      if (!nodo.hijos.has(c)) nodo.hijos.set(c, new TrieNode());
      nodo = nodo.hijos.get(c);
    }
    if (nodo.titulo === null) this.tamano++;
    nodo.titulo = titulo;
  }

  _nodoDe(texto) {
    let nodo = this.raiz;
    for (const c of normalizar(texto)) {
      nodo = nodo.hijos.get(c);
      if (!nodo) return null;
    }
    return nodo;
  }

  // ¿Existe la canción exacta? O(L)
  buscar(titulo) {
    const nodo = this._nodoDe(titulo);
    return nodo !== null && nodo.titulo !== null;
  }

  // Sugerencias por prefijo: se baja hasta el prefijo y se recorre el subárbol (DFS)
  sugerir(prefijo, limite = 6) {
    const resultado = [];
    if (!normalizar(prefijo)) return resultado;
    const inicio = this._nodoDe(prefijo);
    if (!inicio) return resultado;
    const dfs = (n) => {
      if (resultado.length >= limite) return;
      if (n.titulo !== null) resultado.push(n.titulo);
      for (const h of n.hijos.values()) dfs(h);
    };
    dfs(inicio);
    return resultado;
  }
}
