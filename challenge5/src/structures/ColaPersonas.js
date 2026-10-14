class ColaPersonas {
  constructor() {
    this.personas = [];
  }

  enqueue(persona) {
    this.personas.push(persona);

    this.personas.sort(
      (a, b) => new Date(a.fechaLlegada) - new Date(b.fechaLlegada)
    );
  }

  dequeue() {
    if (this.estaVacia()) {
      return null;
    }

    return this.personas.shift();
  }

  front() {
    if (this.estaVacia()) {
      return null;
    }

    return this.personas[0];
  }

  estaVacia() {
    return this.personas.length === 0;
  }

  tamaño() {
    return this.personas.length;
  }

  obtenerPersonas() {
    return [...this.personas];
  }
}

export default ColaPersonas;