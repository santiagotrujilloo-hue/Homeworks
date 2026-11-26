class MinHeap {
  constructor() {
    this.elementos = [];
  }
  comparar(a, b) {
    if (a.popularidad !== b.popularidad) {
      return a.popularidad - b.popularidad;
    }
    return b.nombre.localeCompare(a.nombre);
  }
  tamano() {
    return this.elementos.length;
  }
  verMinimo() {
    return this.elementos[0] ?? null;
  }
  insertar(producto) {
    this.elementos.push(producto);
    this.subir(this.elementos.length - 1);
  }
  subir(indice) {
    while (indice > 0) {
      const padre = Math.floor((indice - 1) / 2);
      if (this.comparar(this.elementos[indice], this.elementos[padre]) >= 0) {
        break;
      }
      [this.elementos[indice], this.elementos[padre]] = [
        this.elementos[padre],
        this.elementos[indice],
      ];
      indice = padre;
    }
  }
  extraerMinimo() {
    if (this.elementos.length === 0) {
      return null;
    }
    if (this.elementos.length === 1) {
      return this.elementos.pop();
    }
    const minimo = this.elementos[0];
    this.elementos[0] = this.elementos.pop();
    this.bajar(0);
    return minimo;
  }
  bajar(indice) {
    const longitud = this.elementos.length;
    while (true) {
      const izquierdo = 2 * indice + 1;
      const derecho = 2 * indice + 2;
      let menor = indice;
      if (
        izquierdo < longitud &&
        this.comparar(this.elementos[izquierdo], this.elementos[menor]) < 0
      ) {
        menor = izquierdo;
      }
      if (
        derecho < longitud &&
        this.comparar(this.elementos[derecho], this.elementos[menor]) < 0
      ) {
        menor = derecho;
      }
      if (menor === indice) {
        break;
      }
      [this.elementos[indice], this.elementos[menor]] = [
        this.elementos[menor],
        this.elementos[indice],
      ];
      indice = menor;
    }
  }
  static obtenerTopK(productos, k) {
    const limite = Math.max(0, Math.floor(Number(k) || 0));
    if (limite === 0) {
      return [];
    }
    const heap = new MinHeap();
    for (const producto of productos) {
      if (heap.tamano() < limite) {
        heap.insertar(producto);
      } else if (heap.comparar(producto, heap.verMinimo()) > 0) {
        heap.extraerMinimo();
        heap.insertar(producto);
      }
    }
    const resultados = [];
    while (heap.tamano() > 0) {
      resultados.push(heap.extraerMinimo());
    }
    return resultados.reverse();
  }
}
export default MinHeap;