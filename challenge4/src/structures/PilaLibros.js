class PilaLibros {
  constructor() {
    this.libros = [];
  }

  push(libro) {
    this.libros.push(libro);
  }

  pop() {
    if (this.estaVacia()) {
      return null;
    }

    return this.libros.pop();
  }

  peek() {
    if (this.estaVacia()) {
      return null;
    }

    return this.libros[this.libros.length - 1];
  }

  estaVacia() {
    return this.libros.length === 0;
  }

  cantidad() {
    return this.libros.length;
  }

  obtenerLibros() {
    return [...this.libros].reverse();
  }
}

export default PilaLibros;