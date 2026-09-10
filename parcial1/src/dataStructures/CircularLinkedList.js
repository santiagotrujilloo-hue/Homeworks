// Punto 3: Lista circular simple (circular linked list)
// Los médicos de guardia forman un círculo: el último apunta de nuevo al
// primero (tail.next === head). El puntero "current" avanza sin fin,
// simulando la rotación automática del médico de turno.

export class DoctorNode {
  constructor(doctor) {
    this.doctor = doctor; // { name, specialty }
    this.next = null;
  }
}

export class CircularLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null; // médico actualmente de guardia
    this.size = 0;
  }

  append(doctor) {
    const node = new DoctorNode(doctor);
    if (!this.head) {
      this.head = node;
      this.tail = node;
      node.next = node; // se apunta a sí mismo mientras es el único
      this.current = node;
    } else {
      node.next = this.head;
      this.tail.next = node;
      this.tail = node;
    }
    this.size += 1;
    return this;
  }

  // Avanza la guardia al siguiente médico; al llegar al final vuelve al
  // primero automáticamente porque la lista es circular.
  next() {
    if (this.current) this.current = this.current.next;
    return this.current;
  }

  toArray() {
    const result = [];
    let node = this.head;
    for (let i = 0; i < this.size; i += 1) {
      result.push(node.doctor);
      node = node.next;
    }
    return result;
  }
}

// Datos simulados: médicos disponibles para la rotación de guardia
export function buildMockDoctorRotation() {
  const list = new CircularLinkedList();
  const doctors = [
    { name: 'Dr. Pérez', specialty: 'Medicina general' },
    { name: 'Dra. López', specialty: 'Urgencias' },
    { name: 'Dr. Ramírez', specialty: 'Pediatría' },
    { name: 'Dra. Torres', specialty: 'Medicina interna' },
  ];
  doctors.forEach((d) => list.append(d));
  return list;
}
