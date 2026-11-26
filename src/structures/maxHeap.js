// Max Heap (arreglo binario): la canción más escuchada siempre está en la raíz
export class MaxHeap {
  constructor() { this.datos = []; }

  get tamano() { return this.datos.length; }
  verMax() { return this.datos[0] ?? null; }

  // Insertar: O(log n)
  insertar(cancion) { // { titulo, reproducciones, ... }
    this.datos.push(cancion);
    this._subir(this.datos.length - 1);
  }

  // Extraer la más escuchada: O(log n)
  extraerMax() {
    if (!this.datos.length) return null;
    const max = this.datos[0];
    const ultimo = this.datos.pop();
    if (this.datos.length) { this.datos[0] = ultimo; this._bajar(0); }
    return max;
  }

  // TOP n sin destruir el heap original: O(n + k log n)
  top(n) {
    const copia = new MaxHeap();
    copia.datos = [...this.datos];
    const res = [];
    while (res.length < n && copia.tamano) res.push(copia.extraerMax());
    return res;
  }

  _subir(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.datos[p].reproducciones >= this.datos[i].reproducciones) break;
      [this.datos[p], this.datos[i]] = [this.datos[i], this.datos[p]];
      i = p;
    }
  }

  _bajar(i) {
    const n = this.datos.length;
    for (;;) {
      let mayor = i;
      const izq = 2 * i + 1, der = 2 * i + 2;
      if (izq < n && this.datos[izq].reproducciones > this.datos[mayor].reproducciones) mayor = izq;
      if (der < n && this.datos[der].reproducciones > this.datos[mayor].reproducciones) mayor = der;
      if (mayor === i) break;
      [this.datos[mayor], this.datos[i]] = [this.datos[i], this.datos[mayor]];
      i = mayor;
    }
  }
}
