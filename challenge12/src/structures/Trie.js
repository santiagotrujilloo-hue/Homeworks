class NodoTrie {
  constructor() {
    this.hijos = new Map();
    this.producto = null;
  }
}
class Trie {
  constructor() {
    this.raiz = new NodoTrie();
  }
  normalizar(texto) {
    return String(texto ?? "").trim().toLowerCase();
  }
  insertar(nombre, popularidad) {
    const nombreLimpio = String(nombre ?? "").trim();
    const clave = this.normalizar(nombreLimpio);
    const valor = Number(popularidad);
    if (!clave) {
      throw new Error("Debes ingresar el nombre del producto.");
    }
    if (!Number.isFinite(valor) || valor < 0 || !Number.isInteger(valor)) {
      throw new Error("La popularidad debe ser un número entero positivo o cero.");
    }
    let nodo = this.raiz;
    for (const letra of clave) {
      if (!nodo.hijos.has(letra)) {
        nodo.hijos.set(letra, new NodoTrie());
      }
      nodo = nodo.hijos.get(letra);
    }
    nodo.producto = {
      nombre: nombreLimpio,
      popularidad: valor,
    };
  }
  buscarPorPrefijo(prefijo) {
    const texto = this.normalizar(prefijo);
    let nodo = this.raiz;
    for (const letra of texto) {
      if (!nodo.hijos.has(letra)) {
        return [];
      }
      nodo = nodo.hijos.get(letra);
    }
    const resultados = [];
    const recorrer = (actual) => {
      if (actual.producto !== null) {
        resultados.push({ ...actual.producto });
      }
      for (const hijo of actual.hijos.values()) {
        recorrer(hijo);
      }
    };
    recorrer(nodo);
    return resultados;
  }
  buscarExacto(nombre) {
    const clave = this.normalizar(nombre);
    if (!clave) {
      return null;
    }
    let nodo = this.raiz;
    for (const letra of clave) {
      if (!nodo.hijos.has(letra)) {
        return null;
      }
      nodo = nodo.hijos.get(letra);
    }
    return nodo.producto ? { ...nodo.producto } : null;
  }
}
export default Trie;