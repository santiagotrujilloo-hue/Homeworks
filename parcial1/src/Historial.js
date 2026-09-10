// Lista doblemente enlazada
// cada nodo apunta al anterior (prev) y al siguiente (next)

class Node {
  constructor(registro) {
    this.registro = registro;
    this.prev = null;
    this.next = null;
  }
}

export class Historial {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
  }

  agregar(registro) {
    const nodo = new Node(registro);
    if (this.head === null) {
      this.head = nodo;
      this.tail = nodo;
    } else {
      nodo.prev = this.tail;
      this.tail.next = nodo;
      this.tail = nodo;
    }
    this.current = nodo;
  }

  atras() {
    if (this.current && this.current.prev) this.current = this.current.prev;
  }

  adelante() {
    if (this.current && this.current.next) this.current = this.current.next;
  }

  getAll() {
    const registros = [];
    let nodo = this.head;
    while (nodo !== null) {
      registros.push(nodo.registro);
      nodo = nodo.next;
    }
    return registros;
  }
}

export function crearHistorial() {
  const historial = new Historial();
  historial.agregar({ id: 'P-101', nombre: 'Laura Peña', doctor: 'Dra. López', hora: '08:10 am' });
  historial.agregar({ id: 'P-102', nombre: 'Esteban Cano', doctor: 'Dr. Pérez', hora: '08:32 am' });
  return historial;
}
