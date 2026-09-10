// Lista circular simple
// el ultimo nodo apunta de nuevo al primero (tail.next = head)

class Node {
  constructor(doctor) {
    this.doctor = doctor;
    this.next = null;
  }
}

export class RotacionDoctores {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
  }

  agregar(doctor) {
    const nodo = new Node(doctor);
    if (this.head === null) {
      this.head = nodo;
      this.tail = nodo;
      nodo.next = nodo; // se apunta a si mismo
      this.current = nodo;
    } else {
      nodo.next = this.head;
      this.tail.next = nodo;
      this.tail = nodo;
    }
  }

  // pasa al siguiente doctor. como es circular, del ultimo pasa al primero
  siguiente() {
    if (this.current) this.current = this.current.next;
  }

  getAll() {
    const doctores = [];
    let nodo = this.head;
    do {
      doctores.push(nodo.doctor);
      nodo = nodo.next;
    } while (nodo !== this.head);
    return doctores;
  }
}

export function crearRotacion() {
  const rotacion = new RotacionDoctores();
  rotacion.agregar({ nombre: 'Dr. Pérez', especialidad: 'Medicina general' });
  rotacion.agregar({ nombre: 'Dra. López', especialidad: 'Urgencias' });
  rotacion.agregar({ nombre: 'Dr. Ramírez', especialidad: 'Pediatría' });
  return rotacion;
}
