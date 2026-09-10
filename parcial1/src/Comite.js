// Lista circular doblemente enlazada
// el circulo se cierra en los dos sentidos: head.prev = tail y tail.next = head

class Node {
  constructor(miembro) {
    this.miembro = miembro;
    this.prev = null;
    this.next = null;
  }
}

export class Comite {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
  }

  agregar(miembro) {
    const nodo = new Node(miembro);
    if (this.head === null) {
      this.head = nodo;
      this.tail = nodo;
      nodo.next = nodo;
      nodo.prev = nodo;
      this.current = nodo;
    } else {
      nodo.prev = this.tail;
      nodo.next = this.head;
      this.tail.next = nodo;
      this.head.prev = nodo;
      this.tail = nodo;
    }
  }

  siguiente() {
    if (this.current) this.current = this.current.next;
  }

  anterior() {
    if (this.current) this.current = this.current.prev;
  }

  getAll() {
    const miembros = [];
    let nodo = this.head;
    do {
      miembros.push(nodo.miembro);
      nodo = nodo.next;
    } while (nodo !== this.head);
    return miembros;
  }
}

export function crearComite() {
  const comite = new Comite();
  comite.agregar({ nombre: 'Dra. Medina', rol: 'Directora médica' });
  comite.agregar({ nombre: 'Sr. Vargas', rol: 'Subdirector administrativo' });
  comite.agregar({ nombre: 'Sra. Rojas', rol: 'Tesorera' });
  return comite;
}
